<?php

namespace App\Http\Controllers\Sales;

use App\Models\Customer;
use App\Models\Branch;
use App\Http\Requests\Sales\StoreCustomerRequest;
use App\Http\Requests\Sales\UpdateCustomerRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Customer::query()
            ->with(['branch'])
            ->latest();

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        return Inertia::render('Sales/Customers/Index', [
            'customers' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Sales/Customers/Create', [
            'branches' => Branch::active()->get(['id', 'name']),
            'potentialFamilyHeads' => Customer::whereNull('family_head_id')
                ->get(['id', 'first_name', 'last_name', 'phone']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request)
    {
        $validated = $request->validated();
        $validated['business_id'] = auth()->user()->business_id;
        $validated['created_by'] = auth()->id();

        $customer = Customer::create($validated);

        return redirect()->route('business.customers.show', $customer)
            ->with('success', 'Customer created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        $customer->load([
            'branch',
            'familyHead',
            'familyMembers',
            'spectaclePrescriptions.prescribedBy',
            'contactLensPrescriptions.prescribedBy',
            'invoices'
        ]);

        return Inertia::render('Sales/Customers/Show', [
            'customer' => $customer,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        return Inertia::render('Sales/Customers/Edit', [
            'customer' => $customer,
            'branches' => Branch::active()->get(['id', 'name']),
            'potentialFamilyHeads' => Customer::whereNull('family_head_id')
                ->where('id', '!=', $customer->id)
                ->get(['id', 'first_name', 'last_name', 'phone']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $customer->update($request->validated());

        return redirect()->route('business.customers.show', $customer)
            ->with('success', 'Customer updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect()->route('business.customers.index')
            ->with('success', 'Customer deleted successfully.');
    }
}
