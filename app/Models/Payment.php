<?php

namespace App\Models;

use App\Models\Traits\BelongsToBusiness;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use BelongsToBusiness, SoftDeletes;

    protected $fillable = [
        'business_id',
        'invoice_id',
        'amount',
        'payment_method',
        'reference',
        'insurance_claim_id',
        'received_by',
        'received_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'received_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::saved(function ($payment) {
            if ($payment->invoice) {
                $payment->invoice->updateBalances();
            }
        });

        static::deleted(function ($payment) {
            if ($payment->invoice) {
                $payment->invoice->updateBalances();
            }
        });
    }

    // Relationships
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function receivedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'received_by');
    }
}
