<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Illuminate\Support\Facades\Cache;

class Business extends Model
{
    protected $fillable = [
        'name', 'owner_id', 'logo_url', 'favicon_url', 'primary_color',
        'default_language', 'enabled_languages', 'currency_code',
        'tax_rate', 'settings', 'footer_text', 'is_active',
    ];

    protected $casts = [
        'enabled_languages' => 'array',
        'settings' => 'array',
        'tax_rate' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    protected static function booted()
    {
        static::updated(function ($business) {
            Cache::forget("business_{$business->id}_branding");
        });
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function branches(): HasMany
    {
        return $this->hasMany(Branch::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
