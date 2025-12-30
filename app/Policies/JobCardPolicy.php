<?php

namespace App\Policies;

use App\Models\JobCard;
use App\Models\User;

class JobCardPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->business_id !== null;
    }

    public function view(User $user, JobCard $jobCard): bool
    {
        return $user->business_id === $jobCard->business_id;
    }

    public function create(User $user): bool
    {
        return $user->business_id !== null;
    }

    public function update(User $user, JobCard $jobCard): bool
    {
        return $user->business_id === $jobCard->business_id;
    }

    public function delete(User $user, JobCard $jobCard): bool
    {
        return $user->isBusinessOwner() && $user->business_id === $jobCard->business_id;
    }
}
