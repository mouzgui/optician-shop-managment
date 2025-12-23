<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalBusinesses' => Business::count(),
                'activeBusinesses' => Business::where('is_active', true)->count(),
                'totalUsers' => User::count(),
            ],
        ]);
    }
}
