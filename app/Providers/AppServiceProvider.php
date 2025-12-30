<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use Illuminate\Support\Facades\Gate;
use App\Models\Business;
use App\Policies\BusinessPolicy;
use App\Models\Branch;
use App\Policies\BranchPolicy;
use App\Models\User;
use App\Policies\UserPolicy;
use App\Models\Invoice;
use App\Policies\InvoicePolicy;
use App\Models\JobCard;
use App\Policies\JobCardPolicy;
use App\Models\SpectaclePrescription;
use App\Policies\SpectaclePrescriptionPolicy;
use App\Models\ContactLensPrescription;
use App\Policies\ContactLensPrescriptionPolicy;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Business::class, BusinessPolicy::class);
        Gate::policy(Branch::class, BranchPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Invoice::class, InvoicePolicy::class);
        Gate::policy(JobCard::class, JobCardPolicy::class);
        Gate::policy(SpectaclePrescription::class, SpectaclePrescriptionPolicy::class);
        Gate::policy(ContactLensPrescription::class, ContactLensPrescriptionPolicy::class);
    }
}
