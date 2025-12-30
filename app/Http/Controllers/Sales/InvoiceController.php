<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Services\InvoiceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class InvoiceController extends Controller
{
    protected $invoiceService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    /**
     * Display a listing of invoices.
     */
    public function index()
    {
        $invoices = Invoice::where('business_id', Auth::user()->business_id)
            ->with(['customer', 'branch'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Sales/Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    /**
     * Display the specified invoice.
     */
    public function show(Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        $invoice->load(['customer', 'branch', 'items', 'payments.receivedBy', 'prescription']);

        return Inertia::render('Sales/Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    /**
     * Download the invoice as PDF.
     */
    public function downloadPdf(Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        $invoice->load(['customer', 'branch', 'items', 'business']);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('prints.invoice', [
            'invoice' => $invoice,
        ]);

        return $pdf->download("invoice-{$invoice->invoice_number}.pdf");
    }

    /**
     * Add a payment to the specified invoice.
     */
    public function addPayment(Request $request, Invoice $invoice)
    {
        $this->authorize('update', $invoice);

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|string',
            'reference' => 'nullable|string',
            'received_at' => 'nullable|date',
        ]);

        try {
            $this->invoiceService->addPayment($invoice, $validated);
            return back()->with('success', 'Payment added successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
