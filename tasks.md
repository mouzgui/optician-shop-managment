# 🏥 Optical Shop Management System — Development Tasks

> **Document Version:** 2.0  
> **Last Updated:** December 2024  
> **Total Estimated Duration:** 13 weeks  
> **Reference:** See [plan.md](./plan.md) for architecture details

---

## 📋 How to Use This Document

This is your **daily development reference**. Each task includes:

-   ✅ **Checkbox** - Mark `[x]` when complete, `[/]` when in-progress
-   📁 **Files** - Exact files to create/modify
-   📝 **Description** - What to implement
-   ✓ **Done When** - Acceptance criteria to verify completion

**Workflow:**

1. Find the current phase/section you're working on
2. Mark task as `[/]` when starting
3. Follow the description and create/modify listed files
4. Verify using "Done When" criteria
5. Mark task as `[x]` when complete
6. Move to next task

---

## 📊 Progress Tracker

| Phase       | Description           | Status            | Progress |
| ----------- | --------------------- | ----------------- | -------- |
| **Phase 0** | Project Foundation    | `[x]` Completed   | 47/47    |
| **Phase 1** | Core Infrastructure   | `[x]` Completed   | 26/26    |
| **Phase 2** | Customer & Clinical   | `[ ]` Not Started | 0/45     |
| **Phase 3** | Inventory Module      | `[ ]` Not Started | 0/28     |
| **Phase 4** | POS & Invoicing       | `[ ]` Not Started | 0/52     |
| **Phase 5** | Lab Management        | `[ ]` Not Started | 0/22     |
| **Phase 6** | Reporting Module      | `[ ]` Not Started | 0/28     |
| **Phase 7** | White-Label & Polish  | `[ ]` Not Started | 0/24     |
| **Phase 8** | Testing & Docs        | `[ ]` Not Started | 0/32     |
| **Phase 9** | CodeCanyon Submission | `[ ]` Not Started | 0/18     |

---

## 🔵 Phase 0: Project Foundation (Week 1)

> **Goal:** Set up the development environment, design system, i18n, and base layouts.  
> **Reference:** [plan.md Section 3 - Technical Architecture](./plan.md#3-technical-architecture)

---

### 0.1 Laravel Project Initialization

#### TASK 0.1.1: Create Laravel Project

-   [x] **Status:** Completed

**📁 Files:**

-   `composer.json` (generated)
-   `.env` (configure)
-   `database/` (generated)

**📝 Description:**
Initialize a fresh Laravel 11 project in the project root directory. Configure the environment for local development with MySQL/PostgreSQL database connection.

**🔧 Commands:**

```bash
composer create-project laravel/laravel . --prefer-dist
cp .env.example .env
php artisan key:generate
```

**⚙️ Configuration (.env):**

```env
APP_NAME="Optical Shop Manager"
APP_ENV=local
APP_DEBUG=true
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=optical_shop
DB_USERNAME=root
DB_PASSWORD=
```

**✓ Done When:**

-   [x] `php artisan --version` shows Laravel 11.x
-   [x] `.env` file exists with database credentials
-   [x] `php artisan migrate` runs without errors (creates default tables)
-   [x] `php artisan serve` starts development server at localhost:8000

---

#### TASK 0.1.2: Install Inertia.js + React + TypeScript

-   [x] **Status:** Completed

**📁 Files to Create/Modify:**

-   `app/Http/Middleware/HandleInertiaRequests.php`
-   `app/Http/Kernel.php` (add middleware)
-   `resources/views/app.blade.php`
-   `resources/js/app.tsx`
-   `tsconfig.json`
-   `vite.config.js`

**📝 Description:**
Install and configure Inertia.js as the bridge between Laravel and React. Set up TypeScript for type safety.

**🔧 Commands:**

```bash
# Backend
composer require inertiajs/inertia-laravel
php artisan inertia:middleware

# Frontend
npm install @inertiajs/react react react-dom
npm install -D typescript @types/react @types/react-dom @vitejs/plugin-react
```

**📄 Key File Contents:**

`resources/views/app.blade.php`:

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
```

**✓ Done When:**

-   [x] `HandleInertiaRequests` middleware registered in `Kernel.php`
-   [x] `app.blade.php` contains `@inertia` directive
-   [x] `npm run dev` compiles without TypeScript errors
-   [x] Creating a test Inertia page renders React component

---

#### TASK 0.1.3: Install and Configure Tailwind CSS

-   [x] **Status:** Completed

**📁 Files to Create/Modify:**

-   `tailwind.config.js`
-   `postcss.config.js`
-   `resources/css/app.css`

**📝 Description:**
Install Tailwind CSS and configure it for the project. Set up content paths and prepare for design token integration.

**🔧 Commands:**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**📄 tailwind.config.js:**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.tsx",
        "./resources/**/*.ts",
    ],
    darkMode: ["class", '[data-theme="dark"]'],
    theme: {
        extend: {},
    },
    plugins: [],
};
```

**📄 resources/css/app.css:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**✓ Done When:**

-   [x] `tailwind.config.js` exists with correct content paths
-   [x] Adding `className="bg-blue-500"` to a component shows blue background
-   [x] Hot reload works when changing Tailwind classes

---

#### TASK 0.1.4: Create Project Folder Structure

-   [x] **Status:** Completed

**📁 Folders to Create:**

```
app/
├── Http/Controllers/
│   ├── Admin/           # Super Admin controllers
│   ├── Business/        # Business Owner controllers
│   ├── Clinical/        # Optometrist controllers
│   ├── Sales/           # Sales Staff controllers
│   └── Lab/             # Lab Technician controllers
├── Services/            # Business logic services
├── Policies/            # Authorization policies
├── Enums/               # PHP 8.1 Enums
└── Models/Traits/       # Shared model traits

resources/js/
├── Components/
│   ├── UI/              # Button, Input, Modal, etc.
│   ├── Forms/           # CustomerForm, RxForm, etc.
│   ├── Clinical/        # Rx-specific components
│   └── POS/             # Point of sale components
├── Layouts/             # GuestLayout, AuthenticatedLayout
├── Pages/
│   ├── Admin/
│   ├── Business/
│   ├── Clinical/
│   ├── Sales/
│   └── Lab/
├── Hooks/               # Custom React hooks
├── Types/               # TypeScript interfaces
├── Utils/               # Helper functions
├── Utils/               # Helper functions
└── i18n/                # Internationalization
    └── locales/         # Translation JSON files
```

**📝 Description:**
Create all necessary directories following the architecture defined in plan.md. This establishes the organized structure for the entire project.

**🔧 Commands (PowerShell):**

```powershell
# Backend folders
New-Item -ItemType Directory -Force -Path "app/Http/Controllers/Admin"
New-Item -ItemType Directory -Force -Path "app/Http/Controllers/Business"
New-Item -ItemType Directory -Force -Path "app/Http/Controllers/Clinical"
New-Item -ItemType Directory -Force -Path "app/Http/Controllers/Sales"
New-Item -ItemType Directory -Force -Path "app/Http/Controllers/Lab"
New-Item -ItemType Directory -Force -Path "app/Services"
New-Item -ItemType Directory -Force -Path "app/Policies"
New-Item -ItemType Directory -Force -Path "app/Enums"
New-Item -ItemType Directory -Force -Path "app/Models/Traits"

# Frontend folders
New-Item -ItemType Directory -Force -Path "resources/js/Components/UI"
New-Item -ItemType Directory -Force -Path "resources/js/Components/Forms"
New-Item -ItemType Directory -Force -Path "resources/js/Components/Clinical"
New-Item -ItemType Directory -Force -Path "resources/js/Components/POS"
New-Item -ItemType Directory -Force -Path "resources/js/Layouts"
New-Item -ItemType Directory -Force -Path "resources/js/Pages/Admin"
New-Item -ItemType Directory -Force -Path "resources/js/Pages/Business"
New-Item -ItemType Directory -Force -Path "resources/js/Pages/Clinical"
New-Item -ItemType Directory -Force -Path "resources/js/Pages/Sales"
New-Item -ItemType Directory -Force -Path "resources/js/Pages/Lab"
New-Item -ItemType Directory -Force -Path "resources/js/Hooks"
New-Item -ItemType Directory -Force -Path "resources/js/Types"
New-Item -ItemType Directory -Force -Path "resources/js/Utils"
New-Item -ItemType Directory -Force -Path "resources/js/i18n/locales"
```

**✓ Done When:**

-   [x] All directories listed above exist
-   [x] No errors when importing from these paths in IDE

---

### 0.2 Design Token System

> **Reference:** [plan.md Section 7.3 - Design Token Usage](./plan.md#73-design-token-usage) and [project-rules.md Section 8](./project-rules.md#8-design-system--tokens)

---

#### TASK 0.2.1: Create Primitive Color Tokens

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `resources/css/tokens.css`

**📝 Description:**
Define the raw color palette as CSS custom properties. These primitive tokens are the foundation - they hold actual hex values that semantic tokens will reference.

**📄 tokens.css (Primitive Section):**

```css
:root {
    /* ═══════════════════════════════════════════════════
     PRIMITIVE TOKENS - Raw Color Values
     These are the only place hex codes should appear
     ═══════════════════════════════════════════════════ */

    /* Primary Brand - Blue (White-label overridable) */
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

    /* Neutral (Gray Scale) */
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

    /* Status Colors */
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

**✓ Done When:**

-   [x] `resources/css/tokens.css` exists
-   [x] All primitive color tokens defined as shown
-   [x] File imported in `resources/css/app.css` via `@import './tokens.css';`
-   [x] Browser DevTools shows CSS variables on `:root`

---

#### TASK 0.2.2: Create Light Mode Semantic Tokens

-   [x] **Status:** Completed

**📁 Files to Modify:**

-   `resources/css/tokens.css` (add to existing)

**📝 Description:**
Define semantic tokens that describe PURPOSE rather than color. These reference primitive tokens and are what components actually use.

**📄 tokens.css (Light Mode Section - add after primitives):**

```css
/* ═══════════════════════════════════════════════════
   SEMANTIC TOKENS - Light Mode (Default)
   Components use THESE tokens, not primitives
   ═══════════════════════════════════════════════════ */

:root,
[data-theme="light"] {
    /* Backgrounds */
    --bg-base: var(--color-neutral-0);
    --bg-subtle: var(--color-neutral-50);
    --bg-muted: var(--color-neutral-100);
    --bg-elevated: var(--color-neutral-0);
    --bg-overlay: rgba(0, 0, 0, 0.5);

    /* Text */
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

    /* Interactive */
    --interactive-primary: var(--color-primary-600);
    --interactive-primary-hover: var(--color-primary-700);
    --interactive-primary-active: var(--color-primary-800);
    --interactive-secondary: var(--color-neutral-100);
    --interactive-secondary-hover: var(--color-neutral-200);

    /* Status */
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

**✓ Done When:**

-   [x] All semantic tokens added to `tokens.css`
-   [x] Test element with `background: var(--bg-base)` shows white background
-   [x] Test element with `color: var(--text-primary)` shows dark text

---

#### TASK 0.2.3: Create Dark Mode Semantic Tokens

-   [x] **Status:** Completed

**📁 Files to Modify:**

-   `resources/css/tokens.css` (add to existing)

**📝 Description:**
Override semantic tokens for dark mode. The same token names get different values when `[data-theme="dark"]` is applied to the document.

**📄 tokens.css (Dark Mode Section - add after light mode):**

```css
/* ═══════════════════════════════════════════════════
   SEMANTIC TOKENS - Dark Mode
   ═══════════════════════════════════════════════════ */

[data-theme="dark"] {
    /* Backgrounds */
    --bg-base: var(--color-neutral-950);
    --bg-subtle: var(--color-neutral-900);
    --bg-muted: var(--color-neutral-800);
    --bg-elevated: var(--color-neutral-900);
    --bg-overlay: rgba(0, 0, 0, 0.7);

    /* Text */
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

    /* Interactive */
    --interactive-primary: var(--color-primary-500);
    --interactive-primary-hover: var(--color-primary-400);
    --interactive-primary-active: var(--color-primary-300);
    --interactive-secondary: var(--color-neutral-800);
    --interactive-secondary-hover: var(--color-neutral-700);

    /* Status (adjusted for dark backgrounds) */
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

    /* Shadows (more subtle) */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
}
```

**✓ Done When:**

-   [x] Dark mode tokens added to `tokens.css`
-   [x] Adding `data-theme="dark"` to `<html>` switches colors
-   [x] Background becomes dark, text becomes light
-   [x] All semantic tokens work correctly in dark mode

---

#### TASK 0.2.4: Create Component Tokens

-   [x] **Status:** Completed

**📁 Files to Modify:**

-   `resources/css/tokens.css` (add to existing)

**📝 Description:**
Define component-specific tokens that combine semantic tokens for specific UI elements. This provides a consistent API for styling components.

**📄 tokens.css (Component Tokens - add after dark mode):**

```css
/* ═══════════════════════════════════════════════════
   COMPONENT TOKENS
   Specific tokens for UI components
   ═══════════════════════════════════════════════════ */

:root {
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

    /* Navigation */
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

**✓ Done When:**

-   [x] All component tokens defined
-   [x] Button using `var(--btn-primary-bg)` shows correct color
-   [x] Card using `var(--card-bg)` and `var(--card-shadow)` looks correct
-   [x] Dark mode overrides work for navigation tokens

---

#### TASK 0.2.5: Integrate Tokens with Tailwind CSS

-   [x] **Status:** Completed

**📁 Files to Modify:**

-   `resources/css/app.css` (Tailwind 4 CSS-first config)

**📝 Description:**
Map CSS variables to Tailwind utility classes so you can use `bg-bg-base` or `text-text-primary` in your JSX. For Tailwind 4, this is done directly in the `@theme` block in `app.css`.

**📄 resources/css/app.css (Tailwind 4 @theme section):**

```css
@theme {
    /* Map Semantic Tokens to Tailwind */
    --color-bg-base: var(--bg-base);
    --color-bg-subtle: var(--bg-subtle);
    /* ... more mappings ... */
}
```

**✓ Done When:**

-   [x] `resources/css/app.css` contains `@theme` mappings
-   [x] Using `className="bg-bg-base"` in a component works
-   [x] Using `className="text-text-primary"` in a component works
-   [x] IntelliSense picks up the new custom color tokens
        "./resources/\*_/_.ts",
        ],
        darkMode: ["class", '[data-theme="dark"]'],
        theme: {
        extend: {
        colors: {
        // Primary palette
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
        // Semantic background colors
        bg: {
        base: "var(--bg-base)",
        subtle: "var(--bg-subtle)",
        muted: "var(--bg-muted)",
        elevated: "var(--bg-elevated)",
        },
        // Semantic text colors
        text: {
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
        inverted: "var(--text-inverted)",
        link: "var(--text-link)",
        },
        // Border colors
        border: {
        DEFAULT: "var(--border-default)",
        strong: "var(--border-strong)",
        focus: "var(--border-focus)",
        },
        },
        boxShadow: {
        "theme-sm": "var(--shadow-sm)",
        "theme-md": "var(--shadow-md)",
        "theme-lg": "var(--shadow-lg)",
        "theme-xl": "var(--shadow-xl)",
        },
        borderColor: {
        DEFAULT: "var(--border-default)",
        },
        },
        },
        plugins: [],
        };

````

**✓ Done When:**

-   [ ] `tailwind.config.js` updated with all color mappings
-   [ ] `className="bg-bg-base"` works in components
-   [ ] `className="text-text-primary"` works in components
-   [ ] `className="shadow-theme-md"` applies the themed shadow
-   [ ] Dark mode changes colors when `data-theme="dark"` is applied

---

#### TASK 0.2.6: Create useTheme Hook

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `resources/js/Hooks/useTheme.ts`

**📝 Description:**
Create a React hook that manages theme state (light/dark/system), persists choice to localStorage, and applies the `data-theme` attribute to the document.

**📄 resources/js/Hooks/useTheme.ts:**

```typescript
import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

interface UseThemeReturn {
    theme: Theme;
    resolvedTheme: "light" | "dark";
    setTheme: (theme: Theme) => void;
}

export function useTheme(): UseThemeReturn {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window !== "undefined") {
            return (localStorage.getItem("theme") as Theme) || "system";
        }
        return "system";
    });

    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(
        "light"
    );

    useEffect(() => {
        const root = document.documentElement;
        const systemPrefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        const effectiveTheme =
            theme === "system" ? (systemPrefersDark ? "dark" : "light") : theme;

        root.setAttribute("data-theme", effectiveTheme);
        setResolvedTheme(effectiveTheme);
        localStorage.setItem("theme", theme);

        // Listen for system preference changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e: MediaQueryListEvent) => {
            if (theme === "system") {
                const newTheme = e.matches ? "dark" : "light";
                root.setAttribute("data-theme", newTheme);
                setResolvedTheme(newTheme);
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return { theme, resolvedTheme, setTheme };
}
````

**✓ Done When:**

-   [ ] Hook file created at correct path
-   [ ] Calling `setTheme('dark')` changes `data-theme` attribute on `<html>`
-   [ ] Theme persists after page refresh (check localStorage)
-   [ ] 'system' option follows OS preference

---

#### TASK 0.2.7: Create ThemeToggle Component

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `resources/js/Components/UI/ThemeToggle.tsx`

**📝 Description:**
Create a button/dropdown component that allows users to switch between light, dark, and system themes.

**📄 resources/js/Components/UI/ThemeToggle.tsx:**

```tsx
import React from "react";
import { useTheme } from "@/Hooks/useTheme";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const themes = [
        { value: "light", label: "☀️ Light", icon: "☀️" },
        { value: "dark", label: "🌙 Dark", icon: "🌙" },
        { value: "system", label: "💻 System", icon: "💻" },
    ] as const;

    return (
        <div className="flex items-center gap-1 p-1 rounded-lg bg-bg-muted">
            {themes.map((t) => (
                <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        theme === t.value
                            ? "bg-bg-base text-text-primary shadow-theme-sm"
                            : "text-text-secondary hover:text-text-primary"
                    }`}
                    title={t.label}
                >
                    {t.icon}
                </button>
            ))}
        </div>
    );
}
```

**✓ Done When:**

-   [ ] Component renders three theme options
-   [ ] Clicking each option changes the theme
-   [ ] Active theme is visually highlighted
-   [ ] Theme changes are instant and visible

---

### 0.3 Internationalization (i18n)

> **Reference:** [project-rules.md Section 9 - Internationalization](./project-rules.md#9-internationalization-i18n)

---

#### TASK 0.3.1: Install i18n Dependencies

-   [x] **Status:** Completed

**📁 Files to Modify:**

-   `package.json` (dependencies added)

**📝 Description:**
Install react-i18next and i18next for frontend translations.

**🔧 Commands:**

```bash
npm install react-i18next i18next
```

**✓ Done When:**

-   [ ] `react-i18next` and `i18next` appear in `package.json` dependencies
-   [ ] No npm errors during installation

---

#### TASK 0.3.2: Create i18n Configuration

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `resources/js/i18n/index.ts`
-   `resources/js/i18n/locales/en.json`
-   `resources/js/i18n/locales/ar.json`
-   `resources/js/i18n/locales/fr.json`
-   `resources/js/i18n/locales/es.json`

**📝 Description:**
Set up the i18next configuration and create translation files for all four supported languages (English, Arabic, French, Spanish).

**📄 resources/js/i18n/index.ts:**

```typescript
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
    lng: localStorage.getItem("language") || "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
```

**📄 resources/js/i18n/locales/en.json:**

```json
{
    "common": {
        "save": "Save",
        "cancel": "Cancel",
        "delete": "Delete",
        "edit": "Edit",
        "create": "Create",
        "search": "Search...",
        "loading": "Loading...",
        "noResults": "No results found",
        "confirm": "Confirm",
        "back": "Back",
        "next": "Next",
        "close": "Close"
    },
    "auth": {
        "login": "Login",
        "logout": "Logout",
        "email": "Email Address",
        "password": "Password",
        "rememberMe": "Remember Me",
        "forgotPassword": "Forgot Password?"
    },
    "nav": {
        "dashboard": "Dashboard",
        "customers": "Customers",
        "prescriptions": "Prescriptions",
        "inventory": "Inventory",
        "pos": "Point of Sale",
        "invoices": "Invoices",
        "lab": "Lab",
        "reports": "Reports",
        "settings": "Settings"
    }
}
```

**📄 resources/js/i18n/locales/ar.json:**

```json
{
    "common": {
        "save": "حفظ",
        "cancel": "إلغاء",
        "delete": "حذف",
        "edit": "تعديل",
        "create": "إنشاء",
        "search": "بحث...",
        "loading": "جاري التحميل...",
        "noResults": "لا توجد نتائج",
        "confirm": "تأكيد",
        "back": "رجوع",
        "next": "التالي",
        "close": "إغلاق"
    },
    "auth": {
        "login": "تسجيل الدخول",
        "logout": "تسجيل الخروج",
        "email": "البريد الإلكتروني",
        "password": "كلمة المرور",
        "rememberMe": "تذكرني",
        "forgotPassword": "نسيت كلمة المرور؟"
    },
    "nav": {
        "dashboard": "لوحة التحكم",
        "customers": "العملاء",
        "prescriptions": "الوصفات الطبية",
        "inventory": "المخزون",
        "pos": "نقطة البيع",
        "invoices": "الفواتير",
        "lab": "المختبر",
        "reports": "التقارير",
        "settings": "الإعدادات"
    }
}
```

_(Create similar files for fr.json and es.json with French and Spanish translations)_

**✓ Done When:**

-   [ ] i18n/index.ts created and configured
-   [ ] All four locale JSON files created (en, ar, fr, es)
-   [ ] i18n imported in app.tsx: `import '@/i18n';`
-   [ ] `useTranslation` hook works: `const { t } = useTranslation(); t('common.save')`

---

#### TASK 0.3.3: Create useDirection Hook for RTL

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `resources/js/Hooks/useDirection.ts`

**📝 Description:**
Create a hook that detects if the current language is RTL (Arabic) and provides direction utilities.

**📄 resources/js/Hooks/useDirection.ts:**

```typescript
import { useTranslation } from "react-i18next";

interface UseDirectionReturn {
    isRTL: boolean;
    direction: "rtl" | "ltr";
    align: "right" | "left";
}

export function useDirection(): UseDirectionReturn {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === "ar";

    return {
        isRTL,
        direction: isRTL ? "rtl" : "ltr",
        align: isRTL ? "right" : "left",
    };
}
```

**✓ Done When:**

-   [ ] Hook created at correct path
-   [ ] Returns `isRTL: true` when language is 'ar'
-   [ ] Returns `isRTL: false` for other languages

---

#### TASK 0.3.4: Create LanguageSwitcher Component

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `resources/js/Components/UI/LanguageSwitcher.tsx`

**📝 Description:**
Create a dropdown component that allows users to switch between supported languages and updates document direction for RTL.

**📄 resources/js/Components/UI/LanguageSwitcher.tsx:**

```tsx
import React from "react";
import { useTranslation } from "react-i18next";

const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "es", label: "Español", flag: "🇪🇸" },
];

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (code: string) => {
        i18n.changeLanguage(code);
        localStorage.setItem("language", code);
        document.documentElement.lang = code;
        document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    };

    const currentLang =
        languages.find((l) => l.code === i18n.language) || languages[0];

    return (
        <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-bg-base text-text-primary border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-border-focus"
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

**✓ Done When:**

-   [ ] Component renders with all four languages
-   [ ] Selecting a language changes the UI text
-   [ ] Selecting Arabic changes `dir="rtl"` on `<html>`
-   [ ] Language persists after page refresh

---

#### TASK 0.3.5: Create RTL CSS Utilities

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `resources/css/rtl.css`

**📝 Description:**
Create CSS utilities that use logical properties for proper RTL support.

**📄 resources/css/rtl.css:**

```css
/* ═══════════════════════════════════════════════════
   RTL SUPPORT UTILITIES
   Use logical properties for automatic RTL handling
   ═══════════════════════════════════════════════════ */

/* Logical margin/padding utilities */
.ms-auto {
    margin-inline-start: auto;
}
.me-auto {
    margin-inline-end: auto;
}
.ps-4 {
    padding-inline-start: 1rem;
}
.pe-4 {
    padding-inline-end: 1rem;
}

/* Text alignment */
.text-start {
    text-align: start;
}
.text-end {
    text-align: end;
}

/* Flexbox RTL-aware */
.flex-row-reverse-rtl {
    flex-direction: row;
}
[dir="rtl"] .flex-row-reverse-rtl {
    flex-direction: row-reverse;
}

/* Icon flipping for directional icons */
[dir="rtl"] .icon-flip {
    transform: scaleX(-1);
}

/* Sidebar position */
.sidebar {
    inset-inline-start: 0;
}

/* Border radius */
.rounded-start {
    border-start-start-radius: 0.375rem;
    border-end-start-radius: 0.375rem;
}
.rounded-end {
    border-start-end-radius: 0.375rem;
    border-end-end-radius: 0.375rem;
}
```

**✓ Done When:**

-   [ ] RTL CSS file created
-   [ ] Imported in app.css: `@import './rtl.css';`
-   [ ] Sidebar appears on right side in Arabic
-   [ ] Text alignment flips correctly in RTL

---

### 0.4 Base Layouts & Authentication

> **Reference:** [plan.md Section 3.4 - Folder Structure](./plan.md#34-folder-structure)

---

#### TASK 0.4.1: Update Inertia Root Template

-   [x] **Status:** Completed

**📁 Files to Modify:**

-   `resources/views/app.blade.php`

**📝 Description:**
Configure the main Blade template that wraps all Inertia pages. Include proper meta tags, Vite assets, and the Inertia app mounting point.

**📄 resources/views/app.blade.php:**

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('app.name', 'Optical Shop Manager') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />

    <!-- Scripts & Styles -->
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead

    <!-- Theme initialization (prevent flash) -->
    <script>
      (function() {
        const theme = localStorage.getItem('theme') || 'system';
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const resolved = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
        document.documentElement.setAttribute('data-theme', resolved);

        const lang = localStorage.getItem('language') || 'en';
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      })();
    </script>
</head>
<body class="font-sans antialiased bg-bg-base text-text-primary">
    @inertia
</body>
</html>
```

**✓ Done When:**

-   [ ] Template updated with all elements shown
-   [ ] Font loaded (Inter)
-   [ ] Theme doesn't flash on page load
-   [ ] Language direction set correctly on load

---

#### TASK 0.4.2: Create GuestLayout Component

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `resources/js/Layouts/GuestLayout.tsx`

**📝 Description:**
Create a layout for unauthenticated pages (login, register, forgot password). Centered card design with optional business logo support.

**📄 resources/js/Layouts/GuestLayout.tsx:**

```tsx
import React, { PropsWithChildren } from "react";
import { LanguageSwitcher } from "@/Components/UI/LanguageSwitcher";
import { ThemeToggle } from "@/Components/UI/ThemeToggle";

interface GuestLayoutProps {
    title?: string;
    logo?: string;
}

export function GuestLayout({
    children,
    title,
    logo,
}: PropsWithChildren<GuestLayoutProps>) {
    return (
        <div className="min-h-screen flex flex-col bg-bg-subtle">
            {/* Header with theme/language toggles */}
            <div className="absolute top-4 right-4 flex items-center gap-3">
                <ThemeToggle />
                <LanguageSwitcher />
            </div>

            {/* Centered content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        {logo ? (
                            <img
                                src={logo}
                                alt="Logo"
                                className="h-16 mx-auto"
                            />
                        ) : (
                            <div className="text-3xl font-bold text-text-primary">
                                👓 OptiManager
                            </div>
                        )}
                    </div>

                    {/* Card */}
                    <div className="bg-bg-base rounded-xl shadow-theme-lg border border-border p-8">
                        {title && (
                            <h1 className="text-2xl font-semibold text-text-primary text-center mb-6">
                                {title}
                            </h1>
                        )}
                        {children}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-4 text-text-muted text-sm">
                © {new Date().getFullYear()} Optical Shop Manager
            </div>
        </div>
    );
}
```

**✓ Done When:**

-   [ ] Layout component created
-   [ ] Can wrap login page with `<GuestLayout>`
-   [ ] Theme and language toggles visible
-   [ ] Card is centered on screen
-   [ ] Responsive on mobile

---

#### TASK 0.4.3: Create AuthenticatedLayout Component

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `resources/js/Layouts/AuthenticatedLayout.tsx`
-   `resources/js/Components/UI/Sidebar.tsx`
-   `resources/js/Components/UI/Header.tsx`

**📝 Description:**
Create the main application layout with sidebar navigation, header, and content area. Sidebar should show role-appropriate menu items.

_(This is a large task - implement sidebar with placeholder navigation items)_

**✓ Done When:**

-   [ ] AuthenticatedLayout renders with sidebar and header
-   [ ] Sidebar collapses on mobile (hamburger menu)
-   [ ] Header shows user dropdown, theme toggle, language switcher
-   [ ] Content area scrolls independently
-   [ ] Works correctly in RTL mode

---

#### TASK 0.4.4: Create Login Page

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `resources/js/Pages/Auth/Login.tsx`

**📝 Description:**
Create the login page using GuestLayout with email/password form, remember me checkbox, and forgot password link.

**✓ Done When:**

-   [ ] Login page renders at `/login`
-   [ ] Form submits to Laravel auth
-   [ ] Validation errors display
-   [ ] Remember me works
-   [ ] Redirects to dashboard on success
-   [ ] All text uses translation keys

---

## 🟢 Phase 1: Core Infrastructure (Week 2-3)

> **Goal:** Build the multi-tenant foundation, user roles, and base CRUD operations.  
> **Reference:** [plan.md Section 2 - Architecture Principles](./plan.md#2-architecture-principles)

---

### 1.1 Database Migrations - Core Tables

#### TASK 1.1.1: Create Businesses Migration

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `database/migrations/xxxx_xx_xx_create_businesses_table.php`

**🔧 Command:**

```bash
php artisan make:migration create_businesses_table
```

**📄 Migration Code:**

```php
Schema::create('businesses', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
    $table->string('logo_url')->nullable();
    $table->string('primary_color', 7)->default('#3b82f6');
    $table->string('default_language', 5)->default('en');
    $table->json('enabled_languages')->default('["en"]');
    $table->string('currency_code', 3)->default('USD');
    $table->decimal('tax_rate', 5, 2)->default(0);
    $table->json('settings')->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});
```

**✓ Done When:**

-   [ ] Migration file created
-   [ ] `php artisan migrate` creates `businesses` table
-   [ ] All columns exist in database

---

#### TASK 1.1.2: Create Branches Migration

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `database/migrations/xxxx_xx_xx_create_branches_table.php`

**📄 Migration Code:**

```php
Schema::create('branches', function (Blueprint $table) {
    $table->id();
    $table->foreignId('business_id')->constrained()->cascadeOnDelete();
    $table->string('name');
    $table->text('address')->nullable();
    $table->string('phone', 50)->nullable();
    $table->boolean('is_headquarters')->default(false);
    $table->boolean('is_active')->default(true);
    $table->timestamps();

    $table->index('business_id');
});
```

**✓ Done When:**

-   [ ] Migration creates `branches` table with FK to businesses
-   [ ] Cascade delete works (deleting business deletes branches)

---

#### TASK 1.1.3: Update Users Migration

-   [x] **Status:** Completed

**📁 Files to Modify:**

-   `database/migrations/xxxx_xx_xx_create_users_table.php` (or create new migration)

**📄 Add Columns:**

```php
$table->foreignId('business_id')->nullable()->constrained()->nullOnDelete();
$table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
$table->string('role')->default('sales_staff');
$table->boolean('is_active')->default(true);
$table->timestamp('last_login_at')->nullable();
```

**✓ Done When:**

-   [ ] Users table has business_id, branch_id, role columns
-   [ ] Super admin users can have null business_id

---

#### TASK 1.1.4: Create BelongsToBusiness Trait

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `app/Models/Traits/BelongsToBusiness.php`

**📄 Trait Code:**

```php
<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;

trait BelongsToBusiness
{
    protected static function bootBelongsToBusiness(): void
    {
        // Auto-scope queries to current business
        static::addGlobalScope('business', function (Builder $builder) {
            if (auth()->check() && auth()->user()->business_id) {
                $builder->where('business_id', auth()->user()->business_id);
            }
        });

        // Auto-fill business_id on create
        static::creating(function ($model) {
            if (auth()->check() && auth()->user()->business_id && !$model->business_id) {
                $model->business_id = auth()->user()->business_id;
            }
        });
    }

    public function business()
    {
        return $this->belongsTo(\App\Models\Business::class);
    }
}
```

**✓ Done When:**

-   [ ] Trait created at correct path
-   [ ] Models using trait auto-scope to business
-   [ ] New records auto-fill business_id

---

### 1.2 PHP Enums

#### TASK 1.2.1: Create All PHP Enums

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `app/Enums/UserRole.php`
-   `app/Enums/InvoiceStatus.php`
-   `app/Enums/PaymentMethod.php`
-   `app/Enums/ItemType.php`
-   `app/Enums/FrameCategory.php`
-   `app/Enums/FrameMaterial.php`
-   `app/Enums/Gender.php`
-   `app/Enums/LensType.php`
-   `app/Enums/LensIndex.php`
-   `app/Enums/ReplacementSchedule.php`
-   `app/Enums/JobCardStatus.php`

**📄 Example - UserRole.php:**

```php
<?php

namespace App\Enums;

enum UserRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case BUSINESS_OWNER = 'business_owner';
    case OPTOMETRIST = 'optometrist';
    case SALES_STAFF = 'sales_staff';
    case LAB_TECHNICIAN = 'lab_technician';

    public function label(): string
    {
        return match($this) {
            self::SUPER_ADMIN => 'Super Admin',
            self::BUSINESS_OWNER => 'Business Owner',
            self::OPTOMETRIST => 'Optometrist',
            self::SALES_STAFF => 'Sales Staff',
            self::LAB_TECHNICIAN => 'Lab Technician',
        };
    }
}
```

**📄 Example - InvoiceStatus.php:**

```php
<?php

namespace App\Enums;

enum InvoiceStatus: string
{
    case DEPOSIT_PAID = 'deposit_paid';
    case IN_LAB = 'in_lab';
    case READY_PICKUP = 'ready_pickup';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';

    public function color(): string
    {
        return match($this) {
            self::DEPOSIT_PAID => 'warning',
            self::IN_LAB => 'info',
            self::READY_PICKUP => 'success',
            self::COMPLETED => 'success',
            self::CANCELLED => 'error',
        };
    }
}
```

**✓ Done When:**

-   [ ] All 11 enum files created
-   [ ] Each enum has appropriate cases
-   [ ] Helper methods (label, color) work

---

### 1.3 Core Models

#### TASK 1.3.1: Create Business Model

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `app/Models/Business.php`

**📄 Model Code:**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Business extends Model
{
    protected $fillable = [
        'name', 'owner_id', 'logo_url', 'primary_color',
        'default_language', 'enabled_languages', 'currency_code',
        'tax_rate', 'settings', 'is_active',
    ];

    protected $casts = [
        'enabled_languages' => 'array',
        'settings' => 'array',
        'tax_rate' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function branches(): HasMany
    {
        return $this->hasMany(Branch::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }
}
```

**✓ Done When:**

-   [ ] Model created with all relationships
-   [ ] Casts work correctly (JSON fields parse as arrays)

---

#### TASK 1.3.2: Create Branch Model

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `app/Models/Branch.php`

**📄 Model Code:**

```php
<?php

namespace App\Models;

use App\Models\Traits\BelongsToBusiness;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use BelongsToBusiness;

    protected $fillable = [
        'business_id', 'name', 'address', 'phone',
        'is_headquarters', 'is_active',
    ];

    protected $casts = [
        'is_headquarters' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
```

**✓ Done When:**

-   [ ] Model uses BelongsToBusiness trait
-   [ ] Queries auto-scope to current business

---

#### TASK 1.3.3: Update User Model

-   [ ] **Status:** Not Started

**📁 Files to Modify:**

-   `app/Models/User.php`

**📄 Add to User Model:**

```php
use App\Enums\UserRole;

protected $fillable = [
    'name', 'email', 'password', 'business_id',
    'branch_id', 'role', 'is_active',
];

protected $casts = [
    'email_verified_at' => 'datetime',
    'password' => 'hashed',
    'role' => UserRole::class,
    'is_active' => 'boolean',
    'last_login_at' => 'datetime',
];

public function business(): BelongsTo
{
    return $this->belongsTo(Business::class);
}

public function branch(): BelongsTo
{
    return $this->belongsTo(Branch::class);
}

// Role helpers
public function isSuperAdmin(): bool
{
    return $this->role === UserRole::SUPER_ADMIN;
}

public function isBusinessOwner(): bool
{
    return $this->role === UserRole::BUSINESS_OWNER;
}

public function isOptometrist(): bool
{
    return $this->role === UserRole::OPTOMETRIST;
}

public function isSalesStaff(): bool
{
    return $this->role === UserRole::SALES_STAFF;
}

public function isLabTechnician(): bool
{
    return $this->role === UserRole::LAB_TECHNICIAN;
}

public function canViewCostPrices(): bool
{
    return in_array($this->role, [UserRole::SUPER_ADMIN, UserRole::BUSINESS_OWNER]);
}
```

**✓ Done When:**

-   [ ] Role casts to UserRole enum
-   [ ] All helper methods work correctly
-   [ ] Relationships defined

---

### 1.4 Middleware & Authorization

#### TASK 1.4.1: Create EnsureBusinessAccess Middleware

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `app/Http/Middleware/EnsureBusinessAccess.php`

**🔧 Command:**

```bash
php artisan make:middleware EnsureBusinessAccess
```

**📄 Middleware Code:**

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureBusinessAccess
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Super admins bypass business check
        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        // Non-super admins must have a business
        if (!$user->business_id) {
            abort(403, 'No business assigned.');
        }

        return $next($request);
    }
}
```

**📁 Register in bootstrap/app.php (Laravel 11):**

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'business' => \App\Http\Middleware\EnsureBusinessAccess::class,
    ]);
})
```

**✓ Done When:**

-   [x] Middleware created and registered
-   [x] Routes with `middleware('business')` require business assignment

---

#### TASK 1.4.2: Create EnsureRole Middleware

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `app/Http/Middleware/EnsureRole.php`

**📄 Middleware Code:**

```php
<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        $user = $request->user();

        $allowedRoles = array_map(
            fn($role) => UserRole::tryFrom($role),
            $roles
        );

        if (!in_array($user->role, $allowedRoles)) {
            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}
```

**📁 Register:**

```php
'role' => \App\Http\Middleware\EnsureRole::class,
```

**📄 Usage Example:**

```php
Route::middleware(['auth', 'role:super_admin,business_owner'])
    ->group(function () {
        // Only super admins and business owners
    });
```

**✓ Done When:**

-   [x] Middleware accepts role parameters
-   [x] Unauthorized roles get 403 error

---

#### TASK 1.4.3: Create Authorization Policies

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `app/Policies/BusinessPolicy.php`
-   `app/Policies/BranchPolicy.php`
-   `app/Policies/UserPolicy.php`

**🔧 Commands:**

```bash
php artisan make:policy BusinessPolicy --model=Business
php artisan make:policy BranchPolicy --model=Branch
php artisan make:policy UserPolicy --model=User
```

**📄 BusinessPolicy.php:**

```php
public function viewAny(User $user): bool
{
    return $user->isSuperAdmin();
}

public function create(User $user): bool
{
    return $user->isSuperAdmin();
}

public function update(User $user, Business $business): bool
{
    return $user->isSuperAdmin() ||
           ($user->isBusinessOwner() && $user->business_id === $business->id);
}
```

**📁 Register in AppServiceProvider or AuthServiceProvider:**

```php
Gate::policy(Business::class, BusinessPolicy::class);
Gate::policy(Branch::class, BranchPolicy::class);
Gate::policy(User::class, UserPolicy::class);
```

**✓ Done When:**

-   [x] All policies created
-   [x] `$this->authorize('update', $business)` works in controllers

---

### 1.5 Super Admin Module

#### TASK 1.5.1: Create Admin Dashboard Controller

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `app/Http/Controllers/Admin/DashboardController.php`

**📄 Controller Code:**

```php
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
```

**✓ Done When:**

-   [x] Controller returns stats to Inertia page
-   [x] Only super admins can access

---

#### TASK 1.5.2: Create Admin Business Controller

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `app/Http/Controllers/Admin/BusinessController.php`
-   `app/Http/Requests/Admin/StoreBusinessRequest.php`
-   `app/Http/Requests/Admin/UpdateBusinessRequest.php`

**📄 Controller Methods:**

-   `index()` - List all businesses with pagination
-   `create()` - Show create form
-   `store()` - Create new business
-   `edit()` - Show edit form
-   `update()` - Update business
-   `toggleStatus()` - Enable/disable business

**✓ Done When:**

-   [x] Full CRUD operations work
-   [x] Validation errors display on frontend
-   [x] Toggle status works without page reload

---

#### TASK 1.5.3: Create Admin React Pages

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `resources/js/Pages/Admin/Dashboard.tsx`
-   `resources/js/Pages/Admin/Businesses/Index.tsx`
-   `resources/js/Pages/Admin/Businesses/Create.tsx`
-   `resources/js/Pages/Admin/Businesses/Edit.tsx`

**📝 Description:**
Create the admin panel UI with:

-   Dashboard showing system stats
-   Business list with search/filter
-   Create/edit business forms

**✓ Done When:**

-   [x] Dashboard shows live stats
-   [x] Business list with pagination works
-   [x] Can create and edit businesses
-   [x] All text uses i18n translation keys

---

#### TASK 1.5.4: Define Admin Routes

-   [x] **Status:** Completed

**📁 Files to Modify:**

-   `routes/web.php` (or create `routes/admin.php`)

**📄 Routes:**

```php
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
```

**✓ Done When:**

-   [x] `/admin/dashboard` accessible by super admin only
-   [x] Other roles get 403 error
-   [x] All CRUD routes work

---

### 1.6 Business Management Module

#### TASK 1.6.1: Create Business Dashboard Controller

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `app/Http/Controllers/Business/DashboardController.php`

**📄 Controller Code:**

```php
<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Invoice;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        return Inertia::render('Business/Dashboard', [
            'stats' => [
                'todaySales' => Invoice::whereDate('created_at', today())->sum('total'),
                'pendingPickups' => Invoice::where('status', 'ready_pickup')->count(),
                'customersCount' => Customer::count(),
            ],
            'recentInvoices' => Invoice::with('customer')
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }
}
```

**✓ Done When:**

-   [x] Dashboard shows role-appropriate data
-   [x] Stats are scoped to current business

---

#### TASK 1.6.2: Create Branch Controller

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `app/Http/Controllers/Business/BranchController.php`
-   `app/Http/Requests/Business/StoreBranchRequest.php`

**📝 Description:**
CRUD for branches within the current business. Only business owners can manage branches.

**✓ Done When:**

-   [x] Can create/edit/list branches
-   [x] Only shows branches for current business
-   [x] Can set headquarters flag

---

#### TASK 1.6.3: Create Staff Controller

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `app/Http/Controllers/Business/StaffController.php`
-   `app/Http/Requests/Business/StoreStaffRequest.php`

**📝 Description:**
Manage staff users within the business. Assign roles and branches.

**✓ Done When:**

-   [x] Can create users with role assignment
-   [x] Can assign users to branches
-   [x] Can toggle user active status
-   [x] Password is hashed on create

---

#### TASK 1.6.4: Create Settings Controller

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `app/Http/Controllers/Business/SettingsController.php`

**📝 Description:**
Business settings: name, logo, primary color, tax rate, language preferences.

**✓ Done When:**

-   [x] Can update business profile
-   [x] Logo upload works
-   [x] Color picker for primary_color
-   [x] Changes reflect immediately in UI

---

#### TASK 1.6.5: Create Business React Pages

-   [x] **Status:** Completed

**📁 Files to Create:**

-   [x] `resources/js/Pages/Business/Dashboard.tsx`
-   [x] `resources/js/Pages/Business/Branches/Index.tsx`
-   [x] `resources/js/Pages/Business/Branches/Create.tsx`
-   [x] `resources/js/Pages/Business/Branches/Edit.tsx`
-   [x] `resources/js/Pages/Business/Staff/Index.tsx`
-   [x] `resources/js/Pages/Business/Staff/Create.tsx`
-   [x] `resources/js/Pages/Business/Staff/Edit.tsx`
-   [x] `resources/js/Pages/Business/Settings.tsx`

**✓ Done When:**

-   [x] All pages created and functional
-   [x] Uses design tokens consistently
-   [x] Responsive on tablet/mobile

---

### 1.7 Base UI Components

#### TASK 1.7.1: Create Button Component

-   [x] **Status:** Completed

**📁 Files to Create:**

-   [x] `resources/js/Components/UI/Button.tsx`

**📄 Component Code:**

```tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    children: React.ReactNode;
}

export function Button({
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled,
    children,
    className = "",
    ...props
}: ButtonProps) {
    const baseStyles =
        "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary:
            "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-hover)] focus:ring-primary-500",
        secondary:
            "bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] hover:bg-[var(--btn-secondary-hover)] focus:ring-primary-500",
        danger: "bg-[var(--btn-danger-bg)] text-[var(--btn-danger-text)] hover:bg-[var(--btn-danger-hover)] focus:ring-red-500",
        ghost: "bg-transparent text-text-primary hover:bg-bg-muted",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${
                sizes[size]
            } ${className} ${
                disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
}
```

**✓ Done When:**

-   [ ] All variants render correctly
-   [ ] Loading state shows spinner
-   [ ] Disabled state is visually clear
-   [ ] Works in light and dark mode

---

#### TASK 1.7.2: Create Input Component

-   [x] **Status:** Completed

**📁 Files to Create:**

-   [x] `resources/js/Components/UI/Input.tsx`

**📄 Component Features:**

-   Label with for attribute
-   Error message display
-   Types: text, email, password, number, tel
-   Design token integration

**✓ Done When:**

-   [ ] All input types work
-   [ ] Error state shows red border + message
-   [ ] Label associates correctly

---

#### TASK 1.7.3: Create Select Component

-   [x] **Status:** Completed

**📁 Files to Create:**

-   [x] `resources/js/Components/UI/Select.tsx`

**✓ Done When:**

-   [ ] Options render from array prop
-   [ ] Placeholder option works
-   [ ] Error state works

---

#### TASK 1.7.4: Create Modal Component

-   [x] **Status:** Completed

**📁 Files to Create:**

-   [x] `resources/js/Components/UI/Modal.tsx`

**📄 Component Features:**

-   Overlay backdrop
-   Close on escape key
-   Close on overlay click (optional)
-   Header, body, footer slots
-   Size variants (sm, md, lg, xl)

**✓ Done When:**

-   [ ] Modal opens/closes smoothly
-   [ ] Escape key closes modal
-   [ ] Focus trapping works
-   [ ] Scrolling body is prevented when open

---

#### TASK 1.7.5: Create DataTable Component

-   [x] **Status:** Completed

**📁 Files to Create:**

-   [x] `resources/js/Components/UI/DataTable.tsx`

**📄 Component Features:**

-   Column definitions with header, accessor, cell renderer
-   Client-side sorting
-   Pagination controls
-   Empty state
-   Loading state with skeletons
-   Row actions column

**✓ Done When:**

-   [ ] Columns render from config
-   [ ] Sorting toggles asc/desc
-   [ ] Pagination works
-   [ ] Empty state shows when no data

---

#### TASK 1.7.6: Create Card, Badge, Alert Components

-   [x] **Status:** Completed

**📁 Files to Create:**

-   [x] `resources/js/Components/UI/Card.tsx`
-   [x] `resources/js/Components/UI/Badge.tsx`
-   [x] `resources/js/Components/UI/Alert.tsx`

**✓ Done When:**

-   [ ] Card has header/body/footer slots
-   [ ] Badge has status color variants
-   [ ] Alert has dismissible option
-   [ ] All use design tokens

---

## 🟡 Phase 2: Customer & Clinical Module (Week 4-5)

> **Goal:** Build customer management and prescription (Rx) systems.  
> **Reference:** [plan.md Section 5.1-5.2](./plan.md#51-customer-management-crm)

---

### 2.1 Customer Database

#### TASK 2.1.1: Create Customers Migration

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `database/migrations/xxxx_xx_xx_create_customers_table.php`

**📄 Migration Code:**

```php
Schema::create('customers', function (Blueprint $table) {
    $table->id();
    $table->foreignId('business_id')->constrained()->cascadeOnDelete();
    $table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();

    $table->string('first_name', 100);
    $table->string('last_name', 100);
    $table->string('phone', 50);
    $table->string('email')->nullable();
    $table->text('address')->nullable();
    $table->date('date_of_birth')->nullable();
    $table->text('notes')->nullable();

    $table->foreignId('family_head_id')->nullable()
        ->references('id')->on('customers')->nullOnDelete();

    $table->boolean('rx_expiry_flagged')->default(false);
    $table->timestamp('last_visit_at')->nullable();

    $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
    $table->timestamps();
    $table->softDeletes();

    // Indexes for fast search
    $table->index(['business_id', 'phone']);
    $table->index(['business_id', 'last_name', 'first_name']);
});
```

**✓ Done When:**

-   [ ] Migration runs successfully
-   [ ] Indexes created for search performance
-   [ ] Soft deletes work

---

#### TASK 2.1.2: Create Customer Model

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `app/Models/Customer.php`

**📄 Key Model Code:**

```php
<?php

namespace App\Models;

use App\Models\Traits\BelongsToBusiness;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use BelongsToBusiness, SoftDeletes;

    protected $fillable = [
        'business_id', 'branch_id', 'first_name', 'last_name',
        'phone', 'email', 'address', 'date_of_birth', 'notes',
        'family_head_id', 'rx_expiry_flagged', 'last_visit_at', 'created_by',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'last_visit_at' => 'datetime',
        'rx_expiry_flagged' => 'boolean',
    ];

    // Accessors
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getAgeAttribute(): ?int
    {
        return $this->date_of_birth?->age;
    }

    // Relationships
    public function familyHead()
    {
        return $this->belongsTo(Customer::class, 'family_head_id');
    }

    public function familyMembers()
    {
        return $this->hasMany(Customer::class, 'family_head_id');
    }

    public function spectaclePrescriptions()
    {
        return $this->hasMany(SpectaclePrescription::class);
    }

    public function contactLensPrescriptions()
    {
        return $this->hasMany(ContactLensPrescription::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scopes
    public function scopeSearch($query, string $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('phone', 'like', "%{$term}%")
              ->orWhere('first_name', 'like', "%{$term}%")
              ->orWhere('last_name', 'like', "%{$term}%");
        });
    }
}
```

**✓ Done When:**

-   [ ] Model uses BelongsToBusiness trait
-   [ ] Full name accessor works
-   [ ] Family relationships work
-   [ ] Search scope works

---

### 2.2 Customer Management UI

#### TASK 2.2.1: Create Customer Controller

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `app/Http/Controllers/Sales/CustomerController.php`
-   `app/Http/Requests/Sales/StoreCustomerRequest.php`
-   `app/Http/Requests/Sales/UpdateCustomerRequest.php`

**📄 Controller Methods:**

-   `index()` - List with search, pagination
-   `create()` - Show create form
-   `store()` - Validate and create
-   `show()` - Customer profile with Rx history
-   `edit()` - Show edit form
-   `update()` - Validate and update
-   `destroy()` - Soft delete

**📄 StoreCustomerRequest Validation:**

```php
public function rules(): array
{
    return [
        'first_name' => ['required', 'string', 'max:100'],
        'last_name' => ['required', 'string', 'max:100'],
        'phone' => [
            'required',
            'string',
            'max:50',
            Rule::unique('customers')->where('business_id', auth()->user()->business_id),
        ],
        'email' => ['nullable', 'email', 'max:255'],
        'address' => ['nullable', 'string'],
        'date_of_birth' => ['nullable', 'date', 'before:today'],
        'notes' => ['nullable', 'string'],
        'family_head_id' => ['nullable', 'exists:customers,id'],
    ];
}
```

**✓ Done When:**

-   [ ] All CRUD operations work
-   [ ] Phone is unique within business
-   [ ] Search by phone is fast (<200ms)

---

#### TASK 2.2.2: Create Customer React Pages

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `resources/js/Pages/Sales/Customers/Index.tsx`
-   `resources/js/Pages/Sales/Customers/Create.tsx`
-   `resources/js/Pages/Sales/Customers/Show.tsx`
-   `resources/js/Pages/Sales/Customers/Edit.tsx`

**📝 Index Page Features:**

-   Search input (phone-first)
-   DataTable with columns: Name, Phone, Last Visit, Actions
-   Quick action buttons: View, Edit
-   Add Customer button

**📝 Show Page Features:**

-   Profile card with all info
-   Tabs: Prescriptions, Invoices, Family
-   Add Rx button
-   Edit button

**✓ Done When:**

-   [ ] All pages functional
-   [ ] Search filters results in real-time
-   [ ] Profile shows prescription history
-   [ ] Family members display correctly

---

#### TASK 2.2.3: Create CustomerForm Component

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `resources/js/Components/Forms/CustomerForm.tsx`

**📝 Features:**

-   Reusable for create/edit
-   All fields from schema
-   Date picker for DOB
-   Family head dropdown (searchable)
-   Validation error display

**✓ Done When:**

-   [ ] Same component works for create and edit
-   [ ] Date picker works
-   [ ] Family head selector searches existing customers

---

#### TASK 2.2.4: Create CustomerSearch Component

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `resources/js/Components/Forms/CustomerSearch.tsx`

**📝 Features:**

-   Input field with search icon
-   Debounced API calls (300ms)
-   Dropdown showing results
-   Click to select customer
-   "Create New" option if no results

**✓ Done When:**

-   [ ] Typing triggers search after 300ms pause
-   [ ] Results show name and phone
-   [ ] Selecting populates parent component
-   [ ] Works in POS customer selection

---

### 2.3 Spectacle Prescriptions

#### TASK 2.3.1: Create Spectacle Prescriptions Migration

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `database/migrations/xxxx_xx_xx_create_spectacle_prescriptions_table.php`

**📄 Migration (per project-rules.md schema):**

```php
Schema::create('spectacle_prescriptions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('business_id')->constrained()->cascadeOnDelete();
    $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
    $table->foreignId('prescribed_by')->constrained('users')->cascadeOnDelete();
    $table->dateTime('prescribed_at');

    // Right Eye (OD)
    $table->decimal('od_sphere', 5, 2);
    $table->decimal('od_cylinder', 5, 2)->nullable();
    $table->unsignedSmallInteger('od_axis')->nullable();
    $table->decimal('od_add', 4, 2)->nullable();
    $table->string('od_prism', 20)->nullable();

    // Left Eye (OS)
    $table->decimal('os_sphere', 5, 2);
    $table->decimal('os_cylinder', 5, 2)->nullable();
    $table->unsignedSmallInteger('os_axis')->nullable();
    $table->decimal('os_add', 4, 2)->nullable();
    $table->string('os_prism', 20)->nullable();

    // PD
    $table->decimal('pd_far', 4, 1)->nullable();
    $table->decimal('pd_near', 4, 1)->nullable();
    $table->enum('pd_type', ['single', 'dual'])->default('single');

    $table->text('notes')->nullable();
    $table->dateTime('expires_at');

    $table->timestamps();

    $table->index(['business_id', 'customer_id']);
});
```

**✓ Done When:**

-   [ ] Migration runs successfully
-   [ ] All optical value columns have correct precision

---

#### TASK 2.3.2: Create SpectaclePrescription Model

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `app/Models/SpectaclePrescription.php`

**📄 Key Model Features:**

```php
protected $casts = [
    'prescribed_at' => 'datetime',
    'expires_at' => 'datetime',
    'od_sphere' => 'decimal:2',
    'od_cylinder' => 'decimal:2',
    // ... all decimal fields
];

public function isExpired(): bool
{
    return $this->expires_at->isPast();
}

public function daysUntilExpiry(): int
{
    return max(0, now()->diffInDays($this->expires_at, false));
}

public function isExpiringSoon(int $days = 30): bool
{
    return $this->daysUntilExpiry() <= $days && !$this->isExpired();
}
```

**✓ Done When:**

-   [ ] Model created with all casts
-   [ ] Expiry methods work correctly

---

#### TASK 2.3.3: Create Spectacle Rx Controller

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `app/Http/Controllers/Clinical/SpectacleRxController.php`
-   `app/Http/Requests/Clinical/StoreSpectacleRxRequest.php`

**📄 Validation Rules (per project-rules.md):**

```php
public function rules(): array
{
    return [
        'customer_id' => ['required', 'exists:customers,id'],

        // Right Eye
        'od_sphere' => ['required', 'numeric', 'between:-20,20', 'multiple_of:0.25'],
        'od_cylinder' => ['nullable', 'numeric', 'between:-10,10', 'multiple_of:0.25'],
        'od_axis' => ['nullable', 'integer', 'between:1,180'],
        'od_add' => ['nullable', 'numeric', 'between:0.25,4', 'multiple_of:0.25'],

        // Left Eye (same rules)
        'os_sphere' => ['required', 'numeric', 'between:-20,20', 'multiple_of:0.25'],
        // ...

        // PD
        'pd_far' => ['nullable', 'numeric', 'between:50,80'],
        'pd_near' => ['nullable', 'numeric', 'between:50,80'],
        'pd_type' => ['required', 'in:single,dual'],
    ];
}
```

**✓ Done When:**

-   [ ] Validation enforces optical ranges
-   [ ] Only optometrist/owner can create Rx
-   [ ] Expiry date auto-calculates (+2 years)

---

#### TASK 2.3.4: Create Spectacle Rx Form Component

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `resources/js/Components/Forms/SpectacleRxForm.tsx`

**📝 Features:**

-   Split OD (Right) / OS (Left) sections
-   Sphere: -20 to +20 in 0.25 steps
-   Cylinder: -10 to +10 in 0.25 steps
-   Axis: 1 to 180 degrees
-   Add: 0.25 to 4 in 0.25 steps
-   PD type toggle (single/dual)
-   Auto-calculate expiry date
-   Copy OD to OS button

**✓ Done When:**

-   [ ] All fields validate in-browser
-   [ ] Step inputs work correctly
-   [ ] Form submits to API
-   [ ] Shows success/error feedback

---

#### TASK 2.3.5: Create RxDisplay Component

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `resources/js/Components/Clinical/RxDisplay.tsx`

**📝 Features:**

-   Formatted Rx card layout
-   OD/OS side by side
-   Expiry warning if near/past
-   Print button
-   Professional optical format

**✓ Done When:**

-   [ ] Displays all Rx values properly
-   [ ] Expiry warning shows when appropriate
-   [ ] Print produces clean output

---

### 2.4 Contact Lens Prescriptions

#### TASK 2.4.1: Create Contact Lens Rx Migration & Model

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `database/migrations/xxxx_xx_xx_create_contact_lens_prescriptions_table.php`
-   `app/Models/ContactLensPrescription.php`

**📝 Additional fields vs spectacle:**

-   `od_base_curve`, `os_base_curve` (8.0-9.5, step 0.1)
-   `od_diameter`, `os_diameter` (13.0-15.0, step 0.1)
-   `od_brand`, `os_brand`
-   `replacement_schedule` enum

**✓ Done When:**

-   [ ] Migration includes all CL-specific fields
-   [ ] Model works same pattern as SpectacleRx

---

#### TASK 2.4.2: Create CL Rx Controller & Pages

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `app/Http/Controllers/Clinical/ContactLensRxController.php`
-   `resources/js/Pages/Clinical/ContactLensRx/Create.tsx`
-   `resources/js/Components/Forms/ContactLensRxForm.tsx`

**✓ Done When:**

-   [ ] CL Rx CRUD works
-   [ ] Validation includes base curve and diameter ranges

---

### 2.5 Prescription Recall System

#### TASK 2.5.1: Create Rx Expiry Command

-   [x] **Status:** Completed

**📁 Files to Create:**

-   `app/Console/Commands/FlagExpiredPrescriptions.php`

**🔧 Command:**

```bash
php artisan make:command FlagExpiredPrescriptions
```

**📄 Command Logic:**

```php
public function handle()
{
    Customer::whereHas('spectaclePrescriptions', function ($q) {
        $q->where('expires_at', '<', now())
          ->orWhere('expires_at', '<=', now()->addDays(30));
    })->update(['rx_expiry_flagged' => true]);

    $this->info('Flagged customers with expired/expiring prescriptions.');
}
```

**📁 Schedule in routes/console.php (Laravel 11):**

```php
Schedule::command('prescriptions:flag-expired')->daily();
```

**✓ Done When:**

-   [ ] Command runs manually: `php artisan prescriptions:flag-expired`
-   [ ] Scheduled to run daily
-   [ ] Flags appropriate customers

---

## 🟠 Phase 3: Inventory Module (Week 6)

> **Goal:** Build frame inventory, lens catalog, and contact lens stock management.  
> **Reference:** [plan.md Section 5.3](./plan.md#53-inventory-management)

---

### 3.1 Frame Inventory

#### TASK 3.1.1: Create Frames Migration & Model

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `database/migrations/xxxx_xx_xx_create_frames_table.php`
-   `app/Models/Frame.php`

**📄 Key Columns:**

-   `sku` (unique per business)
-   `barcode`
-   `brand`, `model`, `color_code`, `color_name`
-   `size_eye`, `size_bridge`, `size_temple` (mm)
-   `category` (optical, sunglasses, sports, kids)
-   `material` (metal, plastic, titanium, acetate, mixed)
-   `gender` (male, female, unisex, kids)
-   `cost_price`, `selling_price`
-   `quantity`, `low_stock_threshold`
-   `image_url`
-   `is_active`

**📄 Model Scopes:**

```php
public function scopeActive($query)
{
    return $query->where('is_active', true);
}

public function scopeLowStock($query)
{
    return $query->whereColumn('quantity', '<=', 'low_stock_threshold');
}

public function isLowStock(): bool
{
    return $this->quantity <= $this->low_stock_threshold;
}
```

**✓ Done When:**

-   [ ] Migration creates all columns
-   [ ] SKU has unique index within business
-   [ ] Low stock scope works

---

#### TASK 3.1.2: Create Frame Controller & Pages

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `app/Http/Controllers/Sales/FrameController.php`
-   `app/Http/Requests/Sales/StoreFrameRequest.php`
-   `resources/js/Pages/Sales/Inventory/Frames/Index.tsx`
-   `resources/js/Pages/Sales/Inventory/Frames/Create.tsx`
-   `resources/js/Pages/Sales/Inventory/Frames/Edit.tsx`
-   `resources/js/Components/Forms/FrameForm.tsx`

**📝 Index Features:**

-   Filter by category, brand, stock status
-   Low stock highlighting
-   Search by SKU, brand, model
-   Quick stock adjustment

**📝 Form Features:**

-   Size group: Eye □ Bridge □ Temple □
-   Image upload with preview
-   Cost price hidden from sales_staff role
-   Barcode input

**✓ Done When:**

-   [ ] Full CRUD works
-   [ ] Filters work correctly
-   [ ] Cost price hidden from unauthorized users
-   [ ] Image upload works

---

#### TASK 3.1.3: Create Barcode Lookup Endpoint

-   [ ] **Status:** Not Started

**📁 Files to Modify:**

-   `app/Http/Controllers/Sales/FrameController.php`

**📄 Add Method:**

```php
public function lookupBarcode(Request $request)
{
    $frame = Frame::where('barcode', $request->barcode)
        ->active()
        ->first();

    if (!$frame) {
        return response()->json(['found' => false], 404);
    }

    return response()->json([
        'found' => true,
        'frame' => $frame,
    ]);
}
```

**📄 Route:**

```php
Route::get('/frames/barcode/{barcode}', [FrameController::class, 'lookupBarcode']);
```

**✓ Done When:**

-   [ ] Scanning barcode returns frame data
-   [ ] 404 if not found
-   [ ] Used by POS for quick add

---

### 3.2 Lens Catalog

#### TASK 3.2.1: Create Lens Catalog Migration & Model

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `database/migrations/xxxx_xx_xx_create_lens_catalog_table.php`
-   `app/Models/LensCatalog.php`

**📝 Note:** Lenses are NOT stock-tracked. They are service items ordered per prescription.

**📄 Columns:**

-   `name` (e.g., "Single Vision 1.56 HMC")
-   `type` enum (single_vision, bifocal, progressive, office, sports)
-   `index` enum (1.50, 1.56, 1.60, 1.67, 1.74)
-   `coatings` JSON array
-   `cost_price`, `selling_price`
-   `lab_supplier`
-   `lead_time_days`
-   `is_active`

**✓ Done When:**

-   [ ] Migration runs
-   [ ] Coatings stored as JSON array
-   [ ] No quantity tracking

---

#### TASK 3.2.2: Create Lens Catalog Pages

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `app/Http/Controllers/Sales/LensController.php`
-   `resources/js/Pages/Sales/Inventory/Lenses/Index.tsx`
-   `resources/js/Components/Forms/LensForm.tsx`

**📝 Features:**

-   Filter by type, index
-   Coatings multi-select (checkboxes)
-   Price display

**✓ Done When:**

-   [ ] Can add/edit lens options
-   [ ] Coatings selection works
-   [ ] Lens catalog shows in POS

---

### 3.3 Contact Lens Stock

#### TASK 3.3.1: Create CL Stock Migration & Model

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `database/migrations/xxxx_xx_xx_create_contact_lens_stock_table.php`
-   `app/Models/ContactLensStock.php`

**📄 Columns:**

-   `brand`, `product_line`
-   `power`, `cylinder`, `axis`, `base_curve`, `diameter`
-   `box_quantity` (lenses per box)
-   `boxes_in_stock`
-   `cost_price_per_box`, `selling_price_per_box`
-   `expiry_date`

**📄 Model Methods:**

```php
public function isExpired(): bool
{
    return $this->expiry_date && $this->expiry_date->isPast();
}

public function isExpiringSoon(int $days = 60): bool
{
    return $this->expiry_date &&
           $this->expiry_date->diffInDays(now()) <= $days &&
           !$this->isExpired();
}
```

**✓ Done When:**

-   [ ] Stock tracks boxes, not individual lenses
-   [ ] Expiry tracking works

---

### 3.4 Inventory Dashboard

#### TASK 3.4.1: Create Inventory Dashboard Widgets

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `resources/js/Components/Dashboard/LowStockWidget.tsx`
-   `resources/js/Components/Dashboard/ExpiringSoonWidget.tsx`

**📝 Low Stock Widget:**

-   Shows frames below threshold
-   Count badge
-   Link to full list

**📝 Expiring Soon Widget:**

-   Contact lenses expiring within 60 days
-   Expiry date display
-   Alert styling

**✓ Done When:**

-   [ ] Widgets show on business dashboard
-   [ ] Data updates on refresh
-   [ ] Links work to detail pages

---

## 🔴 Phase 4: POS & Invoicing (Week 7-8)

> **Goal:** Build the Point of Sale system and invoice management with split payments.  
> **Reference:** [plan.md Section 5.4](./plan.md#54-point-of-sale-pos--invoicing)

---

### 4.1 Invoice Database

#### TASK 4.1.1: Create Invoices Migration

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `database/migrations/xxxx_xx_xx_create_invoices_table.php`

**📄 Migration Code:**

```php
Schema::create('invoices', function (Blueprint $table) {
    $table->id();
    $table->foreignId('business_id')->constrained()->cascadeOnDelete();
    $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
    $table->foreignId('customer_id')->constrained()->cascadeOnDelete();

    $table->string('invoice_number', 50)->unique();
    $table->string('status')->default('deposit_paid');

    $table->decimal('subtotal', 10, 2);
    $table->decimal('discount_amount', 10, 2)->default(0);
    $table->string('discount_type')->default('fixed');
    $table->decimal('tax_amount', 10, 2)->default(0);
    $table->decimal('total', 10, 2);

    $table->decimal('amount_paid', 10, 2)->default(0);
    $table->decimal('balance_due', 10, 2);

    $table->foreignId('prescription_id')->nullable();

    $table->text('notes')->nullable();
    $table->text('warranty_info')->nullable();

    $table->dateTime('estimated_pickup')->nullable();
    $table->dateTime('actual_pickup')->nullable();

    $table->foreignId('created_by')->constrained('users');
    $table->timestamps();

    $table->index(['business_id', 'status']);
    $table->index(['business_id', 'created_at']);
});
```

**✓ Done When:**

-   [ ] Migration runs successfully
-   [ ] Status index optimizes filtering

---

#### TASK 4.1.2: Create Invoice Items & Payments Migrations

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `database/migrations/xxxx_xx_xx_create_invoice_items_table.php`
-   `database/migrations/xxxx_xx_xx_create_payments_table.php`

**✓ Done When:**

-   [ ] Both tables created with FK to invoices
-   [ ] Payment methods stored properly

---

#### TASK 4.1.3: Create Invoice Models

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `app/Models/Invoice.php`
-   `app/Models/InvoiceItem.php`
-   `app/Models/Payment.php`

**📄 Key Invoice Model Features:**

```php
protected static function boot()
{
    parent::boot();

    static::creating(function ($invoice) {
        $invoice->invoice_number = static::generateInvoiceNumber($invoice->business_id);
    });
}

public static function generateInvoiceNumber(int $businessId): string
{
    $date = now()->format('Ymd');
    $count = static::where('business_id', $businessId)
        ->whereDate('created_at', today())
        ->count() + 1;
    return sprintf('INV-%s-%04d', $date, $count);
}

public function isPaid(): bool
{
    return $this->balance_due <= 0;
}
```

**✓ Done When:**

-   [ ] Invoice number auto-generates on create
-   [ ] Relationships all work
-   [ ] Status casting to enum

---

### 4.2 Invoice Service

#### TASK 4.2.1: Create InvoiceService

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `app/Services/InvoiceService.php`

**📄 Key Methods:**

```php
public function createWithDeposit(array $data, float $depositAmount): Invoice
{
    return DB::transaction(function () use ($data, $depositAmount) {
        $invoice = Invoice::create([...$data, 'status' => InvoiceStatus::DEPOSIT_PAID]);

        $invoice->payments()->create([
            'amount' => $depositAmount,
            'payment_method' => $data['payment_method'],
            'received_by' => auth()->id(),
            'received_at' => now(),
        ]);

        $invoice->update([
            'amount_paid' => $depositAmount,
            'balance_due' => $invoice->total - $depositAmount,
        ]);

        JobCard::createFromInvoice($invoice);

        return $invoice;
    });
}

public function addPayment(Invoice $invoice, float $amount, string $method): Payment
{
    // Validate amount doesn't exceed balance
    // Create payment record
    // Update invoice amounts
    // If fully paid, update status
}

public function complete(Invoice $invoice): void
{
    // Verify fully paid
    // Deduct stock for frames
    // Update status to completed
    // Set actual_pickup timestamp
}
```

**✓ Done When:**

-   [ ] createWithDeposit wraps in transaction
-   [ ] Job card auto-creates
-   [ ] Stock deducts on complete

---

### 4.3 POS Interface

#### TASK 4.3.1: Create POS Controller

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `app/Http/Controllers/Sales/POSController.php`

**📄 Methods:**

-   `index()` - POS main view
-   `searchProducts()` - API for product search
-   `createInvoice()` - Process checkout
-   `applyDiscount()` - Calculate discounts

**✓ Done When:**

-   [ ] Product search returns frames, lenses, CL stock
-   [ ] Invoice creation works with items

---

#### TASK 4.3.2: Create POS React Page

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `resources/js/Pages/Sales/POS/Index.tsx`
-   `resources/js/Layouts/POSLayout.tsx`

**📝 Layout:**

-   Full screen (no sidebar)
-   Left: Product search & grid
-   Right: Cart and customer selection
-   Bottom: Totals and payment button

**✓ Done When:**

-   [ ] Clean POS interface
-   [ ] Touch-friendly buttons (44x44px minimum)
-   [ ] Keyboard shortcuts work

---

#### TASK 4.3.3: Create POS Components

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `resources/js/Components/POS/ProductSearch.tsx`
-   `resources/js/Components/POS/ProductGrid.tsx`
-   `resources/js/Components/POS/Cart.tsx`
-   `resources/js/Components/POS/CartItem.tsx`
-   `resources/js/Components/POS/CustomerSelector.tsx`
-   `resources/js/Components/POS/PrescriptionSelector.tsx`
-   `resources/js/Components/POS/PaymentModal.tsx`

**✓ Done When:**

-   [ ] Product search works with barcode
-   [ ] Cart calculates correctly
-   [ ] Discount applies (fixed/percentage)
-   [ ] Payment modal handles split payments

---

### 4.4 Invoice Management

#### TASK 4.4.1: Create Invoice Controller & Pages

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `app/Http/Controllers/Sales/InvoiceController.php`
-   `resources/js/Pages/Sales/Invoices/Index.tsx`
-   `resources/js/Pages/Sales/Invoices/Show.tsx`

**📝 Index Features:**

-   Filter by status (tabs)
-   Date range picker
-   Search by invoice number, customer
-   Status badges

**📝 Show Features:**

-   Full invoice details
-   Payment history
-   Add payment button
-   Status action buttons
-   Print options

**✓ Done When:**

-   [ ] Status filtering works
-   [ ] Can add additional payments
-   [ ] Status transitions work correctly

---

### 4.5 Print Templates

#### TASK 4.5.1: Create Print Templates

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `resources/views/prints/receipt.blade.php` (80mm thermal)
-   `resources/views/prints/invoice.blade.php` (A4)
-   `resources/views/prints/job-card.blade.php` (NO PRICES)

**⚠️ CRITICAL:** Job card must NOT include any prices. Lab technicians should only see technical specs.

**✓ Done When:**

-   [ ] Thermal receipt fits 80mm width
-   [ ] A4 invoice looks professional
-   [ ] Job card has no price information

---

## 🟣 Phase 5: Lab Management (Week 9)

> **Goal:** Build job card system and lab workflow.  
> **Reference:** [plan.md Section 5.4.3](./plan.md#543-print-templates)

---

### 5.1 Job Cards

#### TASK 5.1.1: Create Job Cards Migration & Model

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `database/migrations/xxxx_xx_xx_create_job_cards_table.php`
-   `app/Models/JobCard.php`

**📄 Columns:**

-   `invoice_id` (one-to-one)
-   `job_number` (auto: JOB-YYYYMMDD-XXXX)
-   `status` enum (pending, in_progress, quality_check, completed)
-   `prescription_details` JSON snapshot
-   `frame_details` JSON snapshot
-   `lens_details` JSON snapshot
-   `special_instructions` text
-   `started_at`, `completed_at` timestamps
-   `completed_by` FK to users

**📄 Model Method:**

```php
public static function createFromInvoice(Invoice $invoice): self
{
    return static::create([
        'invoice_id' => $invoice->id,
        'business_id' => $invoice->business_id,
        'prescription_details' => $invoice->prescription?->toArray(),
        'frame_details' => $invoice->items->where('item_type', 'frame')->first()?->toArray(),
        'lens_details' => $invoice->items->where('item_type', 'lens')->first()?->toArray(),
    ]);
}
```

**✓ Done When:**

-   [ ] Job card auto-creates from invoice
-   [ ] Snapshots preserve data even if source changes

---

### 5.2 Lab Interface

#### TASK 5.2.1: Create Lab Controller & Pages

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `app/Http/Controllers/Lab/JobCardController.php`
-   `resources/js/Pages/Lab/JobCards/Index.tsx`
-   `resources/js/Pages/Lab/JobCards/Show.tsx`

**📝 Index Features:**

-   Status tabs or kanban view
-   Today's jobs highlighted
-   Time in queue display
-   Quick status update

**📝 Show Features:**

-   Full job details
-   Status update buttons
-   Time tracking
-   Print job card button

**⚠️ Role Restriction:** Lab technicians can ONLY view job cards and update status. No prices visible.

**✓ Done When:**

-   [ ] Job queue shows correct status groupings
-   [ ] Status updates work
-   [ ] No prices visible to lab role

---

#### TASK 5.2.2: Create Job Card Queue Component

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `resources/js/Components/Lab/JobCardQueue.tsx`
-   `resources/js/Components/Lab/JobCardItem.tsx`

**📝 Features:**

-   Compact card with key info
-   Status color coding
-   Time elapsed display
-   Click to view details

**✓ Done When:**

-   [ ] Queue updates in real-time (or refresh)
-   [ ] Status colors match design tokens

---

## ⚪ Phase 6: Reporting Module (Week 10)

> **Goal:** Build essential business reports.  
> **Reference:** [plan.md Section 5.5](./plan.md#55-reporting-module)

---

### 6.1 Report Controllers

#### TASK 6.1.1: Create Report Controller

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `app/Http/Controllers/Reports/ReportController.php`

**📄 Methods:**

-   `dashboard()` - Overview stats
-   `dailyRevenue()` - Today's sales
-   `monthlyRevenue()` - Monthly breakdown
-   `outstandingBalances()` - Aged receivables
-   `inventory()` - Stock reports
-   `staffPerformance()` - Sales by staff
-   `rxExpiry()` - Recall list

**✓ Done When:**

-   [ ] All report methods return correct data
-   [ ] Data scoped to business

---

### 6.2 Report Pages

#### TASK 6.2.1: Create Report Dashboard

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `resources/js/Pages/Reports/Index.tsx`
-   `resources/js/Pages/Reports/DailyRevenue.tsx`
-   `resources/js/Pages/Reports/MonthlyRevenue.tsx`
-   `resources/js/Pages/Reports/OutstandingBalances.tsx`
-   `resources/js/Pages/Reports/Inventory.tsx`
-   `resources/js/Pages/Reports/StaffPerformance.tsx`
-   `resources/js/Pages/Reports/RxExpiry.tsx`

**✓ Done When:**

-   [ ] All report pages display data correctly
-   [ ] Date filters work
-   [ ] Export to CSV works

---

#### TASK 6.2.2: Create Chart Components

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `resources/js/Components/Charts/LineChart.tsx`
-   `resources/js/Components/Charts/BarChart.tsx`
-   `resources/js/Components/Charts/PieChart.tsx`
-   `resources/js/Components/Charts/StatCard.tsx`

**🔧 Install:**

```bash
npm install recharts
```

**✓ Done When:**

-   [ ] Charts render with data
-   [ ] Responsive on different screen sizes
-   [ ] Use design token colors

---

## 🟤 Phase 7: White-Label & Polish (Week 11)

> **Goal:** Implement white-label customization and polish UI/UX.  
> **Reference:** [plan.md Section 10.4](./plan.md#104-white-label-requirements)

---

### 7.1 White-Label Settings

#### TASK 7.1.1: Implement White-Label Customization

-   [ ] **Status:** Not Started

**📁 Files to Modify:**

-   `app/Http/Controllers/Business/SettingsController.php`
-   `resources/js/Pages/Business/Settings/Index.tsx`

**📝 Features:**

-   Logo upload (login page, dashboard)
-   Favicon upload
-   Primary color picker
-   Footer text customization

**📄 Dynamic CSS Variables:**

```php
// In HandleInertiaRequests middleware
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'business' => fn() => $request->user()?->business,
        'branding' => fn() => [
            'primary_color' => $request->user()?->business?->primary_color ?? '#3b82f6',
            'logo_url' => $request->user()?->business?->logo_url,
        ],
    ]);
}
```

**✓ Done When:**

-   [ ] Logo displays on login and dashboard
-   [ ] Primary color overrides CSS variable
-   [ ] Changes reflect immediately

---

### 7.2 Performance Optimization

#### TASK 7.2.1: Optimize Database Queries

-   [ ] **Status:** Not Started

**📝 Actions:**

-   Review all controllers for N+1 queries
-   Add eager loading where missing
-   Add missing indexes
-   Implement caching for settings

**📄 Example Fix:**

```php
// Before (N+1)
$invoices = Invoice::all();
foreach ($invoices as $invoice) {
    echo $invoice->customer->name;
}

// After (Eager loaded)
$invoices = Invoice::with('customer')->get();
```

**✓ Done When:**

-   [ ] No N+1 queries in debug toolbar
-   [ ] Page loads under 500ms
-   [ ] Settings cached appropriately

---

### 7.3 UI Polish

#### TASK 7.3.1: Polish All UI Screens

-   [ ] **Status:** Not Started

**📝 Checklist:**

-   [ ] Loading states on all buttons
-   [ ] Skeleton loaders on data tables
-   [ ] Empty states for all lists
-   [ ] Error toasts on API failures
-   [ ] Success feedback on actions
-   [ ] Keyboard navigation works
-   [ ] Mobile responsive tested
-   [ ] RTL layout verified
-   [ ] Dark mode verified

**✓ Done When:**

-   [ ] All items in checklist verified
-   [ ] User testing feedback addressed

---

## ⬛ Phase 8: Testing & Documentation (Week 12)

> **Goal:** Comprehensive testing and documentation for CodeCanyon submission.  
> **Reference:** [plan.md Section 9 & 12](./plan.md#9-testing-strategy)

---

### 8.1 Feature Tests

#### TASK 8.1.1: Business Isolation Tests

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `tests/Feature/BusinessIsolationTest.php`

**📄 Test Cases:**

```php
public function test_user_cannot_see_other_business_customers()
{
    $businessA = Business::factory()->create();
    $businessB = Business::factory()->create();

    $user = User::factory()->for($businessA)->create();
    $customerB = Customer::factory()->for($businessB)->create();

    $this->actingAs($user)
        ->get(route('customers.show', $customerB))
        ->assertForbidden();
}
```

**✓ Done When:**

-   [ ] All isolation scenarios tested
-   [ ] Tests pass

---

#### TASK 8.1.2: Role Permission Tests

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `tests/Feature/RolePermissionTest.php`

**📄 Test Cases:**

-   Sales staff cannot edit prescriptions
-   Lab tech cannot see prices
-   Only owner can manage staff
-   Only super admin can create businesses

**✓ Done When:**

-   [ ] All role restrictions tested
-   [ ] Tests pass

---

#### TASK 8.1.3: Invoice Workflow Tests

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `tests/Feature/InvoiceWorkflowTest.php`

**📄 Test Cases:**

-   Create invoice with deposit
-   Status transitions correctly
-   Payment adds to amount_paid
-   Cannot overpay
-   Stock deducts on completion

**✓ Done When:**

-   [ ] Full workflow tested
-   [ ] Edge cases covered

---

### 8.2 Documentation

#### TASK 8.2.1: Create Installation Guide

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `docs/installation.md`

**📝 Contents:**

1. Server requirements
2. Download and extraction
3. Database setup
4. Environment configuration
5. Composer and npm install
6. Migration and seeding
7. First login instructions
8. Troubleshooting common issues

**✓ Done When:**

-   [ ] Fresh install tested following guide
-   [ ] No missing steps

---

#### TASK 8.2.2: Create User Guide

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `docs/user-guide.md`

**📝 Sections:**

-   Getting started
-   Dashboard overview
-   Customer management
-   Prescription entry
-   Point of sale
-   Invoice management
-   Lab workflow
-   Reports
-   Settings

**✓ Done When:**

-   [ ] Screenshots included
-   [ ] All features documented

---

#### TASK 8.2.3: Create Changelog

-   [ ] **Status:** Not Started

**📁 Files to Create:**

-   `CHANGELOG.md`

**📄 Format:**

```markdown
# Changelog

## [1.0.0] - 2024-XX-XX

### Added

-   Initial release
-   Customer management module
-   Prescription management (spectacle & CL)
-   Frame inventory with barcode support
-   Lens catalog
-   Point of sale system
-   Invoice management with split payments
-   Lab job card system
-   Reports dashboard
-   Multi-tenant architecture
-   Role-based access control
-   Multi-language support (EN, AR, FR, ES)
-   Dark/light mode
-   White-label branding
```

**✓ Done When:**

-   [ ] All v1.0 features listed
-   [ ] Format matches CodeCanyon standards

---

## 🏁 Phase 9: CodeCanyon Submission (Week 13)

> **Goal:** Prepare and submit to CodeCanyon for approval.  
> **Reference:** [plan.md Section 10.3](./plan.md#103-codecanyon-package)

---

### 9.1 Pre-Submission Checklist

#### TASK 9.1.1: Code Cleanup

-   [ ] **Status:** Not Started

**📝 Checklist:**

-   [ ] Remove all `console.log` statements
-   [ ] Remove all `dd()` and `dump()` calls
-   [ ] Run `php artisan optimize:clear`
-   [ ] Verify `.env.example` is complete
-   [ ] No hardcoded credentials
-   [ ] No test data in seeders

**🔧 Commands:**

```bash
# Find debug statements
grep -r "console.log" resources/js/
grep -r "dd(" app/
grep -r "dump(" app/

# Clear all caches
php artisan optimize:clear
```

**✓ Done When:**

-   [ ] No debug statements found
-   [ ] Env example has all variables

---

### 9.2 Package Preparation

#### TASK 9.2.1: Create Package Structure

-   [ ] **Status:** Not Started

**📁 Create Package:**

```
optical-shop-manager/
├── source-code/           # Full Laravel project (zipped)
├── documentation/
│   ├── index.html         # Table of contents
│   ├── installation.html
│   ├── user-guide.html
│   ├── changelog.html
│   └── support.html
├── assets/
│   ├── preview.png        # Main preview (590x300)
│   ├── screenshots/       # All UI screenshots
│   └── logo.png
└── README.txt
```

**✓ Done When:**

-   [ ] All files in correct structure
-   [ ] Documentation in HTML format
-   [ ] Screenshots high quality

---

#### TASK 9.2.2: Create Screenshots

-   [ ] **Status:** Not Started

**📝 Required Screenshots:**

1. Login page
2. Dashboard (light mode)
3. Dashboard (dark mode)
4. Customer list
5. Prescription form
6. POS interface
7. Invoice detail
8. Job card queue
9. Reports dashboard
10. Mobile view

**✓ Done When:**

-   [ ] All screenshots taken
-   [ ] Consistent styling across all
-   [ ] Light and dark mode represented

---

### 9.3 Submission

#### TASK 9.3.1: Submit to CodeCanyon

-   [ ] **Status:** Not Started

**📝 Submission Contents:**

-   Product name
-   Category: PHP Scripts > Project Management Tools
-   Description (features, requirements, changelog)
-   Tags: optical, eyewear, POS, prescription, inventory
-   Preview image
-   Demo URL (optional but recommended)
-   Support policy

**✓ Done When:**

-   [ ] Submission uploaded
-   [ ] All fields complete
-   [ ] Preview image looks professional

---

#### TASK 9.3.2: Address Reviewer Feedback

-   [ ] **Status:** Not Started

**📝 Common Rejection Reasons:**

-   Missing documentation
-   Security vulnerabilities
-   Hard rejection: Code quality issues
-   Soft rejection: Minor fixes needed

**✓ Done When:**

-   [ ] Item approved
-   [ ] Live on CodeCanyon! 🎉

---

## 📝 Notes Section

Use this area to track blockers, questions, or decisions during development:

### Blockers

-

### Questions for Stakeholders

-

### Technical Decisions Made

-

### Lessons Learned

-   ***

## 📊 Final Progress Summary

| Phase       | Description           | Status |
| ----------- | --------------------- | ------ |
| **Phase 0** | Project Foundation    | ✅     |
| **Phase 1** | Core Infrastructure   | 🟨     |
| **Phase 2** | Customer & Clinical   | ⬜     |
| **Phase 3** | Inventory Module      | ⬜     |
| **Phase 4** | POS & Invoicing       | ⬜     |
| **Phase 5** | Lab Management        | ⬜     |
| **Phase 6** | Reporting Module      | ⬜     |
| **Phase 7** | White-Label & Polish  | ⬜     |
| **Phase 8** | Testing & Docs        | ⬜     |
| **Phase 9** | CodeCanyon Submission | ⬜     |

**Legend:** ⬜ Not Started | 🟨 In Progress | ✅ Complete

---

> **Last Updated:** December 2024  
> **Document Owner:** Development Team  
> **Total Estimated Time:** 13 weeks
