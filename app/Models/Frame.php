<?php

namespace App\Models;

use App\Models\Traits\BelongsToBusiness;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Frame extends Model
{
    use BelongsToBusiness, SoftDeletes;

    protected $fillable = [
        'business_id',
        'sku',
        'barcode',
        'brand',
        'model',
        'color_code',
        'color_name',
        'size_eye',
        'size_bridge',
        'size_temple',
        'category',
        'material',
        'gender',
        'cost_price',
        'selling_price',
        'quantity',
        'low_stock_threshold',
        'image_url',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'cost_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'quantity' => 'integer',
        'low_stock_threshold' => 'integer',
        'size_eye' => 'integer',
        'size_bridge' => 'integer',
        'size_temple' => 'integer',
    ];

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeLowStock(Builder $query): Builder
    {
        return $query->whereColumn('quantity', '<=', 'low_stock_threshold');
    }

    // Helpers
    public function isLowStock(): bool
    {
        return $this->quantity <= $this->low_stock_threshold;
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->brand} {$this->model} {$this->color_name}";
    }

    public function getSizeAttribute(): string
    {
        if (!$this->size_eye) return '-';
        return "{$this->size_eye} □ {$this->size_bridge} - {$this->size_temple}";
    }
}
