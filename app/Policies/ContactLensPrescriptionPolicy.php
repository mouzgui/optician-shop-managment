<?php

namespace App\Policies;

use App\Models\ContactLensPrescription;
use App\Models\User;

class ContactLensPrescriptionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->business_id !== null;
    }

    public function view(User $user, ContactLensPrescription $rx): bool
    {
        return $user->business_id === $rx->business_id;
    }

    public function create(User $user): bool
    {
        return $user->business_id !== null;
    }

    public function update(User $user, ContactLensPrescription $rx): bool
    {
        return $user->business_id === $rx->business_id;
    }

    public function delete(User $user, ContactLensPrescription $rx): bool
    {
        return $user->isBusinessOwner() && $user->business_id === $rx->business_id;
    }
}
