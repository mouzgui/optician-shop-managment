<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;

class InvoicePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->business_id !== null;
    }

    public function view(User $user, Invoice $invoice): bool
    {
        return $user->business_id === $invoice->business_id;
    }

    public function create(User $user): bool
    {
        return $user->business_id !== null;
    }

    public function update(User $user, Invoice $invoice): bool
    {
        return $user->isBusinessOwner() && $user->business_id === $invoice->business_id;
    }

    public function delete(User $user, Invoice $invoice): bool
    {
        return $user->isBusinessOwner() && $user->business_id === $invoice->business_id;
    }
}
