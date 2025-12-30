import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import {
    LayoutDashboard,
    Building2,
    Users,
    Package,
    ShoppingCart,
    FileText,
    FlaskConical,
    BarChart3,
    Settings,
    GitBranch,
    UserCog,
    Glasses,
    Eye
} from "lucide-react";

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    href: string;
}

// Super Admin menu
const adminMenuItems: MenuItem[] = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "nav.dashboard", href: "/admin/dashboard" },
    { icon: <Building2 className="w-5 h-5" />, label: "nav.businesses", href: "/admin/businesses" },
];

// Business Owner menu - full access
const businessOwnerMenuItems: MenuItem[] = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "nav.dashboard", href: "/business/dashboard" },
    { icon: <GitBranch className="w-5 h-5" />, label: "nav.branches", href: "/business/branches" },
    { icon: <UserCog className="w-5 h-5" />, label: "nav.staff", href: "/business/staff" },
    { icon: <Users className="w-5 h-5" />, label: "nav.customers", href: "/business/customers" },
    { icon: <Glasses className="w-5 h-5" />, label: "nav.frames", href: "/business/inventory/frames" },
    { icon: <Eye className="w-5 h-5" />, label: "nav.lenses", href: "/business/inventory/lenses" },
    { icon: <Package className="w-5 h-5" />, label: "nav.contact_lenses", href: "/business/inventory/contact-lenses" },
    { icon: <ShoppingCart className="w-5 h-5" />, label: "nav.pos", href: "/business/sales/pos" },
    { icon: <FileText className="w-5 h-5" />, label: "nav.invoices", href: "/business/sales/invoices" },
    { icon: <FlaskConical className="w-5 h-5" />, label: "nav.lab", href: "/business/lab/job-cards" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "nav.reports", href: "/business/reports" },
    { icon: <Settings className="w-5 h-5" />, label: "nav.settings", href: "/business/settings" },
];

// Staff menu - limited access
const staffMenuItems: MenuItem[] = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "nav.dashboard", href: "/business/dashboard" },
    { icon: <Users className="w-5 h-5" />, label: "nav.customers", href: "/business/customers" },
    { icon: <Glasses className="w-5 h-5" />, label: "nav.frames", href: "/business/inventory/frames" },
    { icon: <Eye className="w-5 h-5" />, label: "nav.lenses", href: "/business/inventory/lenses" },
    { icon: <ShoppingCart className="w-5 h-5" />, label: "nav.pos", href: "/business/sales/pos" },
    { icon: <FileText className="w-5 h-5" />, label: "nav.invoices", href: "/business/sales/invoices" },
    { icon: <FlaskConical className="w-5 h-5" />, label: "nav.lab", href: "/business/lab/job-cards" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "nav.reports", href: "/business/reports" },
];

export function Sidebar() {
    const { t } = useTranslation();
    const { url, props } = usePage<any>();
    const branding = props.branding;
    const user = props.auth?.user;
    const userRole = user?.role || "";

    // Select menu based on user role
    let menuItems: MenuItem[] = [];
    if (userRole === "super_admin") {
        menuItems = adminMenuItems;
    } else if (userRole === "business_owner") {
        menuItems = businessOwnerMenuItems;
    } else {
        // sales_staff, optometrist, lab_technician all get staff menu
        menuItems = staffMenuItems;
    }

    return (
        <aside className="w-64 bg-nav-bg border-e border-border-default flex flex-col h-screen sticky top-0 shrink-0">
            <div className="h-16 flex items-center px-6 border-b border-border-default">
                {branding?.logo_url ? (
                    <img
                        src={branding.logo_url}
                        alt="Logo"
                        className="h-8 w-auto"
                    />
                ) : (
                    <span className="text-xl font-bold text-interactive-primary">
                        👓 OptiManager
                    </span>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = url.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive
                                ? "bg-nav-item-active text-nav-item-active-text"
                                : "text-text-secondary hover:bg-nav-item-hover hover:text-text-primary"
                                }`}
                        >
                            <span className={`${isActive ? "text-interactive-primary" : ""}`}>
                                {item.icon}
                            </span>
                            <span className="font-medium">{t(item.label)}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border-default">
                <div className="px-3 py-2 mb-2 text-xs text-text-muted">
                    {user?.name} • {t(`roles.${userRole}`)}
                </div>
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-status-error-text hover:bg-status-error-bg/10 transition-colors"
                >
                    <span className="text-xl">🚪</span>
                    <span className="font-medium">{t("auth.logout")}</span>
                </Link>
            </div>
        </aside>
    );
}
