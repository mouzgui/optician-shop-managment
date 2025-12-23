<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin;
use App\Http\Controllers\Business;
use App\Http\Controllers\Sales;
use App\Http\Controllers\Clinical;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

// Super Admin Routes
Route::middleware(['auth', 'role:super_admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [Admin\DashboardController::class, 'index'])
            ->name('dashboard');

        Route::resource('businesses', Admin\BusinessController::class)
            ->except(['show', 'destroy']);

        Route::post('/businesses/{business}/toggle-status',
            [Admin\BusinessController::class, 'toggleStatus'])
            ->name('businesses.toggle-status');
    });

// Business Management Routes
Route::middleware(['auth', 'business'])
    ->prefix('business')
    ->name('business.')
    ->group(function () {
        Route::get('/dashboard', [Business\DashboardController::class, 'index'])
            ->name('dashboard');

        // Branch Management (Owner only)
        Route::middleware(['role:business_owner'])->group(function () {
            Route::resource('branches', Business\BranchController::class);
            Route::post('/branches/{branch}/toggle-status', [Business\BranchController::class, 'toggleStatus'])
                ->name('branches.toggle-status');

            Route::resource('staff', Business\StaffController::class);
            Route::post('/staff/{staff}/toggle-status', [Business\StaffController::class, 'toggleStatus'])
                ->name('staff.toggle-status');

            Route::get('/settings', [Business\SettingsController::class, 'index'])->name('settings.index');
            Route::patch('/settings', [Business\SettingsController::class, 'update'])->name('settings.update');
        });

        // Sales & Clinical (Staff, Optometrist, Owner)
        Route::middleware(['role:business_owner,branch_manager,staff,optometrist'])->group(function () {
            // Customer Management
            Route::get('customers/search', [Sales\CustomerController::class, 'search'])
                ->name('customers.search');
            Route::resource('customers', Sales\CustomerController::class);

            // Clinical - Spectacle Prescriptions
            Route::resource('spectacle-rx', Clinical\SpectacleRxController::class)
                ->except(['index', 'edit']);

            // Clinical - Contact Lens Prescriptions
            Route::resource('contact-lens-rx', Clinical\ContactLensRxController::class)
                ->except(['index', 'edit']);

            // Inventory - Frames
            Route::prefix('inventory')->name('inventory.')->group(function () {
                Route::get('frames/barcode/{barcode}', [Sales\FrameController::class, 'lookupBarcode'])
                    ->name('frames.barcode-lookup');
                Route::resource('frames', Sales\FrameController::class);
                Route::resource('lenses', Sales\LensController::class);
                Route::resource('contact-lenses', Sales\ContactLensController::class);
            });
        });
    });
