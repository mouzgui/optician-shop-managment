<?php

namespace App\Models;

use App\Models\Traits\BelongsToBusiness;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SpectaclePrescription extends Model
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
        'od_prism',
        'os_sphere',
        'os_cylinder',
        'os_axis',
        'os_add',
        'os_prism',
        'pd_far',
        'pd_near',
        'pd_type',
        'notes',
        'expires_at',
    ];

    protected $casts = [
        'prescribed_at' => 'datetime',
        'expires_at' => 'datetime',
        'od_sphere' => 'decimal:2',
        'od_cylinder' => 'decimal:2',
        'od_add' => 'decimal:2',
        'os_sphere' => 'decimal:2',
        'os_cylinder' => 'decimal:2',
        'os_add' => 'decimal:2',
        'pd_far' => 'decimal:1',
        'pd_near' => 'decimal:1',
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
