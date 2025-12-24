<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Business;
use App\Models\Branch;
use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Super Admin
        User::updateOrCreate(
            ['email' => 'admin@opticina.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'role' => UserRole::SUPER_ADMIN,
                'is_active' => true,
            ]
        );

        // 2. Create a Business
        $business = Business::updateOrCreate(
            ['name' => 'Test Optical Shop'],
            [
                'is_active' => true,
                'primary_color' => '#3b82f6',
                'default_language' => 'en',
                'currency_code' => 'USD',
            ]
        );

        // 3. Create a Branch
        $branch = Branch::updateOrCreate(
            ['name' => 'Main Branch', 'business_id' => $business->id],
            [
                'address' => '123 Main St',
                'phone' => '1234567890',
                'city' => 'New York',
                'is_active' => true,
            ]
        );

        // 4. Create Business Owner
        $owner = User::updateOrCreate(
            ['email' => 'owner@testshop.com'],
            [
                'name' => 'Business Owner',
                'password' => Hash::make('password'),
                'role' => UserRole::BUSINESS_OWNER,
                'business_id' => $business->id,
                'branch_id' => $branch->id,
                'is_active' => true,
            ]
        );

        // Link owner to business
        $business->update(['owner_id' => $owner->id]);

        // 5. Create Staff
        User::updateOrCreate(
            ['email' => 'staff@testshop.com'],
            [
                'name' => 'Sales Staff',
                'password' => Hash::make('password'),
                'role' => UserRole::SALES_STAFF,
                'business_id' => $business->id,
                'branch_id' => $branch->id,
                'is_active' => true,
            ]
        );
    }
}
