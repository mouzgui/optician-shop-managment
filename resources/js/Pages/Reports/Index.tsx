import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { StatCard } from "@/Components/Charts/StatCard";
import {
    DollarSign,
    TrendingUp,
    ClipboardList,
    AlertTriangle,
    BarChart3,
    Calendar,
    Users,
    Clock,
    ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
    stats: {
        today_sales: number;
        month_sales: number;
        today_payments: number;
        pending_jobs: number;
    };
}

export default function Index({ stats }: Props) {
    const { t, i18n } = useTranslation();
    const { business } = usePage().props as any;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(
            i18n.language === "ar" ? "ar-SA" : "en-US",
            {
                style: "currency",
                currency: business?.currency_code || "USD",
            }
        ).format(amount);
    };

    const reportLinks = [
        {
            title: t("reports.daily_revenue"),
            description: t("reports.daily_revenue_desc"),
            href: "/business/reports/daily-revenue",
            icon: Calendar,
            color: "blue",
        },
        {
            title: t("reports.monthly_revenue"),
            description: t("reports.monthly_revenue_desc"),
            href: "/business/reports/monthly-revenue",
            icon: BarChart3,
            color: "green",
        },
        {
            title: t("reports.outstanding_balances"),
            description: t("reports.outstanding_balances_desc"),
            href: "/business/reports/outstanding-balances",
            icon: AlertTriangle,
            color: "amber",
        },
        {
            title: t("reports.inventory_status"),
            description: t("reports.inventory_status_desc"),
            href: "/business/reports/inventory",
            icon: ClipboardList,
            color: "purple",
        },
        {
            title: t("reports.staff_performance"),
            description: t("reports.staff_performance_desc"),
            href: "/business/reports/staff-performance",
            icon: Users,
            color: "rose",
        },
        {
            title: t("reports.rx_expiry"),
            description: t("reports.rx_expiry_desc"),
            href: "/business/reports/rx-expiry",
            icon: Clock,
            color: "orange",
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={t("reports.title")} />

            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">
                        {t("reports.title")}
                    </h1>
                    <p className="text-text-muted">{t("reports.subtitle")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title={t("reports.stats.today_sales")}
                        value={formatCurrency(stats.today_sales)}
                        icon={DollarSign}
                        color="primary"
                    />
                    <StatCard
                        title={t("reports.stats.today_collections")}
                        value={formatCurrency(stats.today_payments)}
                        icon={TrendingUp}
                        color="success"
                    />
                    <StatCard
                        title={t("reports.stats.monthly_revenue")}
                        value={formatCurrency(stats.month_sales)}
                        icon={BarChart3}
                        color="info"
                    />
                    <StatCard
                        title={t("reports.stats.pending_jobs")}
                        value={stats.pending_jobs.toString()}
                        icon={ClipboardList}
                        color="warning"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reportLinks.map((link) => (
                        <Link
                            key={link.title}
                            href={link.href}
                            className="group bg-bg-primary border border-border-default rounded-xl p-6 hover:border-interactive-primary hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div
                                    className={`p-3 rounded-lg bg-bg-secondary text-interactive-primary group-hover:bg-interactive-primary/10 transition-colors`}
                                >
                                    <link.icon className="w-6 h-6" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-interactive-primary group-hover:translate-x-1 transition-all icon-flip" />
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-bold text-text-primary group-hover:text-interactive-primary transition-colors">
                                    {link.title}
                                </h3>
                                <p className="text-sm text-text-muted mt-1">
                                    {link.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
