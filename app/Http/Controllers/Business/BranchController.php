<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Http\Requests\Business\StoreBranchRequest;
use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BranchController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Branch::class, 'branch');
    }

    public function index()
    {
        return Inertia::render('Business/Branches/Index', [
            'branches' => Branch::paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('Business/Branches/Create');
    }

    public function store(StoreBranchRequest $request)
    {
        $request->user()->business->branches()->create($request->validated());

        return redirect()->route('business.branches.index')
            ->with('success', 'Branch created successfully.');
    }

    public function edit(Branch $branch)
    {
        return Inertia::render('Business/Branches/Edit', [
            'branch' => $branch,
        ]);
    }

    public function update(StoreBranchRequest $request, Branch $branch)
    {
        $branch->update($request->validated());

        return redirect()->route('business.branches.index')
            ->with('success', 'Branch updated successfully.');
    }

    public function toggleStatus(Branch $branch)
    {
        $this->authorize('update', $branch);
        
        $branch->update(['is_active' => !$branch->is_active]);

        return back()->with('success', 'Branch status updated successfully.');
    }
}
