<?php

namespace App\Models;

use App\Models\Traits\BelongsToBusiness;
use App\Enums\InvoiceStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Invoice extends Model
{
    use BelongsToBusiness, SoftDeletes;

    protected $fillable = [
        'business_id',
        'branch_id',
        'customer_id',
        'invoice_number',
        'status',
        'subtotal',
        'discount_amount',
        'discount_type',
        'tax_amount',
        'total',
        'amount_paid',
        'balance_due',
        'prescription_id',
        'prescription_type',
        'notes',
        'warranty_info',
        'estimated_pickup',
        'actual_pickup',
        'created_by',
    ];

    protected $casts = [
        'status' => InvoiceStatus::class,
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'balance_due' => 'decimal:2',
        'estimated_pickup' => 'datetime',
        'actual_pickup' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($invoice) {
            if (empty($invoice->invoice_number)) {
                $invoice->invoice_number = static::generateInvoiceNumber($invoice->business_id);
            }
        });
    }

    public static function generateInvoiceNumber(int $businessId): string
    {
        $date = now()->format('Ymd');
        $count = static::where('business_id', $businessId)
            ->whereDate('created_at', today())
            ->count() + 1;
        
        return sprintf('INV-%s-%04d', $date, $count);
    }

    // Relationships
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function prescription(): MorphTo
    {
        return $this->morphTo();
    }

    // Helpers
    public function isPaid(): bool
    {
        return $this->balance_due <= 0;
    }

    public function updateBalances(): void
    {
        $this->amount_paid = $this->payments()->sum('amount');
        $this->balance_due = max(0, $this->total - $this->amount_paid);
        
        if ($this->isPaid() && $this->status === InvoiceStatus::DEPOSIT_PAID) {
            $this->status = InvoiceStatus::COMPLETED;
        }
        
        $this->save();
    }
}
