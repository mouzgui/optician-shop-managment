<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Http\Requests\Business\StoreStaffRequest;
use App\Models\User;
use App\Models\Branch;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', User::class);

        return Inertia::render('Business/Staff/Index', [
            'staff' => User::with('branch')
                ->where('business_id', auth()->user()->business_id)
                ->where('id', '!=', auth()->id())
                ->paginate(10),
        ]);
    }

    public function create()
    {
        $this->authorize('create', User::class);

        return Inertia::render('Business/Staff/Create', [
            'branches' => Branch::all(),
        ]);
    }

    public function store(StoreStaffRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        $data['business_id'] = $request->user()->business_id;

        User::create($data);

        return redirect()->route('business.staff.index')
            ->with('success', 'Staff member created successfully.');
    }

    public function edit(User $staff)
    {
        $this->authorize('update', $staff);

        return Inertia::render('Business/Staff/Edit', [
            'staff' => $staff,
            'branches' => Branch::all(),
        ]);
    }

    public function update(StoreStaffRequest $request, User $staff)
    {
        $data = $request->validated();
        
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $staff->update($data);

        return redirect()->route('business.staff.index')
            ->with('success', 'Staff member updated successfully.');
    }

    public function toggleStatus(User $staff)
    {
        $this->authorize('update', $staff);

        $staff->update(['is_active' => !$staff->is_active]);

        return back()->with('success', 'Staff status updated successfully.');
    }
}
