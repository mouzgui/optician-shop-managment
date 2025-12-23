<?php

namespace App\Console\Commands;

use App\Models\Customer;
use Illuminate\Console\Command;

class FlagExpiredPrescriptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'prescriptions:flag-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Flag customers with expired or expiring prescriptions';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for expired/expiring prescriptions...');

        // Customers with spectacle prescriptions expiring within 30 days or already expired
        $flaggedCount = Customer::whereHas('spectaclePrescriptions', function ($q) {
            $q->where('expires_at', '<=', now()->addDays(30));
        })
        ->orWhereHas('contactLensPrescriptions', function ($q) {
            $q->where('expires_at', '<=', now()->addDays(30));
        })
        ->update(['rx_expiry_flagged' => true]);

        // Unflag customers who now have valid prescriptions
        $unflaggedCount = Customer::where('rx_expiry_flagged', true)
            ->whereDoesntHave('spectaclePrescriptions', function ($q) {
                $q->where('expires_at', '<=', now()->addDays(30));
            })
            ->whereDoesntHave('contactLensPrescriptions', function ($q) {
                $q->where('expires_at', '<=', now()->addDays(30));
            })
            ->update(['rx_expiry_flagged' => false]);

        $this->info("Task completed. Flagged: {$flaggedCount}, Unflagged: {$unflaggedCount}");
    }
}
