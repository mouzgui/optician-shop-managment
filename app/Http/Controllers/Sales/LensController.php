<?php

namespace App\Http\Controllers\Sales;

use App\Models\Lens;
use App\Http\Requests\Sales\StoreLensRequest;
use App\Http\Requests\Sales\UpdateLensRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LensController extends Controller
{
    public function index(Request $request)
    {
        $query = Lens::query()
            ->where('business_id', auth()->user()->business_id)
            ->latest();

        if ($request->filled('search')) {
            $term = $request->search;
            $query->where(function ($q) use ($term) {
                $q->where('brand', 'like', "%{$term}%")
                    ->orWhere('name', 'like', "%{$term}%")
                    ->orWhere('type', 'like', "%{$term}%");
            });
        }

        return Inertia::render('Sales/Inventory/Lenses/Index', [
            'lenses' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Sales/Inventory/Lenses/Create');
    }

    public function store(StoreLensRequest $request)
    {
        $validated = $request->validated();
        $validated['business_id'] = auth()->user()->business_id;

        Lens::create($validated);

        return redirect()->route('business.inventory.lenses.index')
            ->with('success', 'Lens added to catalog successfully.');
    }

    public function edit(Lens $lens)
    {
        return Inertia::render('Sales/Inventory/Lenses/Edit', [
            'lens' => $lens,
        ]);
    }

    public function update(UpdateLensRequest $request, Lens $lens)
    {
        $lens->update($request->validated());

        return redirect()->route('business.inventory.lenses.index')
            ->with('success', 'Lens updated successfully.');
    }

    public function destroy(Lens $lens)
    {
        $lens->delete();

        return redirect()->route('business.inventory.lenses.index')
            ->with('success', 'Lens deleted successfully.');
    }
}
