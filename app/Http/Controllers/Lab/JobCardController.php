<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\JobCard;
use App\Enums\JobCardStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class JobCardController extends Controller
{
    public function index()
    {
        $jobCards = JobCard::with(['invoice.customer', 'invoice.branch'])
            ->where('business_id', Auth::user()->business_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Lab/JobCards/Index', [
            'jobCards' => $jobCards,
            'statuses' => JobCardStatus::cases(),
        ]);
    }

    public function show(JobCard $jobCard)
    {
        $this->authorizeBusiness($jobCard);
        
        $jobCard->load(['invoice.customer', 'invoice.branch', 'invoice.prescription']);

        return Inertia::render('Lab/JobCards/Show', [
            'jobCard' => $jobCard,
        ]);
    }

    public function print(JobCard $jobCard)
    {
        $this->authorizeBusiness($jobCard);
        
        $jobCard->load(['invoice.customer', 'invoice.branch', 'invoice.prescription']);

        return view('prints.job-card', [
            'jobCard' => $jobCard,
            'business' => Auth::user()->business,
        ]);
    }

    public function updateStatus(Request $request, JobCard $jobCard)
    {
        $this->authorizeBusiness($jobCard);

        $validated = $request->validate([
            'status' => 'required|string',
        ]);

        $status = JobCardStatus::from($validated['status']);
        
        $updateData = ['status' => $status];

        if ($status === JobCardStatus::IN_PROGRESS && !$jobCard->started_at) {
            $updateData['started_at'] = now();
        }

        if ($status === JobCardStatus::COMPLETED) {
            $updateData['completed_at'] = now();
            $updateData['completed_by'] = Auth::id();
        }

        $jobCard->update($updateData);

        return back()->with('success', 'Job status updated successfully.');
    }

    protected function authorizeBusiness(JobCard $jobCard)
    {
        if ($jobCard->business_id !== Auth::user()->business_id) {
            abort(403);
        }
    }
}
