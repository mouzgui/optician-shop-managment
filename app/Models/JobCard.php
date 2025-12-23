<?php

namespace App\Models;

use App\Models\Traits\BelongsToBusiness;
use App\Enums\JobCardStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobCard extends Model
{
    use BelongsToBusiness, SoftDeletes;

    protected $fillable = [
        'business_id',
        'invoice_id',
        'job_number',
        'status',
        'prescription_details',
        'frame_details',
        'lens_details',
        'special_instructions',
        'started_at',
        'completed_at',
        'completed_by',
    ];

    protected $casts = [
        'status' => JobCardStatus::class,
        'prescription_details' => 'array',
        'frame_details' => 'array',
        'lens_details' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($jobCard) {
            if (empty($jobCard->job_number)) {
                $jobCard->job_number = static::generateJobNumber($jobCard->business_id);
            }
        });
    }

    public static function generateJobNumber(int $businessId): string
    {
        $date = now()->format('Ymd');
        $count = static::where('business_id', $businessId)
            ->whereDate('created_at', today())
            ->count() + 1;
        
        return sprintf('JOB-%s-%04d', $date, $count);
    }

    public static function createFromInvoice(Invoice $invoice): ?self
    {
        // Check if invoice has any lab-related items (frames or lenses)
        $hasLabItems = $invoice->items->whereIn('item_type', ['frame', 'lens'])->isNotEmpty();
        
        if (!$hasLabItems) {
            return null;
        }

        // Check if job card already exists
        if (static::where('invoice_id', $invoice->id)->exists()) {
            return null;
        }

        return static::create([
            'business_id' => $invoice->business_id,
            'invoice_id' => $invoice->id,
            'prescription_details' => $invoice->prescription?->toArray(),
            'frame_details' => $invoice->items->where('item_type', 'frame')->first()?->toArray(),
            'lens_details' => $invoice->items->where('item_type', 'lens')->first()?->toArray(),
            'status' => JobCardStatus::PENDING,
        ]);
    }

    // Relationships
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function completedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'completed_by');
    }
}
