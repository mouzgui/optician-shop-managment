import React from "react";
import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

const menuItems = [
    { icon: "📊", label: "nav.dashboard", href: "/dashboard" },
    { icon: "👥", label: "nav.customers", href: "/customers" },
    { icon: "📝", label: "nav.prescriptions", href: "/prescriptions" },
    { icon: "📦", label: "nav.inventory", href: "/inventory" },
    { icon: "💰", label: "nav.pos", href: "/pos" },
    { icon: "📄", label: "nav.invoices", href: "/invoices" },
    { icon: "🧪", label: "nav.lab", href: "/lab" },
    { icon: "📈", label: "nav.reports", href: "/reports" },
    { icon: "⚙️", label: "nav.settings", href: "/settings" },
];

export function Sidebar() {
    const { t } = useTranslation();

    return (
        <aside className="w-64 bg-bg-base border-e border-border-default flex flex-col fixed inset-y-0 z-20 transition-transform lg:static lg:translate-x-0 -translate-x-full">
            <div className="h-16 flex items-center px-6 border-b border-border-default">
                <span className="text-xl font-bold text-interactive-primary">
                    👓 OptiManager
                </span>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:bg-bg-subtle hover:text-text-primary transition-colors group"
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{t(item.label)}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-border-default">
                <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-status-error-text hover:bg-status-error-bg transition-colors">
                    <span className="text-xl">🚪</span>
                    <span className="font-medium">{t("auth.logout")}</span>
                </button>
            </div>
        </aside>
    );
}
