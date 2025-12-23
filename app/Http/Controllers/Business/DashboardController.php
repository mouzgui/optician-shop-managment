<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Note: Customer and Invoice models are not yet created in migrations, 
        // but they will be in later phases. For now, we return empty stats or basic ones.
        return Inertia::render('Business/Dashboard', [
            'stats' => [
                'todaySales' => 0, // Placeholder
                'pendingPickups' => 0, // Placeholder
                'customersCount' => 0, // Placeholder
            ],
            'recentInvoices' => [], // Placeholder
        ]);
    }
}
