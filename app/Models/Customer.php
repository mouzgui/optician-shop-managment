<?php

namespace App\Models;

use App\Models\Traits\BelongsToBusiness;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    use BelongsToBusiness, SoftDeletes;

    protected $fillable = [
        'business_id',
        'branch_id',
        'first_name',
        'last_name',
        'phone',
        'email',
        'address',
        'date_of_birth',
        'notes',
        'family_head_id',
        'rx_expiry_flagged',
        'last_visit_at',
        'created_by',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'last_visit_at' => 'datetime',
        'rx_expiry_flagged' => 'boolean',
    ];

    protected $appends = ['full_name'];

    // Accessors
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getAgeAttribute(): ?int
    {
        return $this->date_of_birth?->age;
    }

    // Relationships
    public function familyHead(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'family_head_id');
    }

    public function familyMembers(): HasMany
    {
        return $this->hasMany(Customer::class, 'family_head_id');
    }

    public function spectaclePrescriptions(): HasMany
    {
        return $this->hasMany(SpectaclePrescription::class);
    }

    public function contactLensPrescriptions(): HasMany
    {
        return $this->hasMany(ContactLensPrescription::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    // Scopes
    public function scopeSearch($query, string $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('phone', 'like', "%{$term}%")
              ->orWhere('first_name', 'like', "%{$term}%")
              ->orWhere('last_name', 'like', "%{$term}%");
        });
    }
}
