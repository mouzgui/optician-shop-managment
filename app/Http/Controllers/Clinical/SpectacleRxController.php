<?php

namespace App\Http\Controllers\Clinical;

use App\Models\SpectaclePrescription;
use App\Models\Customer;
use App\Http\Controllers\Controller;
use App\Http\Requests\Clinical\StoreSpectacleRxRequest;
use App\Http\Requests\Clinical\UpdateSpectacleRxRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SpectacleRxController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $customer = Customer::findOrFail($request->customer_id);

        return Inertia::render('Clinical/SpectacleRx/Create', [
            'customer' => $customer,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSpectacleRxRequest $request)
    {
        $validated = $request->validated();
        $validated['business_id'] = auth()->user()->business_id;
        $validated['prescribed_by'] = auth()->id();

        SpectaclePrescription::create($validated);

        return redirect()->back()->with('success', 'Spectacle prescription added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(SpectaclePrescription $spectacleRx)
    {
        return response()->json($spectacleRx->load('prescribedBy'));
    }

    public function downloadPdf(SpectaclePrescription $spectacleRx)
    {
        $this->authorize('view', $spectacleRx);
        
        $business = auth()->user()->business;
        $spectacleRx->load(['customer', 'prescribedBy']);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('prints.spectacle-rx', [
            'rx' => $spectacleRx,
            'business' => $business,
        ]);

        return $pdf->download("spectacle-rx-{$spectacleRx->customer->full_name}.pdf");
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSpectacleRxRequest $request, SpectaclePrescription $spectacleRx)
    {
        $spectacleRx->update($request->validated());

        return redirect()->back()->with('success', 'Spectacle prescription updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SpectaclePrescription $spectacleRx)
    {
        $spectacleRx->delete();

        return redirect()->back()->with('success', 'Spectacle prescription deleted successfully.');
    }
}
