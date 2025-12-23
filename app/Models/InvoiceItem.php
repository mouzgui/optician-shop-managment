<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceItem extends Model
{
    protected $fillable = [
        'invoice_id',
        'item_type',
        'item_id',
        'description',
        'quantity',
        'unit_price',
        'discount',
        'total',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'quantity' => 'integer',
    ];

    // Relationships
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    /**
     * Get the associated item model instance if it exists.
     */
    public function getItemAttribute()
    {
        if (!$this->item_id) return null;

        return match($this->item_type) {
            'frame' => Frame::find($this->item_id),
            'lens' => Lens::find($this->item_id),
            'contact_lens' => ContactLens::find($this->item_id),
            default => null,
        };
    }
}
