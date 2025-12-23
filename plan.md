# 🏥 Optical Shop Management System — Master Plan

> **Document Version:** 1.0  
> **Last Updated:** December 2024  
> **Product Type:** CodeCanyon-Ready Commercial SaaS

---

## 📋 Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [Technical Architecture](#3-technical-architecture)
4. [Development Phases](#4-development-phases)
5. [Database Schema](#5-database-schema)
6. [Module Breakdown](#6-module-breakdown)
7. [UI/UX Design Plan](#7-uiux-design-plan)
8. [Security & Compliance](#8-security--compliance)
9. [Testing Strategy](#9-testing-strategy)
10. [Deployment & Launch](#10-deployment--launch)
11. [Post-Launch Roadmap](#11-post-launch-roadmap)

---

## 1. Executive Summary

### 1.1 The Problem
Optical retail shops face a unique challenge:
- **Standard POS systems** cannot handle optical prescriptions and lab workflows
- **Medical EHR systems** are too complex, expensive, and overkill for retail operations
- **Result:** Most shops use paper-based systems or Excel, leading to errors and inefficiencies

### 1.2 The Solution
A specialized **Retail Optical POS & Management System** that:
- Handles the unique "Deposit → Lab Work → Pickup" sales cycle
- Manages spectacle and contact lens prescriptions
- Supports multi-business, multi-branch operations from a single installation
- Provides complete white-label branding for agencies

### 1.3 Target Market
| Segment | Description | Revenue Model |
|---------|-------------|---------------|
| **CodeCanyon Buyers** | Developers/agencies seeking white-label solutions | One-time license |
| **Independent Optical Shops** | Single-location retailers | Extended license |
| **Optical Chains** | Multi-branch operations | Extended license + support |

### 1.4 Success Metrics
- [ ] CodeCanyon approval within 2 weeks of submission
- [ ] 4.5+ star rating from first 20 reviews
- [ ] Complete feature set matching project-rules.md specifications
- [ ] Full documentation and video tutorials

---

## 2. Product Overview

### 2.1 Core Features

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         OPTICAL SHOP MANAGER                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  👥 CUSTOMER          📋 CLINICAL           📦 INVENTORY               │
│  MANAGEMENT           MODULE                 MANAGEMENT                 │
│  ├─ Profiles          ├─ Spectacle Rx       ├─ Frames (Stock)          │
│  ├─ Family Links      ├─ Contact Lens Rx    ├─ Lenses (Catalog)        │
│  ├─ History           ├─ Rx History         ├─ Contact Lenses          │
│  └─ Recall Lists      └─ Expiry Alerts      └─ Low Stock Alerts        │
│                                                                         │
│  💳 POINT OF          🔧 LAB                📊 REPORTING               │
│  SALE (POS)           MANAGEMENT            & ANALYTICS                 │
│  ├─ Quick Sale        ├─ Job Cards          ├─ Daily Revenue           │
│  ├─ Split Payments    ├─ Status Tracking    ├─ Monthly Summary         │
│  ├─ Deposits          ├─ Work Queue         ├─ Inventory Reports       │
│  └─ Receipt/Invoice   └─ Completion         └─ Staff Performance       │
│                                                                         │
│  ⚙️ ADMINISTRATION    🏢 MULTI-TENANT       🎨 WHITE-LABEL             │
│  ├─ User Roles        ├─ Businesses         ├─ Custom Branding         │
│  ├─ Permissions       ├─ Branches           ├─ Login Logo              │
│  ├─ Settings          └─ Data Isolation     └─ Theme Colors            │
│  └─ Audit Logs                                                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 User Roles

| Role | Access Level | Primary Functions |
|------|--------------|-------------------|
| **Super Admin** | System-wide | Create businesses, manage subscriptions |
| **Business Owner** | Business + Branches | Full access to all features |
| **Optometrist** | Clinical | Customers, prescriptions, clinical history |
| **Sales Staff** | Branch | Sales, customers, pickups, inventory lookups |
| **Lab Technician** | Lab | Job cards (view/update status only) |

### 2.3 The Optical Sales Workflow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ CUSTOMER │───▶│ EYE EXAM │───▶│  FRAME   │───▶│  DEPOSIT │───▶│  LAB     │
│ ARRIVES  │    │ (Rx)     │    │ SELECTION│    │  PAYMENT │    │  WORK    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └────┬─────┘
                                                                      │
┌──────────┐    ┌──────────┐    ┌──────────┐                         │
│ COMPLETE │◀───│  FINAL   │◀───│  PICKUP  │◀────────────────────────┘
│          │    │ PAYMENT  │    │  READY   │
└──────────┘    └──────────┘    └──────────┘
```

---

## 3. Technical Architecture

### 3.1 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Backend** | Laravel 11 | Robust, well-documented, large community |
| **Frontend** | React 18 + TypeScript | Type safety, component reusability |
| **Bridge** | Inertia.js | SPA feel without API complexity |
| **Styling** | Tailwind CSS 3 | Rapid development, design tokens |
| **Database** | MySQL 8.0 / PostgreSQL | Reliable, widely supported |
| **Auth** | Laravel Sanctum | Session + API token support |
| **PDF** | DomPDF / Snappy | Invoice and receipt generation |
| **Printing** | Browser Print API | Thermal receipt support |

### 3.2 Application Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                            │
│                                                                         │
│   React Components ──▶ Inertia Pages ──▶ Layouts ──▶ Design Tokens     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION LAYER                             │
│                                                                         │
│   Controllers ──▶ Form Requests ──▶ Services ──▶ Policies              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                             DOMAIN LAYER                                │
│                                                                         │
│   Models ──▶ Traits (BelongsToBusiness) ──▶ Enums ──▶ Events           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         INFRASTRUCTURE LAYER                            │
│                                                                         │
│   Database ──▶ Cache (Redis) ──▶ Queue (Jobs) ──▶ File Storage         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Multi-Tenant Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SINGLE DATABASE INSTANCE                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────┐    ┌─────────────┐    ┌──────────────────────────┐   │
│   │ Business A  │    │ Business B  │    │      Business C          │   │
│   │ (1 Location)│    │ (1 Location)│    │   (Chain: 3 Branches)    │   │
│   │             │    │             │    │                          │   │
│   │ └─ Users    │    │ └─ Users    │    │ ├─ Branch 1 (HQ)         │   │
│   │ └─ Customers│    │ └─ Customers│    │ │  └─ Users              │   │
│   │ └─ Invoices │    │ └─ Invoices │    │ ├─ Branch 2              │   │
│   │ └─ Inventory│    │ └─ Inventory│    │ │  └─ Users              │   │
│   │             │    │             │    │ └─ Branch 3              │   │
│   └─────────────┘    └─────────────┘    │    └─ Users              │   │
│                                         └──────────────────────────┘   │
│                                                                         │
│   ⚠️ Every query is scoped by business_id - NO cross-business access   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.4 Folder Structure

```
opticina-shop-managment/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/              # Super Admin (businesses, system)
│   │   │   ├── Business/           # Owner (dashboard, staff, settings)
│   │   │   ├── Clinical/           # Optometrist (Rx, clinical)
│   │   │   ├── Sales/              # Staff (POS, invoices, customers)
│   │   │   └── Lab/                # Technician (job cards)
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/
│   │   └── Traits/
│   ├── Services/
│   ├── Policies/
│   └── Enums/
├── resources/
│   ├── js/
│   │   ├── Components/
│   │   │   ├── UI/                 # Button, Input, Modal, DataTable
│   │   │   ├── Forms/              # CustomerForm, RxForm, InvoiceForm
│   │   │   ├── Clinical/           # RxDisplay, RxComparison
│   │   │   └── POS/                # ProductSearch, Cart, Payment
│   │   ├── Layouts/
│   │   ├── Pages/
│   │   ├── Hooks/
│   │   ├── Types/
│   │   ├── i18n/                   # Translations (en, ar, fr, es)
│   │   └── Utils/
│   └── css/
│       ├── tokens.css              # Design tokens
│       └── rtl.css                 # RTL support
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
├── tests/
└── docs/
    ├── installation.md
    ├── user-guide.md
    └── api-reference.md
```

---

## 4. Development Phases

### Phase 0: Foundation (Week 1)
- [x] Project rules documentation
- [ ] Laravel + Inertia + React setup
- [ ] Design token system implementation
- [ ] i18n infrastructure (EN, AR, FR, ES)
- [ ] Base layout and authentication

### Phase 1: Core Infrastructure (Week 2-3)
- [ ] Multi-tenant architecture
- [ ] User roles and permissions
- [ ] Business and Branch management
- [ ] Base CRUD operations

### Phase 2: Customer & Clinical (Week 4-5)
- [ ] Customer management (CRUD, search, family links)
- [ ] Spectacle prescription management
- [ ] Contact lens prescription management
- [ ] Prescription history and expiry tracking

### Phase 3: Inventory (Week 6)
- [ ] Frame inventory (stock items)
- [ ] Lens catalog (service items)
- [ ] Contact lens stock (consumables)
- [ ] Low stock alerts

### Phase 4: POS & Invoicing (Week 7-8)
- [ ] Point of Sale interface
- [ ] Invoice creation with split payments
- [ ] Deposit workflow
- [ ] Payment processing (cash, card, insurance)
- [ ] Receipt and invoice printing

### Phase 5: Lab Management (Week 9)
- [ ] Job card generation from invoices
- [ ] Lab work queue dashboard
- [ ] Status updates workflow
- [ ] Pickup notifications

### Phase 6: Reporting (Week 10)
- [ ] Daily revenue report
- [ ] Monthly summary with trends
- [ ] Outstanding balances (aged receivables)
- [ ] Inventory reports
- [ ] Staff performance

### Phase 7: White-Label & Polish (Week 11)
- [ ] White-label settings (logo, colors, branding)
- [ ] Super Admin dashboard
- [ ] System settings
- [ ] Performance optimization

### Phase 8: Testing & Documentation (Week 12)
- [ ] Feature tests (100% critical paths)
- [ ] Unit tests (validation, calculations)
- [ ] User documentation
- [ ] Installation guide
- [ ] Video tutorials

### Phase 9: CodeCanyon Submission (Week 13)
- [ ] Final QA pass
- [ ] Screenshot preparation
- [ ] Description and marketing copy
- [ ] Support documentation
- [ ] Submission and review

---

## 5. Database Schema

### 5.1 Core Tables Overview

```
┌───────────────────────────────────────────────────────────────────────────┐
│                            DATABASE SCHEMA                                │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  businesses ◄────────── branches                                          │
│      │                      │                                             │
│      ├──────────────────────┼──── users                                   │
│      │                      │                                             │
│      ├──────────────────────┼──── customers ◄── family_links (self)       │
│      │                      │        │                                    │
│      │                      │        ├──── spectacle_prescriptions        │
│      │                      │        └──── contact_lens_prescriptions     │
│      │                      │                                             │
│      ├──────────────────────┼──── frames                                  │
│      ├──────────────────────┴──── contact_lens_stock                      │
│      ├────────────────────────── lens_catalog                             │
│      │                                                                    │
│      └────────────────────────── invoices                                 │
│                                     │                                     │
│                                     ├──── invoice_items                   │
│                                     ├──── payments                        │
│                                     └──── job_cards                       │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Table Definitions

#### businesses
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | varchar(255) | Business name |
| owner_id | bigint FK | Reference to owner user |
| logo_url | varchar(255) | White-label logo |
| primary_color | varchar(7) | Hex color for branding |
| default_language | varchar(5) | Default: 'en' |
| enabled_languages | json | ['en', 'ar'] |
| currency_code | varchar(3) | e.g., 'USD', 'EUR' |
| tax_rate | decimal(5,2) | Default tax percentage |
| settings | json | Additional settings |
| is_active | boolean | Soft disable |
| created_at / updated_at | timestamps | |

#### branches
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| business_id | bigint FK | Parent business |
| name | varchar(255) | Branch name |
| address | text | Physical address |
| phone | varchar(50) | Contact number |
| is_headquarters | boolean | Main branch flag |
| is_active | boolean | Soft disable |
| created_at / updated_at | timestamps | |

#### users
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| business_id | bigint FK | Assigned business |
| branch_id | bigint FK (nullable) | Assigned branch |
| name | varchar(255) | Full name |
| email | varchar(255) | Unique email |
| password | varchar(255) | Hashed password |
| role | enum | super_admin, business_owner, optometrist, sales_staff, lab_technician |
| is_active | boolean | Can login |
| last_login_at | timestamp | Tracking |
| created_at / updated_at | timestamps | |

#### customers
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| business_id | bigint FK | Owner business |
| branch_id | bigint FK (nullable) | Originating branch |
| first_name | varchar(100) | |
| last_name | varchar(100) | |
| phone | varchar(50) | Primary search field |
| email | varchar(255) | Optional |
| address | text | Optional |
| date_of_birth | date | Optional |
| notes | text | Private notes |
| family_head_id | bigint FK (nullable) | Self-reference |
| rx_expiry_flagged | boolean | For recall marketing |
| last_visit_at | timestamp | |
| created_by | bigint FK | Creating user |
| created_at / updated_at / deleted_at | timestamps | Soft delete |

#### spectacle_prescriptions
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| business_id | bigint FK | |
| customer_id | bigint FK | |
| prescribed_by | bigint FK | Optometrist user |
| prescribed_at | datetime | |
| od_sphere, od_cylinder, od_axis, od_add, od_prism | decimal/int | Right eye |
| os_sphere, os_cylinder, os_axis, os_add, os_prism | decimal/int | Left eye |
| pd_far, pd_near | decimal | Pupillary distance |
| pd_type | enum | 'single', 'dual' |
| notes | text | |
| expires_at | datetime | Default: +2 years |
| created_at / updated_at | timestamps | |

#### contact_lens_prescriptions
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| business_id | bigint FK | |
| customer_id | bigint FK | |
| prescribed_by | bigint FK | |
| prescribed_at | datetime | |
| od_sphere, od_cylinder, od_axis, od_base_curve, od_diameter, od_brand | various | Right eye + lens specs |
| os_sphere, os_cylinder, os_axis, os_base_curve, os_diameter, os_brand | various | Left eye + lens specs |
| replacement_schedule | enum | daily, weekly, bi-weekly, monthly, quarterly, yearly |
| notes | text | |
| expires_at | datetime | |
| created_at / updated_at | timestamps | |

#### frames
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| business_id | bigint FK | |
| branch_id | bigint FK (nullable) | |
| sku | varchar(50) | Unique per business |
| barcode | varchar(100) | For scanner |
| brand, model, color_code, color_name | varchar | Product info |
| size_eye, size_bridge, size_temple | int | Measurements (mm) |
| category | enum | optical, sunglasses, sports, kids |
| material | enum | metal, plastic, titanium, acetate, mixed |
| gender | enum | male, female, unisex, kids |
| cost_price | decimal(10,2) | Hidden from non-admin |
| selling_price | decimal(10,2) | |
| quantity | int | Stock count |
| low_stock_threshold | int | Alert trigger |
| image_url | varchar(255) | |
| is_active | boolean | |
| created_at / updated_at | timestamps | |

#### lens_catalog (Service items - not stock tracked)
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| business_id | bigint FK | |
| name | varchar(255) | e.g., "Single Vision 1.56 HMC" |
| type | enum | single_vision, bifocal, progressive, office, sports |
| index | enum | 1.50, 1.56, 1.60, 1.67, 1.74 |
| coatings | json | ['HMC', 'Blue Cut', 'Photochromic'] |
| cost_price, selling_price | decimal(10,2) | |
| lab_supplier | varchar(255) | |
| lead_time_days | int | |
| is_active | boolean | |
| created_at / updated_at | timestamps | |

#### contact_lens_stock (Consumables)
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| business_id | bigint FK | |
| branch_id | bigint FK (nullable) | |
| brand, product_line | varchar | |
| power, cylinder, axis, base_curve, diameter | various | Lens parameters |
| box_quantity | int | Lenses per box |
| boxes_in_stock | int | Inventory count |
| cost_price_per_box, selling_price_per_box | decimal | |
| expiry_date | date | |
| created_at / updated_at | timestamps | |

#### invoices
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| business_id, branch_id | bigint FK | |
| customer_id | bigint FK | |
| invoice_number | varchar(50) | Auto: INV-YYYYMMDD-XXXX |
| status | enum | deposit_paid, in_lab, ready_pickup, completed, cancelled |
| subtotal, discount_amount, tax_amount, total | decimal | Amounts |
| discount_type | enum | fixed, percentage |
| amount_paid, balance_due | decimal | Payment tracking |
| prescription_id | bigint FK (nullable) | Linked Rx |
| notes, warranty_info | text | |
| estimated_pickup, actual_pickup | datetime | |
| created_by | bigint FK | |
| created_at / updated_at | timestamps | |

#### invoice_items
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| invoice_id | bigint FK | |
| item_type | enum | frame, lens, contact_lens, accessory, service |
| item_id | bigint (nullable) | Reference to inventory |
| description | varchar(255) | |
| quantity | int | |
| unit_price, discount, total | decimal | |
| created_at / updated_at | timestamps | |

#### payments
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| invoice_id | bigint FK | |
| amount | decimal(10,2) | |
| payment_method | enum | cash, card, bank_transfer, insurance |
| reference | varchar(255) | Transaction ID |
| insurance_claim_id | varchar(255) | If insurance |
| received_by | bigint FK | Staff user |
| received_at | datetime | |
| created_at / updated_at | timestamps | |

#### job_cards
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| invoice_id | bigint FK | One-to-one |
| business_id | bigint FK | |
| job_number | varchar(50) | Auto: JOB-YYYYMMDD-XXXX |
| status | enum | pending, in_progress, quality_check, completed |
| prescription_details | json | Snapshot of Rx |
| frame_details | json | Snapshot of frame |
| lens_details | json | Snapshot of lens selection |
| special_instructions | text | |
| started_at, completed_at | datetime | |
| completed_by | bigint FK (nullable) | Lab tech |
| created_at / updated_at | timestamps | |

---

## 6. Module Breakdown

### 6.1 Authentication Module
- Login / Logout
- Password reset
- Remember me
- Session management
- Role-based redirects

### 6.2 Super Admin Module
- Business CRUD
- System-wide settings
- Global reports
- Subscription management (future)

### 6.3 Business Management Module
- Business settings (branding, currency, tax)
- Branch CRUD
- Staff management
- Role assignment

### 6.4 Customer Management Module
- Customer CRUD
- Phone-based quick search
- Family linking system
- Visit history timeline
- Prescription summary view

### 6.5 Clinical Module
- Spectacle Rx form with validation
- Contact Lens Rx form
- Rx history with comparison
- Recall list (expired Rx)
- Print Rx card

### 6.6 Inventory Module
- Frame inventory (CRUD, barcode, stock tracking)
- Lens catalog (CRUD, pricing)
- Contact lens stock (CRUD, expiry tracking)
- Low stock dashboard
- Inventory reports

### 6.7 POS Module
- Product search (barcode, SKU, name)
- Cart management
- Apply prescription
- Discount calculation
- Deposit payment
- Full payment
- Receipt generation

### 6.8 Invoice Module
- Invoice list with filters
- Invoice detail view
- Status workflow
- Add payment
- Print invoice (A4)
- Print thermal receipt

### 6.9 Lab Module
- Job card queue (kanban or list)
- Status update workflow
- Job details view
- Complete job action
- Print job card (no prices)

### 6.10 Reports Module
- Daily revenue
- Monthly summary
- Outstanding balances
- Best-selling items
- Staff performance
- Rx expiry report
- Export to CSV

---

## 7. UI/UX Design Plan

### 7.1 Design Principles
1. **Efficiency first** - Minimize clicks for common tasks
2. **Mobile-friendly** - Critical for floor sales on tablets
3. **High contrast** - Readability in various lighting
4. **Consistent patterns** - Same interactions across modules
5. **White-label ready** - All branding via design tokens

### 7.2 Key Screens

| Screen | Priority | Description |
|--------|----------|-------------|
| Login | High | Clean, branded, language selector |
| Dashboard | High | Role-specific widgets and shortcuts |
| Customer Search | Critical | Phone-based instant search |
| POS Interface | Critical | Full-screen, touch-optimized |
| Prescription Form | High | Optical-specific input controls |
| Invoice List | High | Filterable, status badges |
| Job Card Queue | Medium | Visual status workflow |
| Reports Dashboard | Medium | Charts and summaries |
| Settings | Medium | Business configuration |

### 7.3 Design Token Usage

```css
/* All UI elements use semantic tokens */
.card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: var(--card-shadow);
}

.btn-primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
}

/* Theme switching: Light/Dark */
[data-theme="dark"] .card {
  /* Automatically uses dark mode tokens */
}
```

### 7.4 RTL Support (Arabic)
- Logical CSS properties (padding-inline-start)
- Flipped icons and layouts
- Arabic font support
- Full mirror layout

---

## 8. Security & Compliance

### 8.1 Authentication Security
- Bcrypt password hashing
- Rate limiting on login
- Session timeout configuration
- CSRF protection

### 8.2 Authorization
- Role-based access control
- Business-scoped data isolation
- Policy-based authorization
- Sensitive field protection

### 8.3 Data Protection
- Cost prices hidden from non-admins
- Soft deletes for audit trail
- Encrypted sensitive data
- SQL injection prevention

### 8.4 HIPAA Considerations
- Prescription data is health information
- Access logging recommended
- Data export for compliance
- Consent tracking (optional)

---

## 9. Testing Strategy

### 9.1 Test Coverage Goals

| Area | Coverage | Type |
|------|----------|------|
| Business isolation | 100% | Feature |
| Role permissions | 100% | Feature |
| Invoice workflow | 100% | Feature |
| Prescription validation | 100% | Unit |
| Payment calculations | 100% | Unit |

### 9.2 Test Types
1. **Unit Tests** - Isolated function testing
2. **Feature Tests** - HTTP request testing
3. **Browser Tests** - E2E with Laravel Dusk (optional)

### 9.3 Critical Test Scenarios
- [ ] User cannot access other business data
- [ ] Sales staff cannot edit prescriptions
- [ ] Lab tech cannot see prices
- [ ] Invoice status follows correct flow
- [ ] Stock decrements on sale completion
- [ ] Prescription validation ranges

---

## 10. Deployment & Launch

### 10.1 Server Requirements
- PHP 8.2+
- MySQL 8.0+ / PostgreSQL 13+
- Node.js 18+ (build only)
- Composer 2+
- 2GB RAM minimum
- SSL certificate

### 10.2 Installation Steps
1. Clone repository
2. Copy .env.example to .env
3. Configure database connection
4. Run `composer install`
5. Run `npm install && npm run build`
6. Run `php artisan migrate --seed`
7. Create first business via seeder or CLI
8. Access at configured domain

### 10.3 CodeCanyon Package
```
optical-shop-manager/
├── source-code/           # Full Laravel project
├── documentation/
│   ├── installation.html
│   ├── user-guide.html
│   ├── changelog.html
│   └── support.html
├── assets/                # Screenshots for listing
└── README.md
```

---

## 11. Post-Launch Roadmap

### Version 1.1 (Month 2)
- [ ] SMS notifications for pickup ready
- [ ] Email notifications
- [ ] Basic appointment scheduling

### Version 1.2 (Month 3)
- [ ] Insurance integration framework
- [ ] Bulk import/export
- [ ] Advanced analytics

### Version 1.3 (Month 4)
- [ ] Mobile app (React Native)
- [ ] Offline mode (PWA)
- [ ] API documentation

### Version 2.0 (Month 6)
- [ ] Multi-currency support
- [ ] Franchise management
- [ ] Third-party integrations

---

## 📝 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 2024 | Dev Team | Initial plan |

---

> **This document serves as the master reference for the Optical Shop Management System project. All development decisions should align with the specifications outlined herein.**
