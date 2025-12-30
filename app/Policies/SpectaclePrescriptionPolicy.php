<?php

namespace App\Policies;

use App\Models\SpectaclePrescription;
use App\Models\User;

class SpectaclePrescriptionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->business_id !== null;
    }

    public function view(User $user, SpectaclePrescription $rx): bool
    {
        return $user->business_id === $rx->business_id;
    }

    public function create(User $user): bool
    {
        return $user->business_id !== null;
    }

    public function update(User $user, SpectaclePrescription $rx): bool
    {
        return $user->business_id === $rx->business_id;
    }

    public function delete(User $user, SpectaclePrescription $rx): bool
    {
        return $user->isBusinessOwner() && $user->business_id === $rx->business_id;
    }
}
