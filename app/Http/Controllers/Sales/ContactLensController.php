<?php

namespace App\Http\Controllers\Sales;

use App\Models\ContactLens;
use App\Http\Requests\Sales\StoreContactLensRequest;
use App\Http\Requests\Sales\UpdateContactLensRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactLensController extends Controller
{
    public function index(Request $request)
    {
        $query = ContactLens::query()
            ->where('business_id', auth()->user()->business_id)
            ->latest();

        if ($request->filled('search')) {
            $term = $request->search;
            $query->where(function ($q) use ($term) {
                $q->where('brand', 'like', "%{$term}%")
                    ->orWhere('product_line', 'like', "%{$term}%");
            });
        }

        return Inertia::render('Sales/Inventory/ContactLenses/Index', [
            'contactLenses' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Sales/Inventory/ContactLenses/Create');
    }

    public function store(StoreContactLensRequest $request)
    {
        $validated = $request->validated();
        $validated['business_id'] = auth()->user()->business_id;

        ContactLens::create($validated);

        return redirect()->route('business.inventory.contact-lenses.index')
            ->with('success', 'Contact lens added to inventory successfully.');
    }

    public function edit(ContactLens $contactLens)
    {
        return Inertia::render('Sales/Inventory/ContactLenses/Edit', [
            'contactLens' => $contactLens,
        ]);
    }

    public function update(UpdateContactLensRequest $request, ContactLens $contactLens)
    {
        $contactLens->update($request->validated());

        return redirect()->route('business.inventory.contact-lenses.index')
            ->with('success', 'Contact lens updated successfully.');
    }

    public function destroy(ContactLens $contactLens)
    {
        $contactLens->delete();

        return redirect()->route('business.inventory.contact-lenses.index')
            ->with('success', 'Contact lens deleted successfully.');
    }
}
