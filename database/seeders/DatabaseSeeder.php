<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Business;
use App\Models\Branch;
use App\Models\Customer;
use App\Models\Frame;
use App\Models\Lens;
use App\Models\ContactLens;
use App\Models\SpectaclePrescription;
use App\Models\ContactLensPrescription;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\JobCard;
use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

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
        $optometrist = User::updateOrCreate(
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

        $salesStaff = User::updateOrCreate(
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
        $customers = $this->seedCustomers($business->id, $mainBranch->id);

        // 7. Create Frames Inventory
        $this->seedFrames($business->id);

        // 8. Create Lenses Catalog
        $this->seedLenses($business->id);

        // 9. Create Contact Lenses Inventory
        $this->seedContactLenses($business->id);

        // 10. Create Prescriptions for Customers
        $this->seedPrescriptions($business->id, $optometrist->id, $customers);

        // 11. Create Sample Invoices
        $this->seedInvoices($business->id, $mainBranch->id, $salesStaff->id, $customers);

        // 12. Create Payments for Reports
        $this->seedPayments($business->id, $salesStaff->id, $optometrist->id);

        // 13. Create Job Cards for Lab
        $this->seedJobCards($business->id);
    }

    /**
     * Seed realistic customers
     */
    private function seedCustomers(int $businessId, int $branchId): array
    {
        $customerData = [
            ['first_name' => 'Sarah', 'last_name' => 'Johnson', 'phone' => '555-123-4567', 'email' => 'sarah.j@email.com', 'date_of_birth' => '1985-03-15', 'address' => '123 Oak Street, Apt 4B, New York, NY 10001'],
            ['first_name' => 'Michael', 'last_name' => 'Anderson', 'phone' => '555-234-5678', 'email' => 'mike.anderson@email.com', 'date_of_birth' => '1972-07-22', 'address' => '456 Maple Avenue, Brooklyn, NY 11201'],
            ['first_name' => 'Emily', 'last_name' => 'Martinez', 'phone' => '555-345-6789', 'email' => 'emily.m@email.com', 'date_of_birth' => '1990-11-08', 'address' => '789 Pine Road, Queens, NY 11375'],
            ['first_name' => 'David', 'last_name' => 'Wilson', 'phone' => '555-456-7890', 'email' => 'david.w@email.com', 'date_of_birth' => '1968-02-28', 'address' => '321 Elm Street, Manhattan, NY 10016'],
            ['first_name' => 'Jennifer', 'last_name' => 'Brown', 'phone' => '555-567-8901', 'email' => 'jen.brown@email.com', 'date_of_birth' => '1995-06-12', 'address' => '654 Cedar Lane, Bronx, NY 10453'],
            ['first_name' => 'Robert', 'last_name' => 'Taylor', 'phone' => '555-678-9012', 'email' => 'r.taylor@email.com', 'date_of_birth' => '1980-09-30', 'address' => '987 Birch Boulevard, Staten Island, NY 10301'],
            ['first_name' => 'Amanda', 'last_name' => 'Garcia', 'phone' => '555-789-0123', 'email' => 'amanda.g@email.com', 'date_of_birth' => '1988-12-05', 'address' => '147 Walnut Way, Manhattan, NY 10022'],
            ['first_name' => 'Christopher', 'last_name' => 'Lee', 'phone' => '555-890-1234', 'email' => 'chris.lee@email.com', 'date_of_birth' => '1975-04-18', 'address' => '258 Spruce Street, Brooklyn, NY 11215'],
        ];

        $customers = [];
        foreach ($customerData as $data) {
            $customers[] = Customer::updateOrCreate(
                ['phone' => $data['phone'], 'business_id' => $businessId],
                array_merge($data, [
                    'business_id' => $businessId,
                    'branch_id' => $branchId,
                ])
            );
        }

        return $customers;
    }

    /**
     * Seed prescriptions for customers
     */
    private function seedPrescriptions(int $businessId, int $prescribedBy, array $customers): void
    {
        // Spectacle Prescriptions - realistic values
        $spectacleRxData = [
            // Sarah Johnson - mild myopia with astigmatism
            [
                'customer_index' => 0,
                'prescribed_at' => Carbon::now()->subMonths(3),
                'expires_at' => Carbon::now()->addMonths(21),
                'od_sphere' => -2.25,
                'od_cylinder' => -0.75,
                'od_axis' => 180,
                'od_add' => null,
                'os_sphere' => -2.00,
                'os_cylinder' => -0.50,
                'os_axis' => 175,
                'os_add' => null,
                'pd_far' => 63,
                'pd_near' => 60,
                'pd_type' => 'single',
                'notes' => 'Patient prefers lightweight frames. Recommend anti-reflective coating.',
            ],
            // Michael Anderson - presbyopia (progressive lenses needed)
            [
                'customer_index' => 1,
                'prescribed_at' => Carbon::now()->subMonths(6),
                'expires_at' => Carbon::now()->addMonths(18),
                'od_sphere' => +0.75,
                'od_cylinder' => -0.25,
                'od_axis' => 90,
                'od_add' => 2.00,
                'os_sphere' => +1.00,
                'os_cylinder' => -0.50,
                'os_axis' => 85,
                'os_add' => 2.00,
                'pd_far' => 66,
                'pd_near' => 63,
                'pd_type' => 'dual',
                'notes' => 'Progressive lenses recommended. Computer work 6+ hours daily.',
            ],
            // Emily Martinez - young adult, mild myopia
            [
                'customer_index' => 2,
                'prescribed_at' => Carbon::now()->subMonths(1),
                'expires_at' => Carbon::now()->addMonths(23),
                'od_sphere' => -1.50,
                'od_cylinder' => null,
                'od_axis' => null,
                'od_add' => null,
                'os_sphere' => -1.75,
                'os_cylinder' => -0.25,
                'os_axis' => 170,
                'os_add' => null,
                'pd_far' => 60,
                'pd_near' => 57,
                'pd_type' => 'single',
                'notes' => 'Blue light coating requested for digital device use.',
            ],
            // David Wilson - high myopia with significant astigmatism
            [
                'customer_index' => 3,
                'prescribed_at' => Carbon::now()->subMonths(8),
                'expires_at' => Carbon::now()->addMonths(16),
                'od_sphere' => -5.50,
                'od_cylinder' => -1.75,
                'od_axis' => 15,
                'od_add' => 1.50,
                'os_sphere' => -6.00,
                'os_cylinder' => -2.00,
                'os_axis' => 165,
                'os_add' => 1.50,
                'pd_far' => 68,
                'pd_near' => 65,
                'pd_type' => 'dual',
                'notes' => 'High-index lenses (1.67 or 1.74) strongly recommended. Edge polish required.',
            ],
            // Robert Taylor - moderate hyperopia
            [
                'customer_index' => 5,
                'prescribed_at' => Carbon::now()->subMonths(2),
                'expires_at' => Carbon::now()->addMonths(22),
                'od_sphere' => +2.75,
                'od_cylinder' => -0.50,
                'od_axis' => 100,
                'od_add' => null,
                'os_sphere' => +2.50,
                'os_cylinder' => -0.75,
                'os_axis' => 80,
                'os_add' => null,
                'pd_far' => 65,
                'pd_near' => 62,
                'pd_type' => 'single',
                'notes' => 'Patient experiences eye strain. Anti-fatigue lenses discussed.',
            ],
        ];

        foreach ($spectacleRxData as $rxData) {
            $customer = $customers[$rxData['customer_index']];
            unset($rxData['customer_index']);

            SpectaclePrescription::updateOrCreate(
                [
                    'business_id' => $businessId,
                    'customer_id' => $customer->id,
                    'prescribed_at' => $rxData['prescribed_at'],
                ],
                array_merge($rxData, [
                    'business_id' => $businessId,
                    'customer_id' => $customer->id,
                    'prescribed_by' => $prescribedBy,
                ])
            );
        }

        // Contact Lens Prescriptions
        $clRxData = [
            // Sarah Johnson - daily disposables
            [
                'customer_index' => 0,
                'prescribed_at' => Carbon::now()->subMonths(2),
                'expires_at' => Carbon::now()->addMonths(10),
                'od_sphere' => -2.25,
                'od_cylinder' => -0.75,
                'od_axis' => 180,
                'od_base_curve' => 8.5,
                'od_diameter' => 14.2,
                'os_sphere' => -2.00,
                'os_cylinder' => -0.50,
                'os_axis' => 175,
                'os_base_curve' => 8.5,
                'os_diameter' => 14.2,
                'replacement_schedule' => 'daily',
                'notes' => 'Acuvue 1-Day Moist for Astigmatism recommended. Trial lenses provided.',
            ],
            // Emily Martinez - monthly lenses
            [
                'customer_index' => 2,
                'prescribed_at' => Carbon::now()->subMonths(1),
                'expires_at' => Carbon::now()->addMonths(11),
                'od_sphere' => -1.50,
                'od_cylinder' => null,
                'od_axis' => null,
                'od_base_curve' => 8.6,
                'od_diameter' => 14.0,
                'os_sphere' => -1.75,
                'os_cylinder' => null,
                'os_axis' => null,
                'os_base_curve' => 8.6,
                'os_diameter' => 14.0,
                'replacement_schedule' => 'monthly',
                'notes' => 'Air Optix Aqua preferred. Good candidate for extended wear if needed.',
            ],
            // Jennifer Brown - colored lenses
            [
                'customer_index' => 4,
                'prescribed_at' => Carbon::now()->subWeeks(3),
                'expires_at' => Carbon::now()->addMonths(11),
                'od_sphere' => 0.00,
                'od_cylinder' => null,
                'od_axis' => null,
                'od_base_curve' => 8.6,
                'od_diameter' => 14.5,
                'os_sphere' => 0.00,
                'os_cylinder' => null,
                'os_axis' => null,
                'os_base_curve' => 8.6,
                'os_diameter' => 14.5,
                'replacement_schedule' => 'monthly',
                'notes' => 'Freshlook Colorblends in Green requested for cosmetic purposes.',
            ],
        ];

        foreach ($clRxData as $rxData) {
            $customer = $customers[$rxData['customer_index']];
            unset($rxData['customer_index']);

            ContactLensPrescription::updateOrCreate(
                [
                    'business_id' => $businessId,
                    'customer_id' => $customer->id,
                    'prescribed_at' => $rxData['prescribed_at'],
                ],
                array_merge($rxData, [
                    'business_id' => $businessId,
                    'customer_id' => $customer->id,
                    'prescribed_by' => $prescribedBy,
                ])
            );
        }
    }

    /**
     * Seed sample invoices
     */
    private function seedInvoices(int $businessId, int $branchId, int $createdBy, array $customers): void
    {
        $invoiceNumber = 1001;

        // Invoice for Sarah Johnson - Complete glasses
        $invoice1 = Invoice::updateOrCreate(
            ['invoice_number' => 'INV-2024-' . $invoiceNumber++, 'business_id' => $businessId],
            [
                'business_id' => $businessId,
                'branch_id' => $branchId,
                'customer_id' => $customers[0]->id,
                'status' => 'completed',
                'subtotal' => 438.00,
                'discount_amount' => 43.80,
                'discount_type' => 'percentage',
                'tax_amount' => 19.71,
                'total' => 413.91,
                'amount_paid' => 413.91,
                'balance_due' => 0.00,
                'notes' => 'Ray-Ban Clubmaster with premium progressive lenses',
                'warranty_info' => '2 year frame warranty, 1 year lens warranty',
                'estimated_pickup' => Carbon::now()->subDays(7),
                'actual_pickup' => Carbon::now()->subDays(5),
                'created_by' => $createdBy,
            ]
        );

        // Invoice for Michael Anderson - Progressive glasses, deposit paid
        $invoice2 = Invoice::updateOrCreate(
            ['invoice_number' => 'INV-2024-' . $invoiceNumber++, 'business_id' => $businessId],
            [
                'business_id' => $businessId,
                'branch_id' => $branchId,
                'customer_id' => $customers[1]->id,
                'status' => 'deposit_paid',
                'subtotal' => 798.00,
                'discount_amount' => 0.00,
                'discount_type' => 'fixed',
                'tax_amount' => 39.90,
                'total' => 837.90,
                'amount_paid' => 400.00,
                'balance_due' => 437.90,
                'notes' => 'Varilux X Series progressive with Transitions XTRActive',
                'warranty_info' => '2 year frame warranty, 1 year lens warranty',
                'estimated_pickup' => Carbon::now()->addDays(5),
                'actual_pickup' => null,
                'created_by' => $createdBy,
            ]
        );

        // Invoice for Emily Martinez - Contact lenses
        $invoice3 = Invoice::updateOrCreate(
            ['invoice_number' => 'INV-2024-' . $invoiceNumber++, 'business_id' => $businessId],
            [
                'business_id' => $businessId,
                'branch_id' => $branchId,
                'customer_id' => $customers[2]->id,
                'status' => 'completed',
                'subtotal' => 180.00,
                'discount_amount' => 10.00,
                'discount_type' => 'fixed',
                'tax_amount' => 8.50,
                'total' => 178.50,
                'amount_paid' => 178.50,
                'balance_due' => 0.00,
                'notes' => '3-month supply of Air Optix Aqua',
                'warranty_info' => null,
                'estimated_pickup' => Carbon::now()->subDays(2),
                'actual_pickup' => Carbon::now()->subDays(2),
                'created_by' => $createdBy,
            ]
        );

        // Invoice for David Wilson - High-index lenses, ready for pickup
        $invoice4 = Invoice::updateOrCreate(
            ['invoice_number' => 'INV-2024-' . $invoiceNumber++, 'business_id' => $businessId],
            [
                'business_id' => $businessId,
                'branch_id' => $branchId,
                'customer_id' => $customers[3]->id,
                'status' => 'ready_pickup',
                'subtotal' => 1068.00,
                'discount_amount' => 106.80,
                'discount_type' => 'percentage',
                'tax_amount' => 48.06,
                'total' => 1009.26,
                'amount_paid' => 1009.26,
                'balance_due' => 0.00,
                'notes' => 'Tom Ford FT5401 with HOYA 1.74 Ultra High Index',
                'warranty_info' => '2 year frame warranty, 18 month lens warranty',
                'estimated_pickup' => Carbon::now(),
                'actual_pickup' => null,
                'created_by' => $createdBy,
            ]
        );

        // Invoice for Robert Taylor - In lab processing
        Invoice::updateOrCreate(
            ['invoice_number' => 'INV-2024-' . $invoiceNumber++, 'business_id' => $businessId],
            [
                'business_id' => $businessId,
                'branch_id' => $branchId,
                'customer_id' => $customers[5]->id,
                'status' => 'in_lab',
                'subtotal' => 549.00,
                'discount_amount' => 0.00,
                'discount_type' => 'fixed',
                'tax_amount' => 27.45,
                'total' => 576.45,
                'amount_paid' => 300.00,
                'balance_due' => 276.45,
                'notes' => 'Oakley Holbrook RX with Transitions Signature',
                'warranty_info' => '2 year frame warranty, 1 year lens warranty',
                'estimated_pickup' => Carbon::now()->addDays(3),
                'actual_pickup' => null,
                'created_by' => $createdBy,
            ]
        );
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
            ['sku' => 'TF-5401-001', 'brand' => 'Tom Ford', 'model' => 'FT5401', 'color_code' => '001', 'color_name' => 'Shiny Black', 'size_eye' => 51, 'size_bridge' => 20, 'size_temple' => 145, 'category' => 'optical', 'material' => 'acetate', 'gender' => 'male', 'cost_price' => 175.00, 'selling_price' => 385.00, 'quantity' => 3],
            ['sku' => 'TF-5504-052', 'brand' => 'Tom Ford', 'model' => 'FT5504', 'color_code' => '052', 'color_name' => 'Dark Havana', 'size_eye' => 54, 'size_bridge' => 15, 'size_temple' => 145, 'category' => 'optical', 'material' => 'acetate', 'gender' => 'unisex', 'cost_price' => 185.00, 'selling_price' => 405.00, 'quantity' => 2],

            // Persol Collection
            ['sku' => 'PO-3007V-95', 'brand' => 'Persol', 'model' => 'PO3007V', 'color_code' => '95', 'color_name' => 'Black', 'size_eye' => 50, 'size_bridge' => 19, 'size_temple' => 145, 'category' => 'optical', 'material' => 'acetate', 'gender' => 'unisex', 'cost_price' => 120.00, 'selling_price' => 265.00, 'quantity' => 5],
            ['sku' => 'PO-3092V-9014', 'brand' => 'Persol', 'model' => 'PO3092V', 'color_code' => '9014', 'color_name' => 'Havana', 'size_eye' => 48, 'size_bridge' => 19, 'size_temple' => 140, 'category' => 'optical', 'material' => 'acetate', 'gender' => 'unisex', 'cost_price' => 125.00, 'selling_price' => 275.00, 'quantity' => 4],

            // Prada Collection
            ['sku' => 'PR-17TV-1AB', 'brand' => 'Prada', 'model' => 'VPR17T', 'color_code' => '1AB', 'color_name' => 'Black', 'size_eye' => 52, 'size_bridge' => 18, 'size_temple' => 140, 'category' => 'optical', 'material' => 'acetate', 'gender' => 'female', 'cost_price' => 155.00, 'selling_price' => 345.00, 'quantity' => 3],

            // Versace Collection
            ['sku' => 'VE-3186-GB1', 'brand' => 'Versace', 'model' => 'VE3186', 'color_code' => 'GB1', 'color_name' => 'Black', 'size_eye' => 54, 'size_bridge' => 16, 'size_temple' => 140, 'category' => 'optical', 'material' => 'acetate', 'gender' => 'female', 'cost_price' => 145.00, 'selling_price' => 325.00, 'quantity' => 4],

            // Sunglasses
            ['sku' => 'RB-2132-622', 'brand' => 'Ray-Ban', 'model' => 'New Wayfarer', 'color_code' => '622', 'color_name' => 'Matte Black', 'size_eye' => 55, 'size_bridge' => 18, 'size_temple' => 145, 'category' => 'sunglasses', 'material' => 'plastic', 'gender' => 'unisex', 'cost_price' => 70.00, 'selling_price' => 159.00, 'quantity' => 15],
            ['sku' => 'RB-3025-L0205', 'brand' => 'Ray-Ban', 'model' => 'Aviator Classic', 'color_code' => 'L0205', 'color_name' => 'Gold/Green', 'size_eye' => 58, 'size_bridge' => 14, 'size_temple' => 135, 'category' => 'sunglasses', 'material' => 'metal', 'gender' => 'unisex', 'cost_price' => 85.00, 'selling_price' => 179.00, 'quantity' => 10],
            ['sku' => 'OO-9102-E255', 'brand' => 'Oakley', 'model' => 'Holbrook', 'color_code' => 'E2', 'color_name' => 'Matte Black/Prizm', 'size_eye' => 55, 'size_bridge' => 18, 'size_temple' => 137, 'category' => 'sunglasses', 'material' => 'plastic', 'gender' => 'male', 'cost_price' => 95.00, 'selling_price' => 199.00, 'quantity' => 8],

            // Sports
            ['sku' => 'OO-9290-01', 'brand' => 'Oakley', 'model' => 'Jawbreaker', 'color_code' => '01', 'color_name' => 'Polished Black', 'size_eye' => 31, 'size_bridge' => 131, 'size_temple' => 121, 'category' => 'sports', 'material' => 'plastic', 'gender' => 'unisex', 'cost_price' => 110.00, 'selling_price' => 239.00, 'quantity' => 6],
            ['sku' => 'OO-9208-01', 'brand' => 'Oakley', 'model' => 'Radar EV Path', 'color_code' => '01', 'color_name' => 'Polished Black', 'size_eye' => 38, 'size_bridge' => 138, 'size_temple' => 128, 'category' => 'sports', 'material' => 'plastic', 'gender' => 'unisex', 'cost_price' => 100.00, 'selling_price' => 219.00, 'quantity' => 5],

            // Kids Collection
            ['sku' => 'RY-1549-3633', 'brand' => 'Ray-Ban Junior', 'model' => 'RY1549', 'color_code' => '3633', 'color_name' => 'Black/Red', 'size_eye' => 48, 'size_bridge' => 16, 'size_temple' => 130, 'category' => 'kids', 'material' => 'plastic', 'gender' => 'unisex', 'cost_price' => 55.00, 'selling_price' => 119.00, 'quantity' => 8],
            ['sku' => 'RY-1555-3665', 'brand' => 'Ray-Ban Junior', 'model' => 'RY1555', 'color_code' => '3665', 'color_name' => 'Blue/Orange', 'size_eye' => 46, 'size_bridge' => 16, 'size_temple' => 125, 'category' => 'kids', 'material' => 'plastic', 'gender' => 'unisex', 'cost_price' => 50.00, 'selling_price' => 109.00, 'quantity' => 6],
        ];

        foreach ($frames as $frame) {
            Frame::updateOrCreate(
                ['sku' => $frame['sku'], 'business_id' => $businessId],
                array_merge($frame, [
                    'business_id' => $businessId,
                    'low_stock_threshold' => 3,
                    'is_active' => true,
                ])
            );
        }
    }

    /**
     * Seed prescription lenses catalog
     */
    private function seedLenses(int $businessId): void
    {
        $lenses = [
            // Single Vision - Generic
            ['brand' => 'Generic', 'name' => '1.50 Standard CR-39', 'type' => 'single_vision', 'index' => '1.50', 'material' => 'CR-39', 'coatings' => ['Hard Coat'], 'cost_price' => 15.00, 'selling_price' => 49.00, 'lab_supplier' => 'OptiLab USA', 'lead_time_days' => 3],
            ['brand' => 'Generic', 'name' => '1.56 Mid-Index Plastic', 'type' => 'single_vision', 'index' => '1.56', 'material' => 'Plastic', 'coatings' => ['Hard Coat', 'Anti-Reflective'], 'cost_price' => 25.00, 'selling_price' => 79.00, 'lab_supplier' => 'OptiLab USA', 'lead_time_days' => 3],
            ['brand' => 'Generic', 'name' => '1.60 High-Index Plastic', 'type' => 'single_vision', 'index' => '1.60', 'material' => 'High-Index Plastic', 'coatings' => ['Hard Coat', 'Anti-Reflective'], 'cost_price' => 45.00, 'selling_price' => 129.00, 'lab_supplier' => 'OptiLab USA', 'lead_time_days' => 4],
            ['brand' => 'Generic', 'name' => '1.67 Super High-Index', 'type' => 'single_vision', 'index' => '1.67', 'material' => 'High-Index Plastic', 'coatings' => ['Hard Coat', 'Anti-Reflective', 'Hydrophobic'], 'cost_price' => 75.00, 'selling_price' => 189.00, 'lab_supplier' => 'OptiLab USA', 'lead_time_days' => 5],
            ['brand' => 'Generic', 'name' => '1.74 Ultra High-Index', 'type' => 'single_vision', 'index' => '1.74', 'material' => 'High-Index Plastic', 'coatings' => ['Hard Coat', 'Anti-Reflective', 'Hydrophobic'], 'cost_price' => 120.00, 'selling_price' => 289.00, 'lab_supplier' => 'OptiLab USA', 'lead_time_days' => 7],

            // Progressive - Essilor
            ['brand' => 'Essilor', 'name' => 'Varilux Comfort Max', 'type' => 'progressive', 'index' => '1.50', 'material' => 'Plastic', 'coatings' => ['Crizal Easy Pro'], 'cost_price' => 180.00, 'selling_price' => 399.00, 'lab_supplier' => 'Essilor Labs', 'lead_time_days' => 5],
            ['brand' => 'Essilor', 'name' => 'Varilux Comfort Max', 'type' => 'progressive', 'index' => '1.60', 'material' => 'High-Index', 'coatings' => ['Crizal Sapphire'], 'cost_price' => 220.00, 'selling_price' => 499.00, 'lab_supplier' => 'Essilor Labs', 'lead_time_days' => 5],
            ['brand' => 'Essilor', 'name' => 'Varilux X Series', 'type' => 'progressive', 'index' => '1.67', 'material' => 'High-Index', 'coatings' => ['Crizal Sapphire 360°'], 'cost_price' => 320.00, 'selling_price' => 699.00, 'lab_supplier' => 'Essilor Labs', 'lead_time_days' => 7],

            // Progressive - HOYA
            ['brand' => 'HOYA', 'name' => 'iD MyStyle V+', 'type' => 'progressive', 'index' => '1.60', 'material' => 'High-Index', 'coatings' => ['Super HiVision EX3'], 'cost_price' => 280.00, 'selling_price' => 599.00, 'lab_supplier' => 'HOYA Vision', 'lead_time_days' => 6],
            ['brand' => 'HOYA', 'name' => 'iD Lifestyle 3', 'type' => 'progressive', 'index' => '1.67', 'material' => 'High-Index', 'coatings' => ['Super HiVision MEIRYO'], 'cost_price' => 350.00, 'selling_price' => 799.00, 'lab_supplier' => 'HOYA Vision', 'lead_time_days' => 7],

            // Bifocal
            ['brand' => 'Generic', 'name' => 'Flat Top 28 Bifocal', 'type' => 'bifocal', 'index' => '1.50', 'material' => 'CR-39', 'coatings' => ['Hard Coat'], 'cost_price' => 35.00, 'selling_price' => 99.00, 'lab_supplier' => 'OptiLab USA', 'lead_time_days' => 4],
            ['brand' => 'Essilor', 'name' => 'Flat Top 28 Bifocal', 'type' => 'bifocal', 'index' => '1.56', 'material' => 'Plastic', 'coatings' => ['Crizal Easy Pro'], 'cost_price' => 65.00, 'selling_price' => 149.00, 'lab_supplier' => 'Essilor Labs', 'lead_time_days' => 5],

            // Office/Computer
            ['brand' => 'Essilor', 'name' => 'Eyezen Start', 'type' => 'office', 'index' => '1.56', 'material' => 'Plastic', 'coatings' => ['Blue Light Filter', 'Anti-Reflective'], 'cost_price' => 85.00, 'selling_price' => 199.00, 'lab_supplier' => 'Essilor Labs', 'lead_time_days' => 4],
            ['brand' => 'HOYA', 'name' => 'Sync III', 'type' => 'office', 'index' => '1.60', 'material' => 'High-Index', 'coatings' => ['Blue Control', 'Super HiVision'], 'cost_price' => 120.00, 'selling_price' => 269.00, 'lab_supplier' => 'HOYA Vision', 'lead_time_days' => 5],

            // Photochromic/Transitions
            ['brand' => 'Essilor', 'name' => 'Transitions Signature GEN 8', 'type' => 'single_vision', 'index' => '1.56', 'material' => 'Plastic', 'coatings' => ['Transitions', 'Anti-Reflective'], 'cost_price' => 95.00, 'selling_price' => 229.00, 'lab_supplier' => 'Essilor Labs', 'lead_time_days' => 5],
            ['brand' => 'Essilor', 'name' => 'Transitions XTRActive', 'type' => 'single_vision', 'index' => '1.60', 'material' => 'High-Index', 'coatings' => ['Transitions XTRActive', 'Crizal'], 'cost_price' => 140.00, 'selling_price' => 319.00, 'lab_supplier' => 'Essilor Labs', 'lead_time_days' => 6],
            ['brand' => 'HOYA', 'name' => 'Sensity 2', 'type' => 'single_vision', 'index' => '1.67', 'material' => 'High-Index', 'coatings' => ['Sensity', 'Super HiVision'], 'cost_price' => 160.00, 'selling_price' => 359.00, 'lab_supplier' => 'HOYA Vision', 'lead_time_days' => 7],
        ];

        foreach ($lenses as $lens) {
            Lens::updateOrCreate(
                ['name' => $lens['name'], 'brand' => $lens['brand'], 'business_id' => $businessId],
                array_merge($lens, [
                    'business_id' => $businessId,
                    'is_active' => true,
                ])
            );
        }
    }

    /**
     * Seed contact lenses inventory
     */
    private function seedContactLenses(int $businessId): void
    {
        $contactLenses = [
            // Acuvue (J&J Vision) - Daily
            ['brand' => 'Acuvue', 'product_line' => '1-Day Acuvue Moist', 'type' => 'spherical', 'replacement_schedule' => 'daily', 'power' => -2.00, 'cylinder' => null, 'axis' => null, 'base_curve' => 8.5, 'diameter' => 14.2, 'box_quantity' => 90, 'boxes_in_stock' => 15, 'cost_price_per_box' => 35.00, 'selling_price_per_box' => 59.00, 'expiry_date' => '2026-06-30'],
            ['brand' => 'Acuvue', 'product_line' => '1-Day Acuvue Moist', 'type' => 'spherical', 'replacement_schedule' => 'daily', 'power' => -3.00, 'cylinder' => null, 'axis' => null, 'base_curve' => 8.5, 'diameter' => 14.2, 'box_quantity' => 90, 'boxes_in_stock' => 12, 'cost_price_per_box' => 35.00, 'selling_price_per_box' => 59.00, 'expiry_date' => '2026-06-30'],
            ['brand' => 'Acuvue', 'product_line' => '1-Day Acuvue Moist for Astigmatism', 'type' => 'toric', 'replacement_schedule' => 'daily', 'power' => -2.25, 'cylinder' => -0.75, 'axis' => 180, 'base_curve' => 8.5, 'diameter' => 14.5, 'box_quantity' => 30, 'boxes_in_stock' => 8, 'cost_price_per_box' => 32.00, 'selling_price_per_box' => 55.00, 'expiry_date' => '2026-04-30'],

            // Acuvue - Bi-weekly
            ['brand' => 'Acuvue', 'product_line' => 'Acuvue Oasys with Hydraclear Plus', 'type' => 'spherical', 'replacement_schedule' => 'biweekly', 'power' => -2.50, 'cylinder' => null, 'axis' => null, 'base_curve' => 8.4, 'diameter' => 14.0, 'box_quantity' => 6, 'boxes_in_stock' => 20, 'cost_price_per_box' => 22.00, 'selling_price_per_box' => 45.00, 'expiry_date' => '2026-08-31'],
            ['brand' => 'Acuvue', 'product_line' => 'Acuvue Oasys for Astigmatism', 'type' => 'toric', 'replacement_schedule' => 'biweekly', 'power' => -1.75, 'cylinder' => -1.25, 'axis' => 90, 'base_curve' => 8.6, 'diameter' => 14.5, 'box_quantity' => 6, 'boxes_in_stock' => 10, 'cost_price_per_box' => 35.00, 'selling_price_per_box' => 65.00, 'expiry_date' => '2026-05-31'],

            // Alcon - Daily
            ['brand' => 'Alcon', 'product_line' => 'Dailies AquaComfort Plus', 'type' => 'spherical', 'replacement_schedule' => 'daily', 'power' => -1.50, 'cylinder' => null, 'axis' => null, 'base_curve' => 8.7, 'diameter' => 14.0, 'box_quantity' => 90, 'boxes_in_stock' => 18, 'cost_price_per_box' => 30.00, 'selling_price_per_box' => 52.00, 'expiry_date' => '2026-09-30'],
            ['brand' => 'Alcon', 'product_line' => 'Dailies Total1', 'type' => 'spherical', 'replacement_schedule' => 'daily', 'power' => -2.00, 'cylinder' => null, 'axis' => null, 'base_curve' => 8.5, 'diameter' => 14.1, 'box_quantity' => 90, 'boxes_in_stock' => 10, 'cost_price_per_box' => 55.00, 'selling_price_per_box' => 95.00, 'expiry_date' => '2026-07-31'],

            // Alcon - Monthly
            ['brand' => 'Alcon', 'product_line' => 'Air Optix Aqua', 'type' => 'spherical', 'replacement_schedule' => 'monthly', 'power' => -3.50, 'cylinder' => null, 'axis' => null, 'base_curve' => 8.6, 'diameter' => 14.2, 'box_quantity' => 6, 'boxes_in_stock' => 25, 'cost_price_per_box' => 25.00, 'selling_price_per_box' => 48.00, 'expiry_date' => '2026-10-31'],
            ['brand' => 'Alcon', 'product_line' => 'Air Optix for Astigmatism', 'type' => 'toric', 'replacement_schedule' => 'monthly', 'power' => -2.75, 'cylinder' => -1.25, 'axis' => 170, 'base_curve' => 8.7, 'diameter' => 14.5, 'box_quantity' => 6, 'boxes_in_stock' => 12, 'cost_price_per_box' => 38.00, 'selling_price_per_box' => 72.00, 'expiry_date' => '2026-06-30'],
            ['brand' => 'Alcon', 'product_line' => 'Air Optix Aqua Multifocal', 'type' => 'multifocal', 'replacement_schedule' => 'monthly', 'power' => -1.00, 'cylinder' => null, 'axis' => null, 'base_curve' => 8.6, 'diameter' => 14.2, 'box_quantity' => 6, 'boxes_in_stock' => 8, 'cost_price_per_box' => 45.00, 'selling_price_per_box' => 85.00, 'expiry_date' => '2026-05-31'],

            // CooperVision - Monthly
            ['brand' => 'CooperVision', 'product_line' => 'Biofinity', 'type' => 'spherical', 'replacement_schedule' => 'monthly', 'power' => -4.00, 'cylinder' => null, 'axis' => null, 'base_curve' => 8.6, 'diameter' => 14.0, 'box_quantity' => 6, 'boxes_in_stock' => 22, 'cost_price_per_box' => 28.00, 'selling_price_per_box' => 52.00, 'expiry_date' => '2026-11-30'],
            ['brand' => 'CooperVision', 'product_line' => 'Biofinity Toric', 'type' => 'toric', 'replacement_schedule' => 'monthly', 'power' => -3.25, 'cylinder' => -1.75, 'axis' => 10, 'base_curve' => 8.7, 'diameter' => 14.5, 'box_quantity' => 6, 'boxes_in_stock' => 10, 'cost_price_per_box' => 42.00, 'selling_price_per_box' => 78.00, 'expiry_date' => '2026-08-31'],
            ['brand' => 'CooperVision', 'product_line' => 'Biofinity Multifocal', 'type' => 'multifocal', 'replacement_schedule' => 'monthly', 'power' => +0.50, 'cylinder' => null, 'axis' => null, 'base_curve' => 8.6, 'diameter' => 14.0, 'box_quantity' => 6, 'boxes_in_stock' => 6, 'cost_price_per_box' => 48.00, 'selling_price_per_box' => 89.00, 'expiry_date' => '2026-04-30'],

            // Alcon - Color Lenses
            ['brand' => 'Alcon', 'product_line' => 'Freshlook Colorblends', 'type' => 'color', 'replacement_schedule' => 'monthly', 'power' => 0.00, 'cylinder' => null, 'axis' => null, 'base_curve' => 8.6, 'diameter' => 14.5, 'box_quantity' => 2, 'boxes_in_stock' => 15, 'cost_price_per_box' => 18.00, 'selling_price_per_box' => 38.00, 'expiry_date' => '2026-12-31'],
            ['brand' => 'Alcon', 'product_line' => 'Freshlook Colorblends', 'type' => 'color', 'replacement_schedule' => 'monthly', 'power' => -1.50, 'cylinder' => null, 'axis' => null, 'base_curve' => 8.6, 'diameter' => 14.5, 'box_quantity' => 2, 'boxes_in_stock' => 12, 'cost_price_per_box' => 18.00, 'selling_price_per_box' => 38.00, 'expiry_date' => '2026-12-31'],

            // CooperVision Daily
            ['brand' => 'CooperVision', 'product_line' => 'MyDay Daily', 'type' => 'spherical', 'replacement_schedule' => 'daily', 'power' => -2.25, 'cylinder' => null, 'axis' => null, 'base_curve' => 8.4, 'diameter' => 14.2, 'box_quantity' => 90, 'boxes_in_stock' => 14, 'cost_price_per_box' => 42.00, 'selling_price_per_box' => 75.00, 'expiry_date' => '2026-07-31'],
            ['brand' => 'CooperVision', 'product_line' => 'clariti 1 day', 'type' => 'spherical', 'replacement_schedule' => 'daily', 'power' => -1.75, 'cylinder' => null, 'axis' => null, 'base_curve' => 8.6, 'diameter' => 14.1, 'box_quantity' => 90, 'boxes_in_stock' => 16, 'cost_price_per_box' => 32.00, 'selling_price_per_box' => 55.00, 'expiry_date' => '2026-08-31'],

            // Acuvue Multifocal
            ['brand' => 'Acuvue', 'product_line' => '1-Day Acuvue Moist Multifocal', 'type' => 'multifocal', 'replacement_schedule' => 'daily', 'power' => +1.00, 'cylinder' => null, 'axis' => null, 'base_curve' => 8.4, 'diameter' => 14.3, 'box_quantity' => 30, 'boxes_in_stock' => 8, 'cost_price_per_box' => 45.00, 'selling_price_per_box' => 82.00, 'expiry_date' => '2026-05-31'],
        ];

        foreach ($contactLenses as $cl) {
            ContactLens::updateOrCreate(
                [
                    'brand' => $cl['brand'],
                    'product_line' => $cl['product_line'],
                    'power' => $cl['power'],
                    'business_id' => $businessId
                ],
                array_merge($cl, [
                    'business_id' => $businessId,
                    'is_active' => true,
                ])
            );
        }
    }

    /**
     * Seed payments for realistic reports
     */
    private function seedPayments(int $businessId, int $staffId, int $optometristId): void
    {
        $invoices = Invoice::where('business_id', $businessId)->get();
        $paymentMethods = ['cash', 'credit_card', 'debit_card', 'insurance'];

        foreach ($invoices as $invoice) {
            // Create payments spread over different days for realistic reports
            $amountPaid = $invoice->amount_paid;

            if ($amountPaid > 0) {
                // Determine number of payments (1-2)
                $numPayments = $amountPaid >= 500 ? 2 : 1;
                $paymentAmounts = [];

                if ($numPayments == 2) {
                    $deposit = round($amountPaid * 0.5, 2);
                    $paymentAmounts[] = ['amount' => $deposit, 'days_ago' => rand(5, 14)];
                    $paymentAmounts[] = ['amount' => $amountPaid - $deposit, 'days_ago' => rand(0, 3)];
                } else {
                    $paymentAmounts[] = ['amount' => $amountPaid, 'days_ago' => rand(0, 7)];
                }

                foreach ($paymentAmounts as $paymentData) {
                    $receivedAt = Carbon::now()->subDays($paymentData['days_ago']);
                    $receivedBy = rand(0, 1) ? $staffId : $optometristId;

                    Payment::updateOrCreate(
                        [
                            'invoice_id' => $invoice->id,
                            'amount' => $paymentData['amount'],
                            'received_at' => $receivedAt,
                        ],
                        [
                            'business_id' => $businessId,
                            'invoice_id' => $invoice->id,
                            'amount' => $paymentData['amount'],
                            'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                            'reference' => 'PAY-' . strtoupper(substr(md5(uniqid()), 0, 8)),
                            'received_by' => $receivedBy,
                            'received_at' => $receivedAt,
                        ]
                    );
                }
            }
        }

        // Add extra payments for today to show in daily report
        $todayPayments = [
            ['amount' => 89.00, 'method' => 'cash'],
            ['amount' => 245.00, 'method' => 'credit_card'],
            ['amount' => 156.50, 'method' => 'debit_card'],
        ];

        $firstInvoice = $invoices->first();
        if ($firstInvoice) {
            foreach ($todayPayments as $payment) {
                Payment::create([
                    'business_id' => $businessId,
                    'invoice_id' => $firstInvoice->id,
                    'amount' => $payment['amount'],
                    'payment_method' => $payment['method'],
                    'reference' => 'PAY-' . strtoupper(substr(md5(uniqid()), 0, 8)),
                    'received_by' => $staffId,
                    'received_at' => Carbon::now(),
                ]);
            }
        }
    }

    /**
     * Seed job cards for lab management
     */
    private function seedJobCards(int $businessId): void
    {
        $invoices = Invoice::where('business_id', $businessId)->get();
        $statuses = ['pending', 'in_progress', 'completed', 'pending', 'in_progress'];

        $jobIndex = 0;
        foreach ($invoices as $invoice) {
            $status = $statuses[$jobIndex % count($statuses)];
            $jobIndex++;

            $startedAt = null;
            $completedAt = null;

            if ($status === 'in_progress') {
                $startedAt = Carbon::now()->subDays(rand(1, 3));
            } elseif ($status === 'completed') {
                $startedAt = Carbon::now()->subDays(rand(5, 10));
                $completedAt = Carbon::now()->subDays(rand(1, 4));
            }

            JobCard::updateOrCreate(
                ['invoice_id' => $invoice->id],
                [
                    'business_id' => $businessId,
                    'invoice_id' => $invoice->id,
                    'job_number' => 'JOB-' . Carbon::now()->format('Ymd') . '-' . str_pad($jobIndex, 4, '0', STR_PAD_LEFT),
                    'status' => $status,
                    'prescription_details' => [
                        'od_sphere' => -2.25,
                        'od_cylinder' => -0.75,
                        'od_axis' => 180,
                        'os_sphere' => -2.00,
                        'os_cylinder' => -0.50,
                        'os_axis' => 175,
                        'pd' => 63,
                    ],
                    'frame_details' => [
                        'brand' => 'Ray-Ban',
                        'model' => 'Clubmaster',
                        'color' => 'Black/Gold',
                    ],
                    'lens_details' => [
                        'type' => 'Progressive',
                        'material' => '1.60 High-Index',
                        'coatings' => ['Anti-Reflective', 'Blue Light Filter'],
                    ],
                    'special_instructions' => $status === 'pending' ? 'Rush order - customer needs by weekend' : null,
                    'started_at' => $startedAt,
                    'completed_at' => $completedAt,
                ]
            );
        }
    }
}
