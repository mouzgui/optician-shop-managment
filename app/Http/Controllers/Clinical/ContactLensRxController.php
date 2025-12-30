<?php

namespace App\Http\Controllers\Clinical;

use App\Models\ContactLensPrescription;
use App\Models\Customer;
use App\Http\Controllers\Controller;
use App\Http\Requests\Clinical\StoreContactLensRxRequest;
use App\Http\Requests\Clinical\UpdateContactLensRxRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactLensRxController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $customer = Customer::findOrFail($request->customer_id);

        return Inertia::render('Clinical/ContactLensRx/Create', [
            'customer' => $customer,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContactLensRxRequest $request)
    {
        $validated = $request->validated();
        $validated['business_id'] = auth()->user()->business_id;
        $validated['prescribed_by'] = auth()->id();

        ContactLensPrescription::create($validated);

        return redirect()->back()->with('success', 'Contact lens prescription added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ContactLensPrescription $contactLensRx)
    {
        return response()->json($contactLensRx->load('prescribedBy'));
    }

    public function downloadPdf(ContactLensPrescription $contactLensRx)
    {
        $this->authorize('view', $contactLensRx);
        
        $business = auth()->user()->business;
        $contactLensRx->load(['customer', 'prescribedBy']);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('prints.contact-lens-rx', [
            'rx' => $contactLensRx,
            'business' => $business,
        ]);

        return $pdf->download("contact-lens-rx-{$contactLensRx->customer->full_name}.pdf");
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContactLensRxRequest $request, ContactLensPrescription $contactLensRx)
    {
        $contactLensRx->update($request->validated());

        return redirect()->back()->with('success', 'Contact lens prescription updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ContactLensPrescription $contactLensRx)
    {
        $contactLensRx->delete();

        return redirect()->back()->with('success', 'Contact lens prescription deleted successfully.');
    }
}
