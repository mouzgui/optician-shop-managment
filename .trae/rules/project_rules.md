# 🏥 Optical Shop Management System — Project Rules

> **Product Type:** CodeCanyon-Ready Commercial SaaS Product  
> **Architecture:** Multi-Tenant Single Installation  
> **Tech Stack:** Laravel + Inertia.js + React + TypeScript + Tailwind CSS

---

## 📋 Table of Contents

1. [Product Vision](#1-product-vision)
2. [Architecture Principles](#2-architecture-principles)
3. [Database Design Rules](#3-database-design-rules)
4. [User Roles & Access Control](#4-user-roles--access-control)
5. [Module Specifications](#5-module-specifications)
6. [API & Backend Conventions](#6-api--backend-conventions)
7. [Frontend Conventions](#7-frontend-conventions)
8. [Design System & Tokens](#8-design-system--tokens)
9. [Internationalization (i18n)](#9-internationalization-i18n)
10. [Security Requirements](#10-security-requirements)
11. [Performance Standards](#11-performance-standards)
12. [UI/UX Guidelines](#12-uiux-guidelines)
13. [Testing Standards](#13-testing-standards)
14. [Documentation Requirements](#14-documentation-requirements)
15. [Scope Boundaries](#15-scope-boundaries)

---

## 1. Product Vision

### 1.1 Core Purpose

A **Retail Optical POS & Management System** bridging the gap between:

- Standard retail POS (cannot handle prescriptions)
- Medical EHR systems (too complex/expensive)

### 1.2 Target Users

| User Type                    | Description                                                    |
| ---------------------------- | -------------------------------------------------------------- |
| **Buyer** (Developer/Agency) | White-label ready system, install once, serve multiple clients |
| **End User** (Shop Owner)    | Simplified workflow for optical retail operations              |

### 1.3 Unique Value Proposition

- Handles the unique **"Deposit → Lab Work → Pickup"** cycle
- Multi-business support from a single installation
- Complete white-labeling capabilities

---

## 2. Architecture Principles

### 2.1 Multi-Tenant Model

```
┌─────────────────────────────────────────────────────┐
│              SINGLE INSTALLATION                     │
│                 SINGLE DATABASE                      │
├─────────────────────────────────────────────────────┤
│  Business A    │   Business B    │   Business C     │
│  (Shop 1)      │   (Shop 2)      │   (Chain: 3 loc) │
│  └─ Data       │   └─ Data       │   └─ Branch 1    │
│                │                 │   └─ Branch 2    │
│                │                 │   └─ Branch 3    │
└─────────────────────────────────────────────────────┘
```

### 2.2 Data Isolation Rules

> [!CAUTION] > **CRITICAL:** Every database query MUST be scoped by `business_id`. Cross-business data access is strictly forbidden.

```php
// ✅ CORRECT - Always scope queries
$customers = Customer::where('business_id', auth()->user()->business_id)->get();

// ❌ WRONG - Never query without business scope
$customers = Customer::all();
```

### 2.3 Scalability Targets

- **Independent Shops:** 1 location
- **Small Chains:** 1 Business Entity → 2-5 Branches
- **Agency Deployment:** 50+ Businesses per installation

### 2.4 Folder Structure

```
opticina-shop-managment/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/           # Super Admin controllers
│   │   │   ├── Business/        # Business Owner controllers
│   │   │   ├── Clinical/        # Optometrist controllers
│   │   │   ├── Sales/           # Staff controllers
│   │   │   └── Lab/             # Lab Technician controllers
│   │   ├── Middleware/
│   │   │   ├── EnsureBusinessAccess.php
│   │   │   ├── EnsureRole.php
│   │   │   └── EnsureBranchAccess.php
│   │   └── Requests/            # Form Request validation
│   ├── Models/
│   │   ├── Traits/
│   │   │   └── BelongsToBusiness.php  # Auto-scope trait
│   │   ├── Business.php
│   │   ├── Branch.php
│   │   ├── Customer.php
│   │   ├── Prescription.php
│   │   └── ...
│   ├── Services/                # Business logic layer
│   ├── Policies/                # Authorization policies
│   └── Enums/                   # PHP Enums for statuses
├── resources/
│   └── js/
│       ├── Components/          # Reusable React components
│       ├── Layouts/             # Page layouts
│       ├── Pages/               # Inertia pages
│       │   ├── Admin/
│       │   ├── Business/
│       │   ├── Clinical/
│       │   ├── Sales/
│       │   └── Lab/
│       ├── Hooks/               # Custom React hooks
│       ├── Types/               # TypeScript type definitions
│       └── Utils/               # Helper utilities
├── database/
│   ├── migrations/
│   └── seeders/
├── config/
├── routes/
│   ├── web.php
│   ├── admin.php
│   └── api.php
└── tests/
```

---

## 3. Database Design Rules

### 3.1 Mandatory Fields

Every business-scoped table MUST include:

```php
Schema::create('table_name', function (Blueprint $table) {
    $table->id();
    $table->foreignId('business_id')->constrained()->cascadeOnDelete();
    $table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
    $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
    $table->timestamps();
    $table->softDeletes();

    // Performance index
    $table->index(['business_id', 'branch_id']);
});
```

### 3.2 Core Entity Relationships

```
Business (1) ─────┬───── (*) Branch
                  ├───── (*) User
                  ├───── (*) Customer
                  ├───── (*) Frame (Inventory)
                  ├───── (*) Lens Catalog
                  ├───── (*) Contact Lens Stock
                  └───── (*) Invoice

Customer (1) ─────┬───── (*) Prescription (Spectacle Rx)
                  ├───── (*) ContactLensPrescription
                  ├───── (*) Invoice
                  └───── (*) FamilyLink (self-referential)

Invoice (1) ──────┬───── (*) InvoiceItem
                  ├───── (*) Payment
                  └───── (1) JobCard
```

### 3.3 Enum Definitions

```php
// app/Enums/InvoiceStatus.php
enum InvoiceStatus: string
{
    case DEPOSIT_PAID = 'deposit_paid';
    case IN_LAB = 'in_lab';
    case READY_PICKUP = 'ready_pickup';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
}

// app/Enums/PrescriptionType.php
enum PrescriptionType: string
{
    case SPECTACLE = 'spectacle';
    case CONTACT_LENS = 'contact_lens';
}

// app/Enums/UserRole.php
enum UserRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case BUSINESS_OWNER = 'business_owner';
    case OPTOMETRIST = 'optometrist';
    case SALES_STAFF = 'sales_staff';
    case LAB_TECHNICIAN = 'lab_technician';
}
```

---

## 4. User Roles & Access Control

### 4.1 Role Hierarchy

| Role               | Scope                   | Key Permissions                                          |
| ------------------ | ----------------------- | -------------------------------------------------------- |
| **Super Admin**    | System-wide             | Create businesses, manage subscriptions, system config   |
| **Business Owner** | Business + All Branches | Full access: financials, inventory, staff, settings      |
| **Optometrist**    | Business (Clinical)     | Customers (view), Prescriptions (CRUD), Clinical history |
| **Sales Staff**    | Branch                  | Customers (CRUD), Sales (CRUD), Pickups                  |
| **Lab Technician** | Business (Lab)          | Job Cards (view/update status only)                      |

### 4.2 Permission Matrix

```
                          │ Super │ Owner │ Optom │ Sales │ Lab
──────────────────────────┼───────┼───────┼───────┼───────┼─────
Create Business           │   ✓   │       │       │       │
Manage Staff              │   ✓   │   ✓   │       │       │
View Cost Prices          │   ✓   │   ✓   │       │       │
View Financial Reports    │   ✓   │   ✓   │       │       │
Manage Inventory          │   ✓   │   ✓   │       │   ✓   │
Create/Edit Prescriptions │       │   ✓   │   ✓   │       │
View Clinical History     │       │   ✓   │   ✓   │   ✓*  │
Process Sales             │       │   ✓   │       │   ✓   │
Create Customers          │       │   ✓   │   ✓   │   ✓   │
Update Job Status         │       │   ✓   │       │       │  ✓
View Job Cards (No Price) │       │       │       │       │  ✓
──────────────────────────┴───────┴───────┴───────┴───────┴─────
* Sales Staff: Read-only clinical view
```

### 4.3 Implementation Pattern

```php
// Middleware example
class EnsureRole
{
    public function handle($request, Closure $next, ...$roles)
    {
        if (!in_array($request->user()->role, $roles)) {
            abort(403, 'Unauthorized access.');
        }
        return $next($request);
    }
}

// Route protection
Route::middleware(['auth', 'role:business_owner,optometrist'])
    ->group(function () {
        Route::resource('prescriptions', PrescriptionController::class);
    });
```

---

## 5. Module Specifications

### 5.1 Customer Management (CRM)

#### Required Fields

```typescript
interface Customer {
  id: number;
  business_id: number;
  branch_id?: number;

  // Profile
  first_name: string;
  last_name: string;
  phone: string; // Primary identifier for search
  email?: string;
  address?: string;
  date_of_birth?: Date;

  // Metadata
  notes?: string;
  family_head_id?: number; // Self-referential for family linking
  last_visit_at?: Date;
  rx_expiry_flagged: boolean;

  created_at: Date;
  updated_at: Date;
}
```

#### Family Linking Rules

- A customer can be linked to ONE family head
- Family head pays for linked members
- Billing history shows consolidated family view

---

### 5.2 Clinical Module (Prescriptions)

#### 5.2.1 Spectacle Rx Schema

```typescript
interface SpectacleRx {
  id: number;
  customer_id: number;
  prescribed_by: number; // User ID (Optometrist)
  prescribed_at: Date;

  // Right Eye (OD)
  od_sphere: number; // -20.00 to +20.00, step 0.25
  od_cylinder?: number; // -10.00 to +10.00, step 0.25
  od_axis?: number; // 1 to 180 degrees
  od_add?: number; // 0.25 to +4.00 (reading addition)
  od_prism?: string; // e.g., "2.00 BI"

  // Left Eye (OS)
  os_sphere: number;
  os_cylinder?: number;
  os_axis?: number;
  os_add?: number;
  os_prism?: string;

  // Pupillary Distance
  pd_far?: number; // 50-80mm
  pd_near?: number; // 50-80mm
  pd_type: "single" | "dual"; // Single PD or separate OD/OS

  notes?: string;
  expires_at: Date; // Default: prescribed_at + 2 years
}
```

#### 5.2.2 Contact Lens Rx Schema

```typescript
interface ContactLensRx {
  id: number;
  customer_id: number;
  prescribed_by: number;
  prescribed_at: Date;

  // Right Eye (OD)
  od_sphere: number;
  od_cylinder?: number;
  od_axis?: number;
  od_base_curve: number; // 8.0 to 9.5mm, step 0.1
  od_diameter: number; // 13.0 to 15.0mm, step 0.1
  od_brand?: string; // e.g., "Acuvue Oasys"

  // Left Eye (OS)
  os_sphere: number;
  os_cylinder?: number;
  os_axis?: number;
  os_base_curve: number;
  os_diameter: number;
  os_brand?: string;

  replacement_schedule:
    | "daily"
    | "weekly"
    | "bi-weekly"
    | "monthly"
    | "quarterly"
    | "yearly";

  notes?: string;
  expires_at: Date;
}
```

#### 5.2.3 Rx Recall System

> [!IMPORTANT]
> Automatic flagging for prescriptions older than 2 years for marketing recalls.

```php
// Daily scheduled job
class FlagExpiredPrescriptions
{
    public function handle()
    {
        Customer::whereHas('prescriptions', function ($q) {
            $q->where('expires_at', '<', now())
              ->whereNull('recalled_at');
        })->update(['rx_expiry_flagged' => true]);
    }
}
```

---

### 5.3 Inventory Management

#### 5.3.1 Frames (Stock Items)

```typescript
interface Frame {
  id: number;
  business_id: number;
  branch_id?: number;

  sku: string; // Unique within business
  barcode?: string; // For scanner integration

  brand: string;
  model: string;
  color_code: string;
  color_name?: string;

  // Size (Eye-Bridge-Temple)
  size_eye: number; // Lens width (mm)
  size_bridge: number; // Bridge width (mm)
  size_temple: number; // Temple length (mm)

  category: "optical" | "sunglasses" | "sports" | "kids";
  material: "metal" | "plastic" | "titanium" | "acetate" | "mixed";
  gender: "male" | "female" | "unisex" | "kids";

  cost_price: number; // Hidden from non-admin roles
  selling_price: number;

  quantity: number;
  low_stock_threshold: number;

  image_url?: string;
  is_active: boolean;
}
```

#### 5.3.2 Lenses (Catalog/Service Items)

> [!NOTE]
> Lenses are NOT tracked by quantity. They are ordered custom from labs per prescription.

```typescript
interface LensCatalog {
  id: number;
  business_id: number;

  name: string; // e.g., "Single Vision 1.56 HMC"
  type: "single_vision" | "bifocal" | "progressive" | "office" | "sports";
  index: "1.50" | "1.56" | "1.60" | "1.67" | "1.74";

  coatings: string[]; // ['HMC', 'Blue Cut', 'Photochromic']

  cost_price: number;
  selling_price: number;

  lab_supplier?: string;
  lead_time_days?: number;

  is_active: boolean;
}
```

#### 5.3.3 Contact Lenses (Consumables)

```typescript
interface ContactLensStock {
  id: number;
  business_id: number;
  branch_id?: number;

  brand: string;
  product_line: string; // e.g., "Oasys"

  power: number; // Sphere value
  cylinder?: number;
  axis?: number;
  base_curve: number;
  diameter: number;

  box_quantity: number; // Lenses per box (e.g., 6, 30, 90)
  boxes_in_stock: number;

  cost_price_per_box: number;
  selling_price_per_box: number;

  expiry_date?: Date;
}
```

---

### 5.4 Point of Sale (POS) & Invoicing

#### 5.4.1 Split Payment Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  DEPOSIT    │────▶│   IN LAB    │────▶│   READY     │────▶│  COMPLETED  │
│   PAID      │     │             │     │  PICKUP     │     │             │
├─────────────┤     ├─────────────┤     ├─────────────┤     ├─────────────┤
│ Customer    │     │ Job Card    │     │ Notify      │     │ Final       │
│ pays 30-50% │     │ created     │     │ customer    │     │ payment     │
│ Invoice gen │     │ Lab working │     │             │     │ Stock deduct│
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

#### 5.4.2 Invoice Schema

```typescript
interface Invoice {
  id: number;
  business_id: number;
  branch_id: number;
  customer_id: number;

  invoice_number: string; // Auto-generated: INV-YYYYMMDD-XXXX

  status:
    | "deposit_paid"
    | "in_lab"
    | "ready_pickup"
    | "completed"
    | "cancelled";

  subtotal: number;
  discount_amount: number;
  discount_type: "fixed" | "percentage";
  tax_amount: number;
  total: number;

  amount_paid: number;
  balance_due: number;

  prescription_id?: number; // Link to Rx used

  notes?: string;
  warranty_info?: string;

  estimated_pickup: Date;
  actual_pickup?: Date;

  created_by: number;
  created_at: Date;
}

interface InvoiceItem {
  id: number;
  invoice_id: number;

  item_type: "frame" | "lens" | "contact_lens" | "accessory" | "service";
  item_id?: number; // Reference to inventory item

  description: string;
  quantity: number;
  unit_price: number;
  discount: number;
  total: number;
}

interface Payment {
  id: number;
  invoice_id: number;

  amount: number;
  payment_method: "cash" | "card" | "bank_transfer" | "insurance";

  reference?: string; // Transaction ID, check number, etc.
  insurance_claim_id?: string;

  received_by: number;
  received_at: Date;
}
```

#### 5.4.3 Print Templates

| Template            | Purpose        | Content                     | Visible To |
| ------------------- | -------------- | --------------------------- | ---------- |
| **Thermal Receipt** | Payment proof  | Amount, date, balance       | Customer   |
| **A4 Invoice**      | Full invoice   | Rx details, items, warranty | Customer   |
| **Job Card**        | Lab work order | Rx + Frame info ONLY        | Lab Tech   |

> [!WARNING]
> Job Cards MUST NOT include prices. Lab technicians should only see technical specifications.

---

### 5.5 Reporting Module

#### Required Reports

| Report               | Access             | Description                       |
| -------------------- | ------------------ | --------------------------------- |
| Daily Revenue        | Owner              | Today's sales, payments received  |
| Monthly Revenue      | Owner              | Monthly breakdown with trends     |
| Outstanding Balances | Owner              | Unpaid deposits, aged receivables |
| Best-Selling Brands  | Owner              | Frame/lens brand performance      |
| Low Stock Alerts     | Owner, Sales       | Items below threshold             |
| Staff Commission     | Owner              | Sales per staff member            |
| Rx Expiry Report     | Owner, Optometrist | Customers due for re-testing      |

---

## 6. API & Backend Conventions

### 6.1 Controller Organization

```php
// Controllers grouped by role/domain
app/Http/Controllers/
├── Admin/
│   ├── BusinessController.php
│   └── SystemSettingsController.php
├── Business/
│   ├── DashboardController.php
│   ├── StaffController.php
│   ├── BranchController.php
│   └── SettingsController.php
├── Clinical/
│   ├── CustomerController.php
│   ├── SpectacleRxController.php
│   └── ContactLensRxController.php
├── Sales/
│   ├── POSController.php
│   ├── InvoiceController.php
│   └── PaymentController.php
├── Lab/
│   └── JobCardController.php
└── Reports/
    └── ReportController.php
```

### 6.2 Service Layer Pattern

```php
// Business logic in Services, not Controllers
class InvoiceService
{
    public function createWithDeposit(array $data, float $depositAmount): Invoice
    {
        return DB::transaction(function () use ($data, $depositAmount) {
            $invoice = Invoice::create([...$data, 'status' => InvoiceStatus::DEPOSIT_PAID]);

            $invoice->payments()->create([
                'amount' => $depositAmount,
                'payment_method' => $data['payment_method'],
                'received_by' => auth()->id(),
            ]);

            $invoice->update([
                'amount_paid' => $depositAmount,
                'balance_due' => $invoice->total - $depositAmount,
            ]);

            // Create Job Card for lab
            JobCard::createFromInvoice($invoice);

            return $invoice;
        });
    }
}
```

### 6.3 Request Validation

```php
// Always use Form Requests
class StoreSpectacleRxRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'customer_id' => ['required', 'exists:customers,id'],

            'od_sphere' => ['required', 'numeric', 'between:-20,20'],
            'od_cylinder' => ['nullable', 'numeric', 'between:-10,10'],
            'od_axis' => ['nullable', 'integer', 'between:1,180'],
            'od_add' => ['nullable', 'numeric', 'between:0.25,4'],

            'os_sphere' => ['required', 'numeric', 'between:-20,20'],
            // ... same for OS

            'pd_far' => ['nullable', 'numeric', 'between:50,80'],
            'pd_near' => ['nullable', 'numeric', 'between:50,80'],
        ];
    }
}
```

### 6.4 API Response Format

```php
// Consistent JSON responses
return response()->json([
    'success' => true,
    'data' => $resource,
    'message' => 'Customer created successfully',
]);

// Error responses
return response()->json([
    'success' => false,
    'message' => 'Validation failed',
    'errors' => $validator->errors(),
], 422);
```

---

## 7. Frontend Conventions

### 7.1 Component Structure

```
resources/js/
├── Components/
│   ├── UI/                    # Generic UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── DataTable.tsx
│   ├── Forms/                 # Form-specific components
│   │   ├── CustomerForm.tsx
│   │   ├── PrescriptionForm.tsx
│   │   └── InvoiceForm.tsx
│   ├── Clinical/              # Clinical domain components
│   │   ├── RxDisplay.tsx
│   │   ├── RxComparison.tsx
│   │   └── ClinicalHistory.tsx
│   └── POS/                   # POS domain components
│       ├── ProductSearch.tsx
│       ├── Cart.tsx
│       └── PaymentModal.tsx
├── Layouts/
│   ├── AuthenticatedLayout.tsx
│   ├── AdminLayout.tsx
│   └── POSLayout.tsx
└── Pages/
    ├── Admin/
    ├── Business/
    ├── Clinical/
    ├── Sales/
    └── Lab/
```

### 7.2 TypeScript Requirements

```typescript
// Always define interfaces for data structures
interface Customer {
  id: number;
  full_name: string;
  phone: string;
  // ...
}

// Use strict typing for props
interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  isLoading: boolean;
}

// Avoid 'any' type - use 'unknown' if type is truly unknown
```

### 7.3 State Management

- Use **Inertia.js** shared data for global state (auth user, business settings)
- Use **React Context** for complex component trees (POS cart state)
- Use **useState/useReducer** for local component state

### 7.4 Form Handling

```typescript
// Use react-hook-form with Inertia
import { useForm } from "@inertiajs/react";

function CustomerForm({ customer }: CustomerFormProps) {
  const { data, setData, post, processing, errors } = useForm({
    first_name: customer?.first_name ?? "",
    last_name: customer?.last_name ?? "",
    phone: customer?.phone ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("customers.store"));
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

---

## 8. Design System & Tokens

### 8.1 Theme Architecture

> [!IMPORTANT]
> All UI components MUST use design tokens (CSS variables) for colors, spacing, and typography. Direct color values are strictly forbidden.

```
┌─────────────────────────────────────────────────────────────────┐
│                      THEME LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  CSS Variables (Design Tokens)                                  │
│  ├── Primitive Tokens (raw values)                              │
│  ├── Semantic Tokens (purpose-based)                            │
│  └── Component Tokens (component-specific)                      │
├─────────────────────────────────────────────────────────────────┤
│  Light Mode    │    Dark Mode    │    White-Label Override      │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Color Token System

```css
/* resources/css/tokens.css */

:root {
  /* ═══════════════════════════════════════════════════════════════
     PRIMITIVE TOKENS (Raw Color Palette)
     ═══════════════════════════════════════════════════════════════ */

  /* Primary Brand Colors - Blue (Default, White-Label Override) */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;
  --color-primary-950: #172554;

  /* Neutral Colors (Gray Scale) */
  --color-neutral-0: #ffffff;
  --color-neutral-50: #f9fafb;
  --color-neutral-100: #f3f4f6;
  --color-neutral-200: #e5e7eb;
  --color-neutral-300: #d1d5db;
  --color-neutral-400: #9ca3af;
  --color-neutral-500: #6b7280;
  --color-neutral-600: #4b5563;
  --color-neutral-700: #374151;
  --color-neutral-800: #1f2937;
  --color-neutral-900: #111827;
  --color-neutral-950: #030712;

  /* Semantic Status Colors */
  --color-success-50: #f0fdf4;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  --color-success-700: #15803d;

  --color-warning-50: #fffbeb;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  --color-warning-700: #b45309;

  --color-error-50: #fef2f2;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  --color-error-700: #b91c1c;

  --color-info-50: #eff6ff;
  --color-info-500: #3b82f6;
  --color-info-600: #2563eb;
  --color-info-700: #1d4ed8;
}
```

### 8.3 Light Mode Tokens

```css
:root,
[data-theme="light"] {
  /* ═══════════════════════════════════════════════════════════════
     SEMANTIC TOKENS - Light Mode
     ═══════════════════════════════════════════════════════════════ */

  /* Background Layers */
  --bg-base: var(--color-neutral-0);
  --bg-subtle: var(--color-neutral-50);
  --bg-muted: var(--color-neutral-100);
  --bg-elevated: var(--color-neutral-0);
  --bg-overlay: rgba(0, 0, 0, 0.5);

  /* Foreground / Text */
  --text-primary: var(--color-neutral-900);
  --text-secondary: var(--color-neutral-600);
  --text-muted: var(--color-neutral-400);
  --text-inverted: var(--color-neutral-0);
  --text-link: var(--color-primary-600);
  --text-link-hover: var(--color-primary-700);

  /* Borders */
  --border-default: var(--color-neutral-200);
  --border-strong: var(--color-neutral-300);
  --border-focus: var(--color-primary-500);

  /* Interactive States */
  --interactive-primary: var(--color-primary-600);
  --interactive-primary-hover: var(--color-primary-700);
  --interactive-primary-active: var(--color-primary-800);
  --interactive-secondary: var(--color-neutral-100);
  --interactive-secondary-hover: var(--color-neutral-200);

  /* Status Indicators */
  --status-success-bg: var(--color-success-50);
  --status-success-text: var(--color-success-700);
  --status-success-border: var(--color-success-500);

  --status-warning-bg: var(--color-warning-50);
  --status-warning-text: var(--color-warning-700);
  --status-warning-border: var(--color-warning-500);

  --status-error-bg: var(--color-error-50);
  --status-error-text: var(--color-error-700);
  --status-error-border: var(--color-error-500);

  --status-info-bg: var(--color-info-50);
  --status-info-text: var(--color-info-700);
  --status-info-border: var(--color-info-500);

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}
```

### 8.4 Dark Mode Tokens

```css
[data-theme="dark"] {
  /* ═══════════════════════════════════════════════════════════════
     SEMANTIC TOKENS - Dark Mode
     ═══════════════════════════════════════════════════════════════ */

  /* Background Layers */
  --bg-base: var(--color-neutral-950);
  --bg-subtle: var(--color-neutral-900);
  --bg-muted: var(--color-neutral-800);
  --bg-elevated: var(--color-neutral-900);
  --bg-overlay: rgba(0, 0, 0, 0.7);

  /* Foreground / Text */
  --text-primary: var(--color-neutral-50);
  --text-secondary: var(--color-neutral-300);
  --text-muted: var(--color-neutral-500);
  --text-inverted: var(--color-neutral-900);
  --text-link: var(--color-primary-400);
  --text-link-hover: var(--color-primary-300);

  /* Borders */
  --border-default: var(--color-neutral-700);
  --border-strong: var(--color-neutral-600);
  --border-focus: var(--color-primary-400);

  /* Interactive States */
  --interactive-primary: var(--color-primary-500);
  --interactive-primary-hover: var(--color-primary-400);
  --interactive-primary-active: var(--color-primary-300);
  --interactive-secondary: var(--color-neutral-800);
  --interactive-secondary-hover: var(--color-neutral-700);

  /* Status Indicators (Adjusted for dark backgrounds) */
  --status-success-bg: rgba(34, 197, 94, 0.15);
  --status-success-text: var(--color-success-500);
  --status-success-border: var(--color-success-600);

  --status-warning-bg: rgba(245, 158, 11, 0.15);
  --status-warning-text: var(--color-warning-500);
  --status-warning-border: var(--color-warning-600);

  --status-error-bg: rgba(239, 68, 68, 0.15);
  --status-error-text: var(--color-error-500);
  --status-error-border: var(--color-error-600);

  --status-info-bg: rgba(59, 130, 246, 0.15);
  --status-info-text: var(--color-info-500);
  --status-info-border: var(--color-info-600);

  /* Shadows (More subtle in dark mode) */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
}
```

### 8.5 Component Tokens

```css
:root {
  /* ═══════════════════════════════════════════════════════════════
     COMPONENT-SPECIFIC TOKENS
     ═══════════════════════════════════════════════════════════════ */

  /* Buttons */
  --btn-primary-bg: var(--interactive-primary);
  --btn-primary-text: var(--text-inverted);
  --btn-primary-hover: var(--interactive-primary-hover);

  --btn-secondary-bg: var(--interactive-secondary);
  --btn-secondary-text: var(--text-primary);
  --btn-secondary-hover: var(--interactive-secondary-hover);

  --btn-danger-bg: var(--color-error-600);
  --btn-danger-text: var(--color-neutral-0);
  --btn-danger-hover: var(--color-error-700);

  /* Form Inputs */
  --input-bg: var(--bg-base);
  --input-border: var(--border-default);
  --input-border-focus: var(--border-focus);
  --input-text: var(--text-primary);
  --input-placeholder: var(--text-muted);
  --input-disabled-bg: var(--bg-muted);

  /* Cards */
  --card-bg: var(--bg-elevated);
  --card-border: var(--border-default);
  --card-shadow: var(--shadow-md);

  /* Tables */
  --table-header-bg: var(--bg-subtle);
  --table-row-hover: var(--bg-muted);
  --table-border: var(--border-default);

  /* Navigation / Sidebar */
  --nav-bg: var(--bg-base);
  --nav-item-hover: var(--bg-muted);
  --nav-item-active: var(--color-primary-50);
  --nav-item-active-text: var(--color-primary-700);

  /* Modal */
  --modal-bg: var(--bg-elevated);
  --modal-overlay: var(--bg-overlay);
  --modal-shadow: var(--shadow-xl);
}

[data-theme="dark"] {
  --nav-item-active: var(--color-primary-950);
  --nav-item-active-text: var(--color-primary-300);
}
```

### 8.6 Tailwind CSS Integration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Map CSS variables to Tailwind classes
        primary: {
          50: "var(--color-primary-50)",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
          950: "var(--color-primary-950)",
        },
        // Semantic tokens as Tailwind colors
        bg: {
          base: "var(--bg-base)",
          subtle: "var(--bg-subtle)",
          muted: "var(--bg-muted)",
          elevated: "var(--bg-elevated)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
      },
      boxShadow: {
        "theme-sm": "var(--shadow-sm)",
        "theme-md": "var(--shadow-md)",
        "theme-lg": "var(--shadow-lg)",
        "theme-xl": "var(--shadow-xl)",
      },
    },
  },
};
```

### 8.7 Theme Toggle Implementation

```typescript
// resources/js/Hooks/useTheme.ts
import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "system";
    }
    return "system";
  });

  useEffect(() => {
    const root = document.documentElement;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const effectiveTheme =
      theme === "system" ? (systemPrefersDark ? "dark" : "light") : theme;

    root.setAttribute("data-theme", effectiveTheme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
```

### 8.8 Usage Rules

> [!CAUTION] > **Forbidden Patterns:**
>
> - ❌ `bg-blue-500` (direct color)
> - ❌ `text-gray-700` (direct color)
> - ❌ `border-gray-200` (direct color)
> - ❌ Inline `style={{ color: '#fff' }}`

> [!TIP] > **Required Patterns:**
>
> - ✅ `bg-bg-base` or `bg-[var(--bg-base)]`
> - ✅ `text-text-primary` or `text-[var(--text-primary)]`
> - ✅ `border-[var(--border-default)]`
> - ✅ Use semantic token names

```tsx
// ✅ CORRECT - Using design tokens
<div className="bg-bg-base text-text-primary border border-[var(--border-default)]">
  <button className="bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]">
    Save
  </button>
</div>

// ❌ WRONG - Hardcoded colors
<div className="bg-white text-gray-900 border border-gray-200">
  <button className="bg-blue-600 text-white">Save</button>
</div>
```

---

## 9. Internationalization (i18n)

### 9.1 Supported Languages

| Code | Language          | Direction | Priority |
| ---- | ----------------- | --------- | -------- |
| `en` | English           | LTR       | Primary  |
| `ar` | العربية (Arabic)  | **RTL**   | High     |
| `fr` | Français (French) | LTR       | Medium   |
| `es` | Español (Spanish) | LTR       | Medium   |

### 9.2 Implementation Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    i18n ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────┤
│  Backend (Laravel)                                              │
│  ├── lang/en/*.php (English translations)                       │
│  ├── lang/ar/*.php (Arabic translations)                        │
│  ├── lang/fr/*.php (French translations)                        │
│  └── lang/es/*.php (Spanish translations)                       │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (React)                                               │
│  ├── resources/js/i18n/locales/en.json                          │
│  ├── resources/js/i18n/locales/ar.json                          │
│  ├── resources/js/i18n/locales/fr.json                          │
│  └── resources/js/i18n/locales/es.json                          │
└─────────────────────────────────────────────────────────────────┘
```

### 9.3 Laravel Backend Translations

```php
// lang/en/common.php
return [
    'app_name' => 'Optical Shop Manager',
    'save' => 'Save',
    'cancel' => 'Cancel',
    'delete' => 'Delete',
    'edit' => 'Edit',
    'create' => 'Create',
    'search' => 'Search...',
    'no_results' => 'No results found',
    'loading' => 'Loading...',
    'success' => 'Operation completed successfully',
    'error' => 'An error occurred',
];

// lang/ar/common.php
return [
    'app_name' => 'مدير متجر النظارات',
    'save' => 'حفظ',
    'cancel' => 'إلغاء',
    'delete' => 'حذف',
    'edit' => 'تعديل',
    'create' => 'إنشاء',
    'search' => 'بحث...',
    'no_results' => 'لا توجد نتائج',
    'loading' => 'جاري التحميل...',
    'success' => 'تمت العملية بنجاح',
    'error' => 'حدث خطأ',
];

// lang/fr/common.php
return [
    'app_name' => 'Gestionnaire de Boutique Optique',
    'save' => 'Enregistrer',
    'cancel' => 'Annuler',
    'delete' => 'Supprimer',
    'edit' => 'Modifier',
    'create' => 'Créer',
    'search' => 'Rechercher...',
    'no_results' => 'Aucun résultat trouvé',
    'loading' => 'Chargement...',
    'success' => 'Opération réussie',
    'error' => 'Une erreur est survenue',
];

// lang/es/common.php
return [
    'app_name' => 'Gestor de Óptica',
    'save' => 'Guardar',
    'cancel' => 'Cancelar',
    'delete' => 'Eliminar',
    'edit' => 'Editar',
    'create' => 'Crear',
    'search' => 'Buscar...',
    'no_results' => 'No se encontraron resultados',
    'loading' => 'Cargando...',
    'success' => 'Operación completada',
    'error' => 'Ocurrió un error',
];
```

### 9.4 Frontend Translation Setup

```typescript
// resources/js/i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ar from "./locales/ar.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    fr: { translation: fr },
    es: { translation: es },
  },
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
```

### 9.5 Translation File Structure

```json
// resources/js/i18n/locales/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "confirm": "Confirm",
    "back": "Back",
    "next": "Next"
  },
  "auth": {
    "login": "Login",
    "logout": "Logout",
    "email": "Email Address",
    "password": "Password",
    "remember_me": "Remember Me",
    "forgot_password": "Forgot Password?"
  },
  "customers": {
    "title": "Customers",
    "add_customer": "Add Customer",
    "first_name": "First Name",
    "last_name": "Last Name",
    "phone": "Phone Number",
    "email": "Email",
    "address": "Address",
    "date_of_birth": "Date of Birth",
    "notes": "Notes"
  },
  "prescriptions": {
    "title": "Prescriptions",
    "spectacle_rx": "Spectacle Prescription",
    "contact_lens_rx": "Contact Lens Prescription",
    "right_eye": "Right Eye (OD)",
    "left_eye": "Left Eye (OS)",
    "sphere": "Sphere (SPH)",
    "cylinder": "Cylinder (CYL)",
    "axis": "Axis",
    "add": "Addition (ADD)",
    "pd": "Pupillary Distance (PD)",
    "expires_at": "Expiry Date"
  },
  "invoices": {
    "title": "Invoices",
    "create_invoice": "Create Invoice",
    "invoice_number": "Invoice #",
    "status": "Status",
    "total": "Total",
    "paid": "Paid",
    "balance": "Balance Due",
    "deposit": "Deposit",
    "final_payment": "Final Payment"
  }
}
```

```json
// resources/js/i18n/locales/ar.json
{
  "common": {
    "save": "حفظ",
    "cancel": "إلغاء",
    "delete": "حذف",
    "confirm": "تأكيد",
    "back": "رجوع",
    "next": "التالي"
  },
  "auth": {
    "login": "تسجيل الدخول",
    "logout": "تسجيل الخروج",
    "email": "البريد الإلكتروني",
    "password": "كلمة المرور",
    "remember_me": "تذكرني",
    "forgot_password": "نسيت كلمة المرور؟"
  },
  "customers": {
    "title": "العملاء",
    "add_customer": "إضافة عميل",
    "first_name": "الاسم الأول",
    "last_name": "الاسم الأخير",
    "phone": "رقم الهاتف",
    "email": "البريد الإلكتروني",
    "address": "العنوان",
    "date_of_birth": "تاريخ الميلاد",
    "notes": "ملاحظات"
  },
  "prescriptions": {
    "title": "الوصفات الطبية",
    "spectacle_rx": "وصفة النظارات",
    "contact_lens_rx": "وصفة العدسات اللاصقة",
    "right_eye": "العين اليمنى (OD)",
    "left_eye": "العين اليسرى (OS)",
    "sphere": "الكرة (SPH)",
    "cylinder": "الأسطوانة (CYL)",
    "axis": "المحور",
    "add": "الإضافة (ADD)",
    "pd": "المسافة الحدقية (PD)",
    "expires_at": "تاريخ الانتهاء"
  },
  "invoices": {
    "title": "الفواتير",
    "create_invoice": "إنشاء فاتورة",
    "invoice_number": "رقم الفاتورة",
    "status": "الحالة",
    "total": "الإجمالي",
    "paid": "المدفوع",
    "balance": "المتبقي",
    "deposit": "العربون",
    "final_payment": "الدفعة النهائية"
  }
}
```

### 9.6 RTL (Right-to-Left) Support

> [!IMPORTANT]
> Arabic language requires complete RTL layout support. All components must adapt to text direction automatically.

```tsx
// resources/js/Hooks/useDirection.ts
import { useTranslation } from "react-i18next";

export function useDirection() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return {
    isRTL,
    direction: isRTL ? "rtl" : "ltr",
    align: isRTL ? "right" : "left",
  };
}
```

```tsx
// resources/js/Layouts/AuthenticatedLayout.tsx
import { useDirection } from "@/Hooks/useDirection";

export default function AuthenticatedLayout({ children }) {
  const { direction } = useDirection();

  return (
    <div dir={direction} className="min-h-screen">
      {/* Layout content */}
    </div>
  );
}
```

### 9.7 RTL-Aware CSS Utilities

```css
/* resources/css/rtl.css */

/* Use logical properties for RTL-aware spacing */
.card-content {
  padding-inline-start: 1rem; /* padding-left in LTR, padding-right in RTL */
  padding-inline-end: 1rem; /* padding-right in LTR, padding-left in RTL */
  margin-inline-start: 0.5rem;
  margin-inline-end: 0.5rem;
}

/* Directional icons should flip in RTL */
[dir="rtl"] .icon-arrow-right {
  transform: scaleX(-1);
}

/* Text alignment for mixed content */
.text-start {
  text-align: start; /* left in LTR, right in RTL */
}

.text-end {
  text-align: end; /* right in LTR, left in RTL */
}
```

### 9.8 Language Switcher Component

```tsx
// resources/js/Components/LanguageSwitcher.tsx
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("language", code);
    document.documentElement.lang = code;
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
  };

  return (
    <select
      value={i18n.language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="bg-bg-base text-text-primary border border-[var(--border-default)] rounded-md px-3 py-2"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.label}
        </option>
      ))}
    </select>
  );
}
```

### 9.9 Translation Usage Rules

```tsx
// ✅ CORRECT - Using translation keys
import { useTranslation } from "react-i18next";

function CustomerForm() {
  const { t } = useTranslation();

  return (
    <form>
      <label>{t("customers.first_name")}</label>
      <button type="submit">{t("common.save")}</button>
    </form>
  );
}

// ❌ WRONG - Hardcoded strings
function CustomerForm() {
  return (
    <form>
      <label>First Name</label>
      <button type="submit">Save</button>
    </form>
  );
}
```

### 9.10 Business-Level Language Settings

```php
// Database: businesses table
Schema::table('businesses', function (Blueprint $table) {
    $table->string('default_language', 5)->default('en');
    $table->json('enabled_languages')->default('["en"]');
});

// Model
class Business extends Model
{
    protected $casts = [
        'enabled_languages' => 'array',
    ];

    public function getAvailableLanguages(): array
    {
        return array_intersect(
            $this->enabled_languages,
            ['en', 'ar', 'fr', 'es']
        );
    }
}
```

---

## 10. Security Requirements

### 10.1 Authentication

- Laravel Sanctum for API authentication
- Session-based auth for web (Inertia)
- Password requirements: min 8 chars, mixed case, number

### 10.2 Authorization

```php
// Use Policies for all model operations
class CustomerPolicy
{
    public function view(User $user, Customer $customer): bool
    {
        return $user->business_id === $customer->business_id;
    }

    public function update(User $user, Customer $customer): bool
    {
        return $user->business_id === $customer->business_id
            && in_array($user->role, [UserRole::BUSINESS_OWNER, UserRole::SALES_STAFF]);
    }
}
```

### 10.3 Data Protection

> [!CAUTION] > **NEVER** expose cost prices to non-admin roles. Always filter in the backend.

```php
// API Resource with conditional fields
class FrameResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'brand' => $this->brand,
            'selling_price' => $this->selling_price,

            // Only include cost for authorized users
            'cost_price' => $this->when(
                $request->user()->canViewCostPrices(),
                $this->cost_price
            ),
        ];
    }
}
```

### 10.4 Input Sanitization

- All user inputs validated through Form Requests
- XSS protection via Blade/React escaping
- CSRF tokens on all forms
- SQL injection prevented via Eloquent/Query Builder

---

## 11. Performance Standards

### 11.1 Search Optimization

> [!IMPORTANT]
> Customer and Frame searches MUST return results in < 200ms.

```php
// Indexed columns for fast search
Schema::table('customers', function (Blueprint $table) {
    $table->index(['business_id', 'phone']);
    $table->index(['business_id', 'last_name', 'first_name']);
});

Schema::table('frames', function (Blueprint $table) {
    $table->index(['business_id', 'sku']);
    $table->index(['business_id', 'barcode']);
});
```

### 11.2 Query Optimization

```php
// Always eager load relationships
$invoices = Invoice::with(['customer', 'items', 'payments'])
    ->where('business_id', $businessId)
    ->paginate(20);

// Avoid N+1 queries
```

### 11.3 Caching Strategy

- Cache business settings (1 hour TTL)
- Cache lens catalog (1 hour TTL)
- Invalidate on update

---

## 12. UI/UX Guidelines

### 12.1 Responsive Design Requirements

| Viewport            | Priority     | Use Case               |
| ------------------- | ------------ | ---------------------- |
| Desktop (1200px+)   | High         | Back office, reporting |
| Tablet (768-1199px) | **Critical** | Floor sales, POS       |
| Mobile (< 768px)    | Medium       | Quick lookups          |

### 12.2 POS Screen Requirements

- Large touch targets (min 44x44px)
- High contrast for visibility
- Barcode scanner input support
- Keyboard shortcuts for power users

### 12.3 Tailwind Design Tokens

```css
/* tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
        // White-label: Allow override via CSS variables
      },
    },
  },
};
```

### 12.4 White-Label Requirements

Settings must allow customization of:

- [ ] Login page logo
- [ ] Dashboard logo
- [ ] Primary brand color
- [ ] Footer text/branding
- [ ] Favicon

---

## 13. Testing Standards

### 13.1 Required Test Coverage

| Area                    | Minimum Coverage | Type    |
| ----------------------- | ---------------- | ------- |
| Business isolation      | 100%             | Feature |
| Role permissions        | 100%             | Feature |
| Invoice workflow        | 100%             | Feature |
| Prescription validation | 100%             | Unit    |
| Payment calculations    | 100%             | Unit    |

### 13.2 Test Examples

```php
// Feature test: Business isolation
public function test_user_cannot_access_other_business_customers()
{
    $businessA = Business::factory()->create();
    $businessB = Business::factory()->create();

    $userA = User::factory()->for($businessA)->create();
    $customerB = Customer::factory()->for($businessB)->create();

    $this->actingAs($userA)
        ->get(route('customers.show', $customerB))
        ->assertForbidden();
}

// Feature test: Role restriction
public function test_sales_staff_cannot_edit_prescription()
{
    $salesStaff = User::factory()->salesStaff()->create();
    $prescription = Prescription::factory()->create([
        'business_id' => $salesStaff->business_id,
    ]);

    $this->actingAs($salesStaff)
        ->put(route('prescriptions.update', $prescription), [...])
        ->assertForbidden();
}
```

---

## 14. Documentation Requirements

### 14.1 Code Documentation

- PHPDoc blocks for all public methods
- TypeScript JSDoc for complex functions
- Inline comments for business logic

### 14.2 User Documentation

- Installation guide
- User manual per role
- API documentation (if applicable)
- Video tutorials (recommended)

### 14.3 CodeCanyon Package Contents

```
/documentation
  ├── installation.html
  ├── user-guide.html
  ├── changelog.html
  └── support.html
/assets (screenshots)
```

---

## 15. Scope Boundaries

### ❌ Out of Scope (NOT Building)

| Feature                     | Reason                                  |
| --------------------------- | --------------------------------------- |
| Insurance API Integration   | Too complex, varies by region           |
| Complex Scheduling          | Walk-in focus, simple date logging only |
| Lens Manufacturing/Grinding | We track orders, not machines           |
| Multi-Currency Support      | Single currency per business            |
| Offline Mode                | Too complex for V1                      |

### ✅ In Scope (Building)

- Multi-business, multi-branch support
- Spectacle & Contact Lens prescriptions
- Split-payment invoice workflow
- Job card system for labs
- White-label branding
- Role-based access control
- Essential reporting
- Barcode/label printing
- Browser-based print (PDF)

---

## 📝 Version History

| Version | Date       | Changes         |
| ------- | ---------- | --------------- |
| 1.0.0   | 2024-XX-XX | Initial release |

---

> **Document maintained by:** Development Team  
> **Last updated:** December 2024
