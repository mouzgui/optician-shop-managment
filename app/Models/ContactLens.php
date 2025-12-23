<?php

namespace App\Models;

use App\Models\Traits\BelongsToBusiness;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class ContactLens extends Model
{
    use BelongsToBusiness, SoftDeletes;

    protected $fillable = [
        'business_id',
        'brand',
        'product_line',
        'type',
        'replacement_schedule',
        'power',
        'cylinder',
        'axis',
        'add',
        'base_curve',
        'diameter',
        'box_quantity',
        'boxes_in_stock',
        'cost_price_per_box',
        'selling_price_per_box',
        'expiry_date',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'expiry_date' => 'date',
        'cost_price_per_box' => 'decimal:2',
        'selling_price_per_box' => 'decimal:2',
        'boxes_in_stock' => 'integer',
        'box_quantity' => 'integer',
        'power' => 'decimal:2',
        'cylinder' => 'decimal:2',
        'add' => 'decimal:2',
        'base_curve' => 'decimal:2',
        'diameter' => 'decimal:2',
        'axis' => 'integer',
    ];

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    // Helpers
    public function getFullNameAttribute(): string
    {
        return "{$this->brand} {$this->product_line}";
    }

    public function isExpired(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

    public function isExpiringSoon(int $days = 60): bool
    {
        return $this->expiry_date &&
               $this->expiry_date->diffInDays(now()) <= $days &&
               !$this->isExpired();
    }
}
