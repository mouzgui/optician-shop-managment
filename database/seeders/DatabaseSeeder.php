<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Business;
use App\Models\Branch;
use App\Models\Customer;
use App\Models\Frame;
use App\Models\Lens;
use App\Models\ContactLens;
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
            ['name' => 'VisionCare Optical Center'],
            [
                'is_active' => true,
                'primary_color' => '#4F46E5',
                'default_language' => 'en',
                'currency_code' => 'USD',
                'tax_rate' => 5.00,
            ]
        );

        // 3. Create Branches
        $mainBranch = Branch::updateOrCreate(
            ['name' => 'Downtown Main Store', 'business_id' => $business->id],
            [
                'address' => '456 Vision Boulevard, Suite 100',
                'phone' => '+1 (555) 123-4567',
                'city' => 'New York',
                'is_active' => true,
            ]
        );

        $mallBranch = Branch::updateOrCreate(
            ['name' => 'City Mall Branch', 'business_id' => $business->id],
            [
                'address' => 'City Mall, 2nd Floor, Unit 205',
                'phone' => '+1 (555) 987-6543',
                'city' => 'New York',
                'is_active' => true,
            ]
        );

        // 4. Create Business Owner
        $owner = User::updateOrCreate(
            ['email' => 'owner@testshop.com'],
            [
                'name' => 'Dr. Michael Thompson',
                'password' => Hash::make('password'),
                'role' => UserRole::BUSINESS_OWNER,
                'business_id' => $business->id,
                'branch_id' => $mainBranch->id,
                'is_active' => true,
            ]
        );

        // Link owner to business
        $business->update(['owner_id' => $owner->id]);

        // 5. Create Staff Members
        User::updateOrCreate(
            ['email' => 'sarah.optometrist@testshop.com'],
            [
                'name' => 'Dr. Sarah Williams',
                'password' => Hash::make('password'),
                'role' => UserRole::OPTOMETRIST,
                'business_id' => $business->id,
                'branch_id' => $mainBranch->id,
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'staff@testshop.com'],
            [
                'name' => 'Emily Chen',
                'password' => Hash::make('password'),
                'role' => UserRole::SALES_STAFF,
                'business_id' => $business->id,
                'branch_id' => $mainBranch->id,
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'lab@testshop.com'],
            [
                'name' => 'James Rodriguez',
                'password' => Hash::make('password'),
                'role' => UserRole::LAB_TECHNICIAN,
                'business_id' => $business->id,
                'branch_id' => $mainBranch->id,
                'is_active' => true,
            ]
        );

        // 6. Create Customers
        $this->seedCustomers($business->id, $mainBranch->id);

        // 7. Create Frames Inventory
        $this->seedFrames($business->id);

        // 8. Create Lenses Catalog
        $this->seedLenses($business->id);

        // 9. Create Contact Lenses Inventory
        $this->seedContactLenses($business->id);
    }

    /**
     * Seed realistic customers
     */
    private function seedCustomers(int $businessId, int $branchId): void
    {
        $customers = [
            ['first_name' => 'Sarah', 'last_name' => 'Johnson', 'phone' => '555-123-4567', 'email' => 'sarah.j@email.com', 'date_of_birth' => '1985-03-15'],
            ['first_name' => 'Michael', 'last_name' => 'Anderson', 'phone' => '555-234-5678', 'email' => 'mike.anderson@email.com', 'date_of_birth' => '1972-07-22'],
            ['first_name' => 'Emily', 'last_name' => 'Martinez', 'phone' => '555-345-6789', 'email' => 'emily.m@email.com', 'date_of_birth' => '1990-11-08'],
            ['first_name' => 'David', 'last_name' => 'Wilson', 'phone' => '555-456-7890', 'email' => 'david.w@email.com', 'date_of_birth' => '1968-02-28'],
            ['first_name' => 'Jennifer', 'last_name' => 'Brown', 'phone' => '555-567-8901', 'email' => 'jen.brown@email.com', 'date_of_birth' => '1995-06-12'],
            ['first_name' => 'Robert', 'last_name' => 'Taylor', 'phone' => '555-678-9012', 'email' => 'r.taylor@email.com', 'date_of_birth' => '1980-09-30'],
            ['first_name' => 'Amanda', 'last_name' => 'Garcia', 'phone' => '555-789-0123', 'email' => 'amanda.g@email.com', 'date_of_birth' => '1988-12-05'],
            ['first_name' => 'Christopher', 'last_name' => 'Lee', 'phone' => '555-890-1234', 'email' => 'chris.lee@email.com', 'date_of_birth' => '1975-04-18'],
        ];

        foreach ($customers as $customer) {
            Customer::updateOrCreate(
                ['phone' => $customer['phone'], 'business_id' => $businessId],
                array_merge($customer, [
                    'business_id' => $businessId,
                    'branch_id' => $branchId,
                ])
            );
        }
    }

    /**
     * Seed realistic eyeglass frames from popular brands
     */
    private function seedFrames(int $businessId): void
    {
        $frames = [
            // Ray-Ban Collection
            ['sku' => 'RB-5154-2000', 'brand' => 'Ray-Ban', 'model' => 'Clubmaster', 'color_code' => '2000', 'color_name' => 'Black/Gold', 'size_eye' => 51, 'size_bridge' => 21, 'size_temple' => 145, 'category' => 'optical', 'material' => 'acetate', 'gender' => 'unisex', 'cost_price' => 85.00, 'selling_price' => 189.00, 'quantity' => 8],
            ['sku' => 'RB-5228-2000', 'brand' => 'Ray-Ban', 'model' => 'Highstreet', 'color_code' => '2000', 'color_name' => 'Black', 'size_eye' => 53, 'size_bridge' => 17, 'size_temple' => 140, 'category' => 'optical', 'material' => 'acetate', 'gender' => 'unisex', 'cost_price' => 75.00, 'selling_price' => 169.00, 'quantity' => 12],
            ['sku' => 'RB-7047-2000', 'brand' => 'Ray-Ban', 'model' => 'Rectangle', 'color_code' => '2000', 'color_name' => 'Black', 'size_eye' => 54, 'size_bridge' => 17, 'size_temple' => 140, 'category' => 'optical', 'material' => 'plastic', 'gender' => 'male', 'cost_price' => 65.00, 'selling_price' => 149.00, 'quantity' => 6],
            ['sku' => 'RB-3447V-2500', 'brand' => 'Ray-Ban', 'model' => 'Round Metal', 'color_code' => '2500', 'color_name' => 'Gold', 'size_eye' => 50, 'size_bridge' => 21, 'size_temple' => 145, 'category' => 'optical', 'material' => 'metal', 'gender' => 'unisex', 'cost_price' => 90.00, 'selling_price' => 199.00, 'quantity' => 5],

            // Oakley Collection
            ['sku' => 'OX-8046-0155', 'brand' => 'Oakley', 'model' => 'Airdrop', 'color_code' => '01', 'color_name' => 'Satin Black', 'size_eye' => 55, 'size_bridge' => 18, 'size_temple' => 143, 'category' => 'optical', 'material' => 'plastic', 'gender' => 'male', 'cost_price' => 95.00, 'selling_price' => 199.00, 'quantity' => 7],
            ['sku' => 'OX-8156-0156', 'brand' => 'Oakley', 'model' => 'Holbrook RX', 'color_code' => '01', 'color_name' => 'Satin Black', 'size_eye' => 56, 'size_bridge' => 17, 'size_temple' => 137, 'category' => 'optical', 'material' => 'plastic', 'gender' => 'male', 'cost_price' => 100.00, 'selling_price' => 219.00, 'quantity' => 4],
            ['sku' => 'OX-3227-0355', 'brand' => 'Oakley', 'model' => 'Steel Plate', 'color_code' => '03', 'color_name' => 'Powder Coal', 'size_eye' => 55, 'size_bridge' => 18, 'size_temple' => 140, 'category' => 'optical', 'material' => 'titanium', 'gender' => 'male', 'cost_price' => 120.00, 'selling_price' => 269.00, 'quantity' => 3],

            // Gucci Collection
            ['sku' => 'GG-0025O-001', 'brand' => 'Gucci', 'model' => 'GG0025O', 'color_code' => '001', 'color_name' => 'Black/Gold', 'size_eye' => 56, 'size_bridge' => 14, 'size_temple' => 140, 'category' => 'optical', 'material' => 'acetate', 'gender' => 'female', 'cost_price' => 180.00, 'selling_price' => 395.00, 'quantity' => 4],
            ['sku' => 'GG-0121O-002', 'brand' => 'Gucci', 'model' => 'GG0121O', 'color_code' => '002', 'color_name' => 'Havana', 'size_eye' => 49, 'size_bridge' => 19, 'size_temple' => 140, 'category' => 'optical', 'material' => 'acetate', 'gender' => 'female', 'cost_price' => 165.00, 'selling_price' => 365.00, 'quantity' => 3],

            // Tom Ford Collection
            ['sku' => 'TF-5401-001', 'brand' => 'Tom Ford', 'model' => 'FT5401', 'color_code' => '001', 'color_name' => 'Shiny Black', 'size_eye' => 51, 'size_bridge' => 20, 'size_temple' => 145, 'category' => 'optical', 'material' => 'acetate', 'gender' => 'unisex', 'cost_price' => 175.00, 'selling_price' => 385.00, 'quantity' => 2],
            ['sku' => 'TF-5504-052', 'brand' => 'Tom Ford', 'model' => 'FT5504', 'color_code' => '052', 'color_name' => 'Dark Havana', 'size_eye' => 54, 'size_bridge' => 15, 'size_temple' => 145, 'category' => 'optical', 'material' => 'acetate', 'gender' => 'male', 'cost_price' => 185.00, 'selling_price' => 405.00, 'quantity' => 3],

            // Persol Collection
            ['sku' => 'PO-3007V-95', 'brand' => 'Persol', 'model' => 'PO3007V', 'color_code' => '95', 'color_name' => 'Black', 'size_eye' => 50, 'size_bridge' => 19, 'size_temple' => 145, 'category' => 'optical', 'material' => 'acetate', 'gender' => 'unisex', 'cost_price' => 130.00, 'selling_price' => 289.00, 'quantity' => 6],
            ['sku' => 'PO-3092V-9015', 'brand' => 'Persol', 'model' => 'PO3092V', 'color_code' => '9015', 'color_name' => 'Havana', 'size_eye' => 48, 'size_bridge' => 19, 'size_temple' => 140, 'category' => 'optical', 'material' => 'acetate', 'gender' => 'unisex', 'cost_price' => 125.00, 'selling_price' => 279.00, 'quantity' => 4],

            // Prada Collection
            ['sku' => 'PR-17TV-1AB', 'brand' => 'Prada', 'model' => 'VPR17T', 'color_code' => '1AB', 'color_name' => 'Black', 'size_eye' => 52, 'size_bridge' => 18, 'size_temple' => 140, 'category' => 'optical', 'material' => 'acetate', 'gender' => 'female', 'cost_price' => 155.00, 'selling_price' => 345.00, 'quantity' => 5],
            ['sku' => 'PR-08TV-2AU', 'brand' => 'Prada', 'model' => 'VPR08T', 'color_code' => '2AU', 'color_name' => 'Havana', 'size_eye' => 50, 'size_bridge' => 17, 'size_temple' => 140, 'category' => 'optical', 'material' => 'acetate', 'gender' => 'female', 'cost_price' => 145.00, 'selling_price' => 325.00, 'quantity' => 4],

            // Versace Collection
            ['sku' => 'VE-3186-GB1', 'brand' => 'Versace', 'model' => 'VE3186', 'color_code' => 'GB1', 'color_name' => 'Black', 'size_eye' => 54, 'size_bridge' => 16, 'size_temple' => 140, 'category' => 'optical', 'material' => 'acetate', 'gender' => 'female', 'cost_price' => 140.00, 'selling_price' => 315.00, 'quantity' => 3],

            // Kids Collection
            ['sku' => 'RJ-1549-3615', 'brand' => 'Ray-Ban Junior', 'model' => 'RY1549', 'color_code' => '3615', 'color_name' => 'Blue', 'size_eye' => 48, 'size_bridge' => 16, 'size_temple' => 130, 'category' => 'kids', 'material' => 'plastic', 'gender' => 'kids', 'cost_price' => 55.00, 'selling_price' => 119.00, 'quantity' => 10],
            ['sku' => 'RJ-1555-3667', 'brand' => 'Ray-Ban Junior', 'model' => 'RY1555', 'color_code' => '3667', 'color_name' => 'Pink', 'size_eye' => 46, 'size_bridge' => 16, 'size_temple' => 125, 'category' => 'kids', 'material' => 'plastic', 'gender' => 'kids', 'cost_price' => 55.00, 'selling_price' => 119.00, 'quantity' => 8],

            // Sunglasses
            ['sku' => 'RB-2140-901', 'brand' => 'Ray-Ban', 'model' => 'Original Wayfarer', 'color_code' => '901', 'color_name' => 'Black/Green G-15', 'size_eye' => 50, 'size_bridge' => 22, 'size_temple' => 150, 'category' => 'sunglasses', 'material' => 'acetate', 'gender' => 'unisex', 'cost_price' => 85.00, 'selling_price' => 185.00, 'quantity' => 15],
            ['sku' => 'RB-3025-L0205', 'brand' => 'Ray-Ban', 'model' => 'Aviator Classic', 'color_code' => 'L0205', 'color_name' => 'Gold/Green G-15', 'size_eye' => 58, 'size_bridge' => 14, 'size_temple' => 135, 'category' => 'sunglasses', 'material' => 'metal', 'gender' => 'unisex', 'cost_price' => 90.00, 'selling_price' => 195.00, 'quantity' => 12],
            ['sku' => 'OO-9102-01', 'brand' => 'Oakley', 'model' => 'Holbrook', 'color_code' => '01', 'color_name' => 'Matte Black/Warm Grey', 'size_eye' => 55, 'size_bridge' => 18, 'size_temple' => 137, 'category' => 'sunglasses', 'material' => 'plastic', 'gender' => 'unisex', 'cost_price' => 75.00, 'selling_price' => 165.00, 'quantity' => 10],

            // Sports Collection
            ['sku' => 'OO-9208-01', 'brand' => 'Oakley', 'model' => 'Radar EV Path', 'color_code' => '01', 'color_name' => 'Polished Black/Prizm Road', 'size_eye' => 38, 'size_bridge' => 0, 'size_temple' => 128, 'category' => 'sports', 'material' => 'plastic', 'gender' => 'unisex', 'cost_price' => 110.00, 'selling_price' => 235.00, 'quantity' => 6],
            ['sku' => 'OO-9290-01', 'brand' => 'Oakley', 'model' => 'Jawbreaker', 'color_code' => '01', 'color_name' => 'Polished Black/Prizm Road', 'size_eye' => 31, 'size_bridge' => 0, 'size_temple' => 121, 'category' => 'sports', 'material' => 'plastic', 'gender' => 'unisex', 'cost_price' => 120.00, 'selling_price' => 259.00, 'quantity' => 4],
        ];

        foreach ($frames as $frame) {
            Frame::updateOrCreate(
                ['sku' => $frame['sku'], 'business_id' => $businessId],
                array_merge($frame, [
                    'business_id' => $businessId,
                    'is_active' => true,
                    'low_stock_threshold' => 3,
                ])
            );
        }
    }

    /**
     * Seed realistic prescription lens catalog
     */
    private function seedLenses(int $businessId): void
    {
        $lenses = [
            // Single Vision Lenses
            ['name' => 'Single Vision CR-39 Standard', 'brand' => 'Generic', 'type' => 'single_vision', 'index' => '1.50', 'material' => 'CR-39', 'coatings' => ['hard_coat'], 'cost_price' => 15.00, 'selling_price' => 49.00, 'lab_supplier' => 'Local Lab', 'lead_time_days' => 2],
            ['name' => 'Single Vision 1.56 Mid-Index HMC', 'brand' => 'Essilor', 'type' => 'single_vision', 'index' => '1.56', 'material' => 'Plastic', 'coatings' => ['hard_coat', 'anti_reflective'], 'cost_price' => 25.00, 'selling_price' => 89.00, 'lab_supplier' => 'Essilor Lab', 'lead_time_days' => 3],
            ['name' => 'Single Vision 1.60 High-Index HMC', 'brand' => 'Essilor', 'type' => 'single_vision', 'index' => '1.60', 'material' => 'High-Index', 'coatings' => ['hard_coat', 'anti_reflective'], 'cost_price' => 45.00, 'selling_price' => 149.00, 'lab_supplier' => 'Essilor Lab', 'lead_time_days' => 3],
            ['name' => 'Single Vision 1.67 Ultra-Thin HMC', 'brand' => 'Essilor', 'type' => 'single_vision', 'index' => '1.67', 'material' => 'High-Index', 'coatings' => ['hard_coat', 'anti_reflective', 'blue_light'], 'cost_price' => 65.00, 'selling_price' => 199.00, 'lab_supplier' => 'Essilor Lab', 'lead_time_days' => 5],
            ['name' => 'Single Vision 1.74 Super-Thin', 'brand' => 'HOYA', 'type' => 'single_vision', 'index' => '1.74', 'material' => 'High-Index', 'coatings' => ['hard_coat', 'anti_reflective', 'hydrophobic'], 'cost_price' => 95.00, 'selling_price' => 299.00, 'lab_supplier' => 'HOYA Lab', 'lead_time_days' => 7],

            // Progressive Lenses
            ['name' => 'Progressive Standard 1.56', 'brand' => 'Generic', 'type' => 'progressive', 'index' => '1.56', 'material' => 'Plastic', 'coatings' => ['hard_coat', 'anti_reflective'], 'cost_price' => 55.00, 'selling_price' => 189.00, 'lab_supplier' => 'Local Lab', 'lead_time_days' => 5],
            ['name' => 'Varilux Comfort 1.60', 'brand' => 'Essilor', 'type' => 'progressive', 'index' => '1.60', 'material' => 'High-Index', 'coatings' => ['hard_coat', 'anti_reflective', 'blue_light'], 'cost_price' => 120.00, 'selling_price' => 389.00, 'lab_supplier' => 'Essilor Lab', 'lead_time_days' => 7],
            ['name' => 'Varilux Physio 1.67', 'brand' => 'Essilor', 'type' => 'progressive', 'index' => '1.67', 'material' => 'High-Index', 'coatings' => ['hard_coat', 'anti_reflective', 'blue_light', 'hydrophobic'], 'cost_price' => 180.00, 'selling_price' => 549.00, 'lab_supplier' => 'Essilor Lab', 'lead_time_days' => 7],
            ['name' => 'Varilux X Series 1.67', 'brand' => 'Essilor', 'type' => 'progressive', 'index' => '1.67', 'material' => 'High-Index', 'coatings' => ['crizal_sapphire', 'blue_light'], 'cost_price' => 220.00, 'selling_price' => 699.00, 'lab_supplier' => 'Essilor Lab', 'lead_time_days' => 10],
            ['name' => 'HOYA iD MyStyle 1.67', 'brand' => 'HOYA', 'type' => 'progressive', 'index' => '1.67', 'material' => 'High-Index', 'coatings' => ['hi_vision_longlife', 'blue_control'], 'cost_price' => 200.00, 'selling_price' => 649.00, 'lab_supplier' => 'HOYA Lab', 'lead_time_days' => 10],

            // Bifocal Lenses
            ['name' => 'Flat Top 28 Bifocal 1.50', 'brand' => 'Generic', 'type' => 'bifocal', 'index' => '1.50', 'material' => 'CR-39', 'coatings' => ['hard_coat'], 'cost_price' => 25.00, 'selling_price' => 89.00, 'lab_supplier' => 'Local Lab', 'lead_time_days' => 3],
            ['name' => 'Flat Top 28 Bifocal 1.56 HMC', 'brand' => 'Essilor', 'type' => 'bifocal', 'index' => '1.56', 'material' => 'Plastic', 'coatings' => ['hard_coat', 'anti_reflective'], 'cost_price' => 40.00, 'selling_price' => 139.00, 'lab_supplier' => 'Essilor Lab', 'lead_time_days' => 5],

            // Office/Computer Lenses
            ['name' => 'Office Lens 1.56 HMC', 'brand' => 'Essilor', 'type' => 'office', 'index' => '1.56', 'material' => 'Plastic', 'coatings' => ['hard_coat', 'anti_reflective', 'blue_light'], 'cost_price' => 70.00, 'selling_price' => 229.00, 'lab_supplier' => 'Essilor Lab', 'lead_time_days' => 5],
            ['name' => 'Eyezen Start 1.60', 'brand' => 'Essilor', 'type' => 'office', 'index' => '1.60', 'material' => 'High-Index', 'coatings' => ['crizal_prevencia'], 'cost_price' => 95.00, 'selling_price' => 299.00, 'lab_supplier' => 'Essilor Lab', 'lead_time_days' => 5],
            ['name' => 'HOYA Sync III 1.60', 'brand' => 'HOYA', 'type' => 'office', 'index' => '1.60', 'material' => 'High-Index', 'coatings' => ['blue_control', 'hi_vision_longlife'], 'cost_price' => 90.00, 'selling_price' => 289.00, 'lab_supplier' => 'HOYA Lab', 'lead_time_days' => 7],

            // Photochromic Lenses
            ['name' => 'Transitions Signature GEN 8 1.56', 'brand' => 'Essilor', 'type' => 'single_vision', 'index' => '1.56', 'material' => 'Plastic', 'coatings' => ['transitions', 'hard_coat', 'anti_reflective'], 'cost_price' => 85.00, 'selling_price' => 269.00, 'lab_supplier' => 'Essilor Lab', 'lead_time_days' => 5],
            ['name' => 'Transitions XTRActive 1.60', 'brand' => 'Essilor', 'type' => 'single_vision', 'index' => '1.60', 'material' => 'High-Index', 'coatings' => ['transitions_xtractive', 'crizal_sapphire'], 'cost_price' => 120.00, 'selling_price' => 369.00, 'lab_supplier' => 'Essilor Lab', 'lead_time_days' => 7],
            ['name' => 'Varilux Physio Transitions 1.67', 'brand' => 'Essilor', 'type' => 'progressive', 'index' => '1.67', 'material' => 'High-Index', 'coatings' => ['transitions', 'crizal_sapphire'], 'cost_price' => 250.00, 'selling_price' => 799.00, 'lab_supplier' => 'Essilor Lab', 'lead_time_days' => 10],
        ];

        foreach ($lenses as $lens) {
            Lens::updateOrCreate(
                ['name' => $lens['name'], 'business_id' => $businessId],
                array_merge($lens, [
                    'business_id' => $businessId,
                    'coatings' => json_encode($lens['coatings']),
                    'is_active' => true,
                ])
            );
        }
    }

    /**
     * Seed realistic contact lens inventory
     */
    private function seedContactLenses(int $businessId): void
    {
        $contactLenses = [
            // Acuvue Daily
            ['brand' => 'Acuvue', 'product_line' => '1-Day Acuvue Moist', 'type' => 'spherical', 'replacement_schedule' => 'daily', 'power' => -2.00, 'base_curve' => 8.5, 'diameter' => 14.2, 'box_quantity' => 30, 'boxes_in_stock' => 25, 'cost_price_per_box' => 22.00, 'selling_price_per_box' => 45.00],
            ['brand' => 'Acuvue', 'product_line' => '1-Day Acuvue Moist', 'type' => 'spherical', 'replacement_schedule' => 'daily', 'power' => -3.00, 'base_curve' => 8.5, 'diameter' => 14.2, 'box_quantity' => 30, 'boxes_in_stock' => 20, 'cost_price_per_box' => 22.00, 'selling_price_per_box' => 45.00],
            ['brand' => 'Acuvue', 'product_line' => '1-Day Acuvue Moist', 'type' => 'spherical', 'replacement_schedule' => 'daily', 'power' => -4.50, 'base_curve' => 8.5, 'diameter' => 14.2, 'box_quantity' => 30, 'boxes_in_stock' => 15, 'cost_price_per_box' => 22.00, 'selling_price_per_box' => 45.00],

            // Acuvue Oasys (Monthly)
            ['brand' => 'Acuvue', 'product_line' => 'Acuvue Oasys', 'type' => 'spherical', 'replacement_schedule' => 'biweekly', 'power' => -2.50, 'base_curve' => 8.4, 'diameter' => 14.0, 'box_quantity' => 6, 'boxes_in_stock' => 30, 'cost_price_per_box' => 28.00, 'selling_price_per_box' => 55.00],
            ['brand' => 'Acuvue', 'product_line' => 'Acuvue Oasys', 'type' => 'spherical', 'replacement_schedule' => 'biweekly', 'power' => -3.50, 'base_curve' => 8.4, 'diameter' => 14.0, 'box_quantity' => 6, 'boxes_in_stock' => 25, 'cost_price_per_box' => 28.00, 'selling_price_per_box' => 55.00],

            // Acuvue Oasys for Astigmatism (Toric)
            ['brand' => 'Acuvue', 'product_line' => 'Acuvue Oasys for Astigmatism', 'type' => 'toric', 'replacement_schedule' => 'biweekly', 'power' => -2.00, 'cylinder' => -0.75, 'axis' => 180, 'base_curve' => 8.6, 'diameter' => 14.5, 'box_quantity' => 6, 'boxes_in_stock' => 12, 'cost_price_per_box' => 38.00, 'selling_price_per_box' => 75.00],
            ['brand' => 'Acuvue', 'product_line' => 'Acuvue Oasys for Astigmatism', 'type' => 'toric', 'replacement_schedule' => 'biweekly', 'power' => -3.00, 'cylinder' => -1.25, 'axis' => 90, 'base_curve' => 8.6, 'diameter' => 14.5, 'box_quantity' => 6, 'boxes_in_stock' => 10, 'cost_price_per_box' => 38.00, 'selling_price_per_box' => 75.00],

            // Dailies AquaComfort Plus
            ['brand' => 'Alcon', 'product_line' => 'Dailies AquaComfort Plus', 'type' => 'spherical', 'replacement_schedule' => 'daily', 'power' => -1.50, 'base_curve' => 8.7, 'diameter' => 14.0, 'box_quantity' => 30, 'boxes_in_stock' => 35, 'cost_price_per_box' => 20.00, 'selling_price_per_box' => 42.00],
            ['brand' => 'Alcon', 'product_line' => 'Dailies AquaComfort Plus', 'type' => 'spherical', 'replacement_schedule' => 'daily', 'power' => -2.75, 'base_curve' => 8.7, 'diameter' => 14.0, 'box_quantity' => 30, 'boxes_in_stock' => 28, 'cost_price_per_box' => 20.00, 'selling_price_per_box' => 42.00],
            ['brand' => 'Alcon', 'product_line' => 'Dailies AquaComfort Plus', 'type' => 'spherical', 'replacement_schedule' => 'daily', 'power' => -5.00, 'base_curve' => 8.7, 'diameter' => 14.0, 'box_quantity' => 30, 'boxes_in_stock' => 18, 'cost_price_per_box' => 20.00, 'selling_price_per_box' => 42.00],

            // Air Optix Monthly
            ['brand' => 'Alcon', 'product_line' => 'Air Optix Aqua', 'type' => 'spherical', 'replacement_schedule' => 'monthly', 'power' => -2.00, 'base_curve' => 8.6, 'diameter' => 14.2, 'box_quantity' => 6, 'boxes_in_stock' => 20, 'cost_price_per_box' => 32.00, 'selling_price_per_box' => 65.00],
            ['brand' => 'Alcon', 'product_line' => 'Air Optix Aqua', 'type' => 'spherical', 'replacement_schedule' => 'monthly', 'power' => -4.00, 'base_curve' => 8.6, 'diameter' => 14.2, 'box_quantity' => 6, 'boxes_in_stock' => 15, 'cost_price_per_box' => 32.00, 'selling_price_per_box' => 65.00],

            // Biofinity Monthly
            ['brand' => 'CooperVision', 'product_line' => 'Biofinity', 'type' => 'spherical', 'replacement_schedule' => 'monthly', 'power' => -1.75, 'base_curve' => 8.6, 'diameter' => 14.0, 'box_quantity' => 6, 'boxes_in_stock' => 22, 'cost_price_per_box' => 35.00, 'selling_price_per_box' => 69.00],
            ['brand' => 'CooperVision', 'product_line' => 'Biofinity', 'type' => 'spherical', 'replacement_schedule' => 'monthly', 'power' => -3.25, 'base_curve' => 8.6, 'diameter' => 14.0, 'box_quantity' => 6, 'boxes_in_stock' => 18, 'cost_price_per_box' => 35.00, 'selling_price_per_box' => 69.00],

            // Biofinity Toric
            ['brand' => 'CooperVision', 'product_line' => 'Biofinity Toric', 'type' => 'toric', 'replacement_schedule' => 'monthly', 'power' => -2.25, 'cylinder' => -1.25, 'axis' => 170, 'base_curve' => 8.7, 'diameter' => 14.5, 'box_quantity' => 6, 'boxes_in_stock' => 8, 'cost_price_per_box' => 45.00, 'selling_price_per_box' => 89.00],

            // Multifocal
            ['brand' => 'Alcon', 'product_line' => 'Dailies Total1 Multifocal', 'type' => 'multifocal', 'replacement_schedule' => 'daily', 'power' => -1.50, 'add' => 1.25, 'base_curve' => 8.5, 'diameter' => 14.1, 'box_quantity' => 30, 'boxes_in_stock' => 10, 'cost_price_per_box' => 45.00, 'selling_price_per_box' => 95.00],
            ['brand' => 'CooperVision', 'product_line' => 'Biofinity Multifocal', 'type' => 'multifocal', 'replacement_schedule' => 'monthly', 'power' => -2.00, 'add' => 2.00, 'base_curve' => 8.6, 'diameter' => 14.0, 'box_quantity' => 6, 'boxes_in_stock' => 6, 'cost_price_per_box' => 55.00, 'selling_price_per_box' => 109.00],

            // Color Lenses
            ['brand' => 'Alcon', 'product_line' => 'Freshlook Colorblends', 'type' => 'color', 'replacement_schedule' => 'monthly', 'power' => -2.00, 'base_curve' => 8.6, 'diameter' => 14.5, 'box_quantity' => 2, 'boxes_in_stock' => 15, 'cost_price_per_box' => 18.00, 'selling_price_per_box' => 38.00],
            ['brand' => 'Alcon', 'product_line' => 'Freshlook Colorblends', 'type' => 'color', 'replacement_schedule' => 'monthly', 'power' => 0.00, 'base_curve' => 8.6, 'diameter' => 14.5, 'box_quantity' => 2, 'boxes_in_stock' => 20, 'cost_price_per_box' => 18.00, 'selling_price_per_box' => 38.00],
        ];

        foreach ($contactLenses as $cl) {
            ContactLens::updateOrCreate(
                [
                    'brand' => $cl['brand'],
                    'product_line' => $cl['product_line'],
                    'power' => $cl['power'],
                    'business_id' => $businessId,
                ],
                array_merge($cl, [
                    'business_id' => $businessId,
                    'is_active' => true,
                    'expiry_date' => now()->addYears(2),
                ])
            );
        }
    }
}
