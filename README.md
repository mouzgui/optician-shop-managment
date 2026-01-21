<p align="center">
  <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="200" alt="Laravel Logo">
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="80" alt="React Logo">
</p>

<h1 align="center">� Optical Shop Management System</h1>

<p align="center">
  <strong>A complete multi-shop management solution for optical retail businesses</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12.0-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 12">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Inertia.js-2.x-9553E9?style=for-the-badge" alt="Inertia.js">
</p>

---

## 📋 Overview

**Optical Shop Management System** is a full-featured, production-ready web application designed specifically for optical retail businesses. It supports **multi-shop management** where a single installation can manage multiple independent businesses, each with their own branches, staff, customers, and inventory.

### 🎯 The Problem It Solves

- **Standard POS systems** cannot handle optical prescriptions and lab workflows
- **Medical EHR systems** are too complex, expensive, and overkill for retail operations
- **Result:** Most shops rely on paper-based systems or Excel, leading to errors and inefficiencies

### ✨ Key Highlights

| Feature | Description |
|---------|-------------|
| 🏢 **Multi-Shop Architecture** | Single installation manages multiple businesses with complete data isolation |
| 🏪 **Multi-Branch Support** | Each business can have multiple branches (stores/locations) |
| 👓 **Optical-Specific Workflows** | Handles the unique "Deposit → Lab Work → Pickup" sales cycle |
| 📋 **Prescription Management** | Complete spectacle and contact lens prescription tracking with expiry alerts |
| 🎨 **White-Label Ready** | Custom branding (logo, colors, footer) per business |

---

## 🚀 Features

### 👥 Customer Management
- Complete customer profiles with contact information
- **Family linking system** (group family members under one head)
- Visit history tracking with `last_visit_at` timestamps
- Prescription expiry alerts (`rx_expiry_flagged`)
- Phone-based quick search

### 📋 Clinical Module
- **Spectacle Prescriptions**
  - Full Rx: Sphere, Cylinder, Axis, ADD, Prism (OD/OS)
  - Pupillary Distance (PD): Far, Near, Single/Dual type
  - Expiry tracking with `isExpired()`, `isExpiringSoon()` helpers
- **Contact Lens Prescriptions**
  - Brand, Base Curve, Diameter
  - Replacement schedules (daily, weekly, bi-weekly, monthly, quarterly, yearly)
- Prescription history per customer

### 📦 Inventory Management
- **Frames Inventory**
  - SKU & Barcode support
  - Size tracking (eye, bridge, temple in mm)
  - Categories: optical, sunglasses, sports, kids
  - Materials: metal, plastic, titanium, acetate, mixed
  - Gender targeting: male, female, unisex, kids
  - **Low stock alerts** with customizable threshold
  - Cost price hidden from non-admin roles
- **Lenses Catalog**
  - Types: single_vision, bifocal, progressive, office, sports
  - Index options: 1.50, 1.56, 1.60, 1.67, 1.74
  - Coatings: HMC, Blue Cut, Photochromic
- **Contact Lens Stock**
  - Consumable tracking with expiry dates
  - Multiple parameters: power, cylinder, axis, base curve, diameter

### 💳 Point of Sale (POS)
- Full-screen, touch-optimized interface
- Product search by barcode, SKU, or name
- Cart management with discount calculations
- **Split payments** (deposit first, balance on pickup)
- Multiple payment methods: cash, card, bank_transfer, insurance
- Auto-generated invoice numbers: `INV-YYYYMMDD-XXXX`

### 📄 Invoice Workflow
Invoices follow a specific optical retail workflow:

```
DEPOSIT_PAID → IN_LAB → READY_PICKUP → COMPLETED
                              ↓
                         CANCELLED
```

| Status | Description |
|--------|-------------|
| `deposit_paid` | Initial deposit received, order placed |
| `in_lab` | Glasses being manufactured/assembled |
| `ready_pickup` | Ready for customer collection |
| `completed` | Customer picked up, fully paid |
| `cancelled` | Order cancelled |

### 🔧 Lab Management (Job Cards)
- Auto-generated from invoices containing frames/lenses
- Job number format: `JOB-YYYYMMDD-XXXX`
- Prescription details snapshot (preserved even if Rx is updated)
- Frame and lens details captured at time of order

**Job Card Statuses:**
```
PENDING → IN_PROGRESS → QUALITY_CHECK → COMPLETED
```

### 📊 Reports Module
Located in `/resources/js/Pages/Reports/`:
- Daily Revenue
- Monthly Revenue
- Outstanding Balances
- Staff Performance
- Inventory Reports
- Prescription Expiry Reports

### 👔 Role-Based Access Control

| Role | Scope | Key Permissions |
|------|-------|-----------------|
| **Super Admin** | System-wide | Manage all businesses, system settings |
| **Business Owner** | Own Business + All Branches | Full access, staff management, cost prices |
| **Optometrist** | Clinical | Customers, prescriptions, clinical history |
| **Sales Staff** | Assigned Branch | Sales, customers, pickups, inventory lookup |
| **Lab Technician** | Lab Only | Job cards view/update (no pricing visible) |

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Backend** | Laravel | 12.x |
| **Frontend** | React + TypeScript | 19.x / 5.x |
| **Bridge** | Inertia.js | 2.x |
| **Styling** | Tailwind CSS | 4.0 |
| **Icons** | Heroicons + Lucide React | Latest |
| **Charts** | Recharts | 3.x |
| **i18n** | react-i18next | 16.x |
| **PDF** | DomPDF | 3.x |
| **Build Tool** | Vite | 7.x |
| **Database** | MySQL / PostgreSQL | 8.0+ / 13+ |

---

## 🌍 Multi-Language Support

Built-in internationalization with complete translations:

| Language | Locale | RTL |
|----------|--------|-----|
| 🇺🇸 English | `en` | No |
| 🇸🇦 Arabic | `ar` | **Yes** |
| 🇫🇷 French | `fr` | No |
| 🇪🇸 Spanish | `es` | No |

Translation files located in `/resources/js/i18n/locales/`.

---

## 📁 Project Structure

```
optical-shop-management/
├── app/
│   ├── Enums/                  # Type-safe enumerations
│   │   ├── UserRole.php        # 5 user roles
│   │   ├── InvoiceStatus.php   # 5 invoice statuses
│   │   ├── JobCardStatus.php   # 4 job card statuses
│   │   ├── PaymentMethod.php   # cash, card, bank_transfer, insurance
│   │   └── ...                 # Frame, Lens, Gender enums
│   ├── Http/Controllers/
│   │   ├── Admin/              # Super Admin (businesses, system)
│   │   ├── Business/           # Owner (dashboard, staff, settings)
│   │   ├── Clinical/           # Optometrist (prescriptions)
│   │   ├── Sales/              # Staff (POS, invoices, customers)
│   │   ├── Lab/                # Technician (job cards)
│   │   └── Reports/            # Analytics and reporting
│   ├── Models/
│   │   ├── Business.php        # Multi-shop parent entity
│   │   ├── Branch.php          # Locations per business
│   │   ├── Customer.php        # With family linking
│   │   ├── SpectaclePrescription.php
│   │   ├── ContactLensPrescription.php
│   │   ├── Frame.php           # Stock items
│   │   ├── Lens.php            # Catalog items
│   │   ├── Invoice.php         # With status workflow
│   │   ├── JobCard.php         # Lab work tracking
│   │   └── Traits/
│   │       └── BelongsToBusiness.php  # Auto-scoping by business_id
│   └── Policies/               # Authorization policies
├── resources/js/
│   ├── Pages/
│   │   ├── Admin/              # Super admin pages
│   │   ├── Business/           # Business management
│   │   ├── Clinical/           # Prescriptions
│   │   ├── Sales/
│   │   │   ├── Customers/      # Customer CRUD
│   │   │   ├── Inventory/      # Frames, Lenses, Contacts
│   │   │   ├── Invoices/       # Invoice management
│   │   │   └── POS/            # Point of sale interface
│   │   ├── Lab/                # Job card management
│   │   └── Reports/            # Analytics pages
│   ├── Components/             # Reusable React components
│   ├── Layouts/                # Page layouts
│   ├── Hooks/                  # Custom React hooks
│   └── i18n/locales/           # EN, AR, FR, ES translations
└── database/
    ├── migrations/             # 17 migration files
    └── seeders/                # Demo data
```

---

## 🗄️ Database Architecture

### Multi-Shop Data Isolation

Every model uses the `BelongsToBusiness` trait which:
1. **Auto-scopes queries** - All queries automatically filter by `business_id`
2. **Auto-fills on create** - New records get `business_id` from logged-in user

```php
// Trait automatically adds this scope:
static::addGlobalScope('business', function (Builder $builder) {
    if (auth()->check() && auth()->user()->business_id) {
        $builder->where('business_id', auth()->user()->business_id);
    }
});
```

### Entity Relationships

```
businesses ◄────────── branches
    │                      │
    ├──────────────────────┼──── users (with role enum)
    │                      │
    ├──────────────────────┼──── customers ◄── family_head_id (self-ref)
    │                      │        │
    │                      │        ├──── spectacle_prescriptions
    │                      │        └──── contact_lens_prescriptions
    │                      │
    ├──────────────────────┼──── frames (stock items)
    ├──────────────────────┴──── contact_lenses (consumables)
    ├────────────────────────── lenses (catalog)
    │
    └────────────────────────── invoices
                                    │
                                    ├──── invoice_items
                                    ├──── payments
                                    └──── job_cards (1:1)
```

---

## ⚡ Quick Start

### Prerequisites

- PHP 8.2+
- Composer 2+
- Node.js 18+
- MySQL 8.0+ or PostgreSQL 13+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/optical-shop-management.git
cd optical-shop-management

# Install dependencies
composer install
npm install

# Configure environment
cp .env.example .env
php artisan key:generate

# Update .env with your database credentials, then:
php artisan migrate --seed

# Build frontend
npm run build

# Start server
php artisan serve
```

### Development Mode

```bash
# Run all services concurrently (server, queue, logs, vite)
composer dev
```

---

## 🔒 Security Features

| Feature | Implementation |
|---------|----------------|
| **Authentication** | Laravel Sanctum (session + API tokens) |
| **Authorization** | Policy-based with role checks |
| **Data Isolation** | `BelongsToBusiness` trait auto-scopes all queries |
| **Sensitive Data** | Cost prices hidden via `canViewCostPrices()` |
| **Soft Deletes** | Customers, Invoices, Frames, Job Cards |
| **CSRF Protection** | Built-in Laravel tokens |

---

## 📸 Screenshots

*Coming soon - Screenshots of dashboard, POS interface, prescription forms, lab queue, and reports.*

---

## 🗺️ Roadmap

**Completed:**
- [x] Multi-shop architecture with data isolation
- [x] Multi-branch support per business
- [x] Customer management with family linking
- [x] Spectacle & contact lens prescriptions
- [x] Frame inventory with stock tracking
- [x] Lens catalog management
- [x] POS with split payments
- [x] Invoice workflow (5 statuses)
- [x] Lab job cards (4 statuses)
- [x] 5 user roles with permissions
- [x] 4-language support (EN, AR, FR, ES)
- [x] White-label branding per business

**Planned:**
- [ ] SMS/Email notifications for pickup ready
- [ ] Appointment scheduling
- [ ] Insurance claim integration
- [ ] Barcode scanner integration
- [ ] Receipt printer support
- [ ] Mobile app (React Native)
- [ ] Offline mode (PWA)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- Portfolio: https://oussama-mouzgui.vercel.app/
- GitHub: https://github.com/mouzgui;
- LinkedIn: https://www.linkedin.com/in/mouzgui-oussama-9b046123a/

---

<p align="center">
  <strong>⭐ If you find this project useful, please consider giving it a star!</strong>
</p>

---

<p align="center">
  <sub>Built with ❤️ using Laravel, React, and TypeScript</sub>
</p>
