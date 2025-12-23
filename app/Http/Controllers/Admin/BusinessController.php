<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBusinessRequest;
use App\Http\Requests\Admin\UpdateBusinessRequest;
use App\Models\Business;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class BusinessController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Businesses/Index', [
            'businesses' => Business::with('owner')->paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Businesses/Create');
    }

    public function store(StoreBusinessRequest $request)
    {
        DB::transaction(function () use ($request) {
            $business = Business::create($request->validated());

            $owner = User::create([
                'name' => $request->owner_name,
                'email' => $request->owner_email,
                'password' => Hash::make($request->owner_password),
                'business_id' => $business->id,
                'role' => UserRole::BUSINESS_OWNER,
            ]);

            $business->update(['owner_id' => $owner->id]);
        });

        return redirect()->route('admin.businesses.index')
            ->with('success', 'Business created successfully.');
    }

    public function edit(Business $business)
    {
        return Inertia::render('Admin/Businesses/Edit', [
            'business' => $business->load('owner'),
        ]);
    }

    public function update(UpdateBusinessRequest $request, Business $business)
    {
        $business->update($request->validated());

        return redirect()->route('admin.businesses.index')
            ->with('success', 'Business updated successfully.');
    }

    public function toggleStatus(Business $business)
    {
        $business->update(['is_active' => !$business->is_active]);

        return back()->with('success', 'Status updated successfully.');
    }
}
