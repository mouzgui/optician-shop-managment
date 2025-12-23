<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\Frame;
use App\Models\Lens;
use App\Models\ContactLens;
use App\Models\Customer;
use App\Services\InvoiceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class POSController extends Controller
{
    protected $invoiceService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    /**
     * Display the POS interface.
     */
    public function index()
    {
        $user = Auth::user()->load('business.branches');
        
        return Inertia::render('Sales/POS/Index', [
            'branches' => $user->business->branches->where('is_active', true)->map(fn($b) => [
                'id' => $b->id,
                'name' => $b->name,
            ]),
            'customers' => Customer::where('business_id', $user->business_id)
                ->orderBy('first_name')
                ->limit(20)
                ->get(),
        ]);
    }

    /**
     * Search for products (frames, lenses, contact lenses).
     */
    public function searchProducts(Request $request)
    {
        $query = $request->get('q');
        $type = $request->get('type', 'all'); // 'all', 'frame', 'lens', 'contact_lens'

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $results = [];

        // Search Frames
        if ($type === 'all' || $type === 'frame') {
            $frames = Frame::where('business_id', Auth::user()->business_id)
                ->where(function($q) use ($query) {
                    $q->where('brand', 'like', "%{$query}%")
                      ->orWhere('model', 'like', "%{$query}%")
                      ->orWhere('sku', 'like', "%{$query}%")
                      ->orWhere('barcode', 'like', "%{$query}%");
                })
                ->where('is_active', true)
                ->select(['id', 'brand', 'model', 'sku', 'color_name', 'selling_price', 'quantity'])
                ->limit(10)
                ->get()
                ->map(fn($f) => [
                    'id' => $f->id,
                    'type' => 'frame',
                    'name' => "{$f->brand} {$f->model}",
                    'price' => $f->selling_price,
                    'stock' => $f->quantity,
                    'meta' => "SKU: {$f->sku} | Color: {$f->color_name}",
                ]);
            $results = array_merge($results, $frames->toArray());
        }

        // Search Lenses (Catalog)
        if ($type === 'all' || $type === 'lens') {
            $lenses = Lens::where('business_id', Auth::user()->business_id)
                ->where('name', 'like', "%{$query}%")
                ->where('is_active', true)
                ->select(['id', 'name', 'selling_price', 'type', 'index'])
                ->limit(10)
                ->get()
                ->map(fn($l) => [
                    'id' => $l->id,
                    'type' => 'lens',
                    'name' => $l->name,
                    'price' => $l->selling_price,
                    'stock' => null,
                    'meta' => "{$l->type} | Index: {$l->index}",
                ]);
            $results = array_merge($results, $lenses->toArray());
        }

        // Search Contact Lenses
        if ($type === 'all' || $type === 'contact_lens') {
            $cl = ContactLens::where('business_id', Auth::user()->business_id)
                ->where(function($q) use ($query) {
                    $q->where('brand', 'like', "%{$query}%")
                      ->orWhere('product_line', 'like', "%{$query}%");
                })
                ->select(['id', 'brand', 'product_line', 'selling_price_per_box', 'boxes_in_stock', 'power', 'base_curve'])
                ->limit(10)
                ->get()
                ->map(fn($c) => [
                    'id' => $c->id,
                    'type' => 'contact_lens',
                    'name' => "{$c->brand} {$c->product_line}",
                    'price' => $c->selling_price_per_box,
                    'stock' => $c->boxes_in_stock,
                    'meta' => "Power: {$c->power} | BC: {$c->base_curve}",
                ]);
            $results = array_merge($results, $cl->toArray());
        }

        return response()->json($results);
    }

    /**
     * Get prescriptions for a specific customer.
     */
    public function getCustomerPrescriptions(Customer $customer)
    {
        $this->authorize('view', $customer);

        $spectacleRx = $customer->spectaclePrescriptions()
            ->latest()
            ->get()
            ->map(fn($rx) => [
                'id' => $rx->id,
                'type' => 'spectacle',
                'date' => $rx->created_at->format('Y-m-d'),
                'doctor' => $rx->prescribed_by_name ?? 'Internal',
                'notes' => $rx->notes,
            ]);

        $contactLensRx = $customer->contactLensPrescriptions()
            ->latest()
            ->get()
            ->map(fn($rx) => [
                'id' => $rx->id,
                'type' => 'contact_lens',
                'date' => $rx->created_at->format('Y-m-d'),
                'doctor' => $rx->prescribed_by_name ?? 'Internal',
                'notes' => $rx->notes,
            ]);

        return response()->json(array_merge($spectacleRx->toArray(), $contactLensRx->toArray()));
    }

    /**
     * Process the POS checkout and create an invoice.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'branch_id' => 'required|exists:branches,id',
            'items' => 'required|array|min:1',
            'items.*.item_type' => 'required|in:frame,lens,contact_lens,service',
            'items.*.item_id' => 'nullable|integer',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.discount' => 'nullable|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'discount_type' => 'nullable|string',
            'tax_amount' => 'nullable|numeric|min:0',
            'initial_payment' => 'nullable|array',
            'initial_payment.amount' => 'nullable|numeric|min:0',
            'initial_payment.payment_method' => 'nullable|string',
            'initial_payment.reference' => 'nullable|string',
            'prescription_id' => 'nullable|integer',
            'prescription_type' => 'nullable|string',
            'notes' => 'nullable|string',
            'estimated_pickup' => 'nullable|date',
        ]);

        try {
            $invoice = $this->invoiceService->createInvoice(
                $validated,
                $validated['items'],
                $validated['initial_payment'] ?? null
            );

            return redirect()->route('business.sales.invoices.show', $invoice->id)
                ->with('success', 'Invoice created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create invoice: ' . $e->getMessage()]);
        }
    }
}
