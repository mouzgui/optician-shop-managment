<?php

namespace App\Models;

use App\Models\Traits\BelongsToBusiness;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactLensPrescription extends Model
{
    use BelongsToBusiness;

    protected $fillable = [
        'business_id',
        'customer_id',
        'prescribed_by',
        'prescribed_at',
        'od_sphere',
        'od_cylinder',
        'od_axis',
        'od_add',
        'od_base_curve',
        'od_diameter',
        'od_brand',
        'os_sphere',
        'os_cylinder',
        'os_axis',
        'os_add',
        'os_base_curve',
        'os_diameter',
        'os_brand',
        'replacement_schedule',
        'notes',
        'expires_at',
    ];

    protected $casts = [
        'prescribed_at' => 'datetime',
        'expires_at' => 'datetime',
        'od_sphere' => 'decimal:2',
        'od_cylinder' => 'decimal:2',
        'od_add' => 'decimal:2',
        'od_base_curve' => 'decimal:2',
        'od_diameter' => 'decimal:2',
        'os_sphere' => 'decimal:2',
        'os_cylinder' => 'decimal:2',
        'os_add' => 'decimal:2',
        'os_base_curve' => 'decimal:2',
        'os_diameter' => 'decimal:2',
    ];

    // Relationships
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function prescribedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'prescribed_by');
    }

    // Helpers
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function daysUntilExpiry(): int
    {
        return max(0, now()->diffInDays($this->expires_at, false));
    }

    public function isExpiringSoon(int $days = 30): bool
    {
        return $this->daysUntilExpiry() <= $days && !$this->isExpired();
    }
}
