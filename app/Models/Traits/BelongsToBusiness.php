<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;

trait BelongsToBusiness
{
    protected static function bootBelongsToBusiness(): void
    {
        // Auto-scope queries to current business
        static::addGlobalScope('business', function (Builder $builder) {
            if (auth()->check() && auth()->user()->business_id) {
                $builder->where('business_id', auth()->user()->business_id);
            }
        });

        // Auto-fill business_id on create
        static::creating(function ($model) {
            if (auth()->check() && auth()->user()->business_id && !$model->business_id) {
                $model->business_id = auth()->user()->business_id;
            }
        });
    }

    public function business()
    {
        return $this->belongsTo(\App\Models\Business::class);
    }
}
