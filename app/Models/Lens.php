<?php

namespace App\Models;

use App\Models\Traits\BelongsToBusiness;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Lens extends Model
{
    use BelongsToBusiness, SoftDeletes;

    protected $fillable = [
        'business_id',
        'name',
        'brand',
        'type',
        'index',
        'coatings',
        'material',
        'cost_price',
        'selling_price',
        'lab_supplier',
        'lead_time_days',
        'is_active',
    ];

    protected $casts = [
        'coatings' => 'array',
        'is_active' => 'boolean',
        'cost_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'lead_time_days' => 'integer',
    ];

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    // Helpers
    public function getFullNameAttribute(): string
    {
        return $this->name;
    }
}
