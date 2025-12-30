<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Frame;
use App\Models\ContactLens;
use App\Models\JobCard;
use App\Enums\InvoiceStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class InvoiceService
{
    /**
     * Create an invoice with items and an optional initial deposit.
     */
    public function createInvoice(array $data, array $items, ?array $initialPayment = null): Invoice
    {
        return DB::transaction(function () use ($data, $items, $initialPayment) {
            // Calculate totals
            $subtotal = collect($items)->sum('total');
            $discountAmount = $data['discount_amount'] ?? 0;
            $taxAmount = $data['tax_amount'] ?? 0;
            $total = ($subtotal - $discountAmount) + $taxAmount;

            $invoice = Invoice::create([
                'business_id' => Auth::user()->business_id,
                'branch_id' => $data['branch_id'],
                'customer_id' => $data['customer_id'],
                'status' => InvoiceStatus::DEPOSIT_PAID,
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'discount_type' => $data['discount_type'] ?? 'fixed',
                'tax_amount' => $taxAmount,
                'total' => $total,
                'amount_paid' => 0,
                'balance_due' => $total,
                'prescription_id' => $data['prescription_id'] ?? null,
                'prescription_type' => $data['prescription_type'] ?? null,
                'notes' => $data['notes'] ?? null,
                'estimated_pickup' => $data['estimated_pickup'] ?? null,
                'created_by' => Auth::id(),
            ]);

            foreach ($items as $item) {
                $invoice->items()->create([
                    'item_type' => $item['item_type'],
                    'item_id' => $item['item_id'] ?? null,
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'discount' => $item['discount'] ?? 0,
                    'total' => $item['total'],
                ]);
            }

            if ($initialPayment && $initialPayment['amount'] > 0) {
                $this->addPayment($invoice, [
                    'amount' => $initialPayment['amount'],
                    'payment_method' => $initialPayment['payment_method'],
                    'reference' => $initialPayment['reference'] ?? null,
                    'received_at' => now(),
                ]);
            }

            // Create Job Card if necessary
            JobCard::createFromInvoice($invoice);

            return $invoice->fresh();
        });
    }

    /**
     * Add a payment to an invoice.
     */
    public function addPayment(Invoice $invoice, array $paymentData): Payment
    {
        return DB::transaction(function () use ($invoice, $paymentData) {
            // Check if payment amount exceeds remaining balance
            if ($paymentData['amount'] > $invoice->balance_due) {
                throw new \Exception('Payment amount cannot exceed the remaining balance of ' . number_format($invoice->balance_due, 2));
            }

            $payment = $invoice->payments()->create([
                'business_id' => $invoice->business_id,
                'amount' => $paymentData['amount'],
                'payment_method' => $paymentData['payment_method'],
                'reference' => $paymentData['reference'] ?? null,
                'received_by' => Auth::id(),
                'received_at' => $paymentData['received_at'] ?? now(),
            ]);

            // Model events in Payment will update invoice balances
            return $payment;
        });
    }

    /**
     * Mark an invoice as completed and deduct stock.
     */
    public function completeInvoice(Invoice $invoice): void
    {
        DB::transaction(function () use ($invoice) {
            if (!$invoice->isPaid()) {
                throw new \Exception('Invoice must be fully paid before completion.');
            }

            foreach ($invoice->items as $item) {
                $this->deductStock($item);
            }

            $invoice->update([
                'status' => InvoiceStatus::COMPLETED,
                'actual_pickup' => now(),
            ]);
        });
    }

    /**
     * Deduct stock for an invoice item.
     */
    protected function deductStock($item): void
    {
        if (!$item->item_id) return;

        switch ($item->item_type) {
            case 'frame':
                $frame = Frame::find($item->item_id);
                if ($frame) {
                    $frame->decrement('quantity', $item->quantity);
                }
                break;
            case 'contact_lens':
                $cl = ContactLens::find($item->item_id);
                if ($cl) {
                    $cl->decrement('boxes_in_stock', $item->quantity);
                }
                break;
            // Lenses are catalog items (not stock-tracked)
        }
    }
}
