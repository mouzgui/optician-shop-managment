<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Business extends Model
{
    protected $fillable = [
        'name', 'owner_id', 'logo_url', 'primary_color',
        'default_language', 'enabled_languages', 'currency_code',
        'tax_rate', 'settings', 'is_active',
    ];

    protected $casts = [
        'enabled_languages' => 'array',
        'settings' => 'array',
        'tax_rate' => 'decimal:2',
        'is_active' => 'boolean',
    ];

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
