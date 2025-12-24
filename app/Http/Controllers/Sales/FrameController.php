<?php

namespace App\Http\Controllers\Sales;

use App\Models\Frame;
use App\Http\Requests\Sales\StoreFrameRequest;
use App\Http\Requests\Sales\UpdateFrameRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FrameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Frame::query()
            ->where('business_id', auth()->user()->business_id)
            ->latest();

        if ($request->filled('search')) {
            $term = $request->search;
            $query->where(function ($q) use ($term) {
                $q->where('sku', 'like', "%{$term}%")
                    ->orWhere('barcode', 'like', "%{$term}%")
                    ->orWhere('brand', 'like', "%{$term}%")
                    ->orWhere('model', 'like', "%{$term}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->boolean('low_stock')) {
            $query->lowStock();
        }

        return Inertia::render('Sales/Inventory/Frames/Index', [
            'frames' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only(['search', 'category', 'low_stock']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Sales/Inventory/Frames/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFrameRequest $request)
    {
        $validated = $request->validated();
        $validated['business_id'] = auth()->user()->business_id;

        Frame::create($validated);

        return redirect()->route('business.inventory.frames.index')
            ->with('success', 'Frame added to inventory successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Frame $frame)
    {
        return Inertia::render('Sales/Inventory/Frames/Edit', [
            'frame' => $frame,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFrameRequest $request, Frame $frame)
    {
        $frame->update($request->validated());

        return redirect()->route('business.inventory.frames.index')
            ->with('success', 'Frame updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Frame $frame)
    {
        $frame->delete();

        return redirect()->route('business.inventory.frames.index')
            ->with('success', 'Frame deleted successfully.');
    }

    /**
     * Lookup frame by barcode.
     */
    public function lookupBarcode($barcode)
    {
        $frame = Frame::where('barcode', $barcode)
            ->active()
            ->first();

        if (!$frame) {
            return response()->json(['found' => false], 404);
        }

        return response()->json([
            'found' => true,
            'frame' => $frame,
        ]);
    }
}
