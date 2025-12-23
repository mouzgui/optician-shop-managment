<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class InvoiceController extends Controller
{
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
}
