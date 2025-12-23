import React from "react";
import { Head } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";

interface DashboardProps {
    stats: {
        todaySales: number;
        pendingPickups: number;
        customersCount: number;
    };
    recentInvoices: any[];
}

export default function Dashboard({ stats, recentInvoices }: DashboardProps) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout>
            <Head title={t("business.dashboard.title")} />

            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-text-primary">
                    {t("business.dashboard.welcome")}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-bg-primary rounded-xl border border-border-subtle shadow-sm">
                        <h3 className="text-sm font-medium text-text-secondary">
                            {t("business.dashboard.today_sales")}
                        </h3>
                        <p className="mt-2 text-3xl font-bold text-text-primary">
                            {stats.todaySales}
                        </p>
                    </div>

                    <div className="p-6 bg-bg-primary rounded-xl border border-border-subtle shadow-sm">
                        <h3 className="text-sm font-medium text-text-secondary">
                            {t("business.dashboard.pending_pickups")}
                        </h3>
                        <p className="mt-2 text-3xl font-bold text-text-primary">
                            {stats.pendingPickups}
                        </p>
                    </div>

                    <div className="p-6 bg-bg-primary rounded-xl border border-border-subtle shadow-sm">
                        <h3 className="text-sm font-medium text-text-secondary">
                            {t("business.dashboard.total_customers")}
                        </h3>
                        <p className="mt-2 text-3xl font-bold text-text-primary">
                            {stats.customersCount}
                        </p>
                    </div>
                </div>

                <div className="bg-bg-primary rounded-xl border border-border-subtle shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-text-primary mb-4">
                        {t("business.dashboard.recent_invoices")}
                    </h2>
                    {recentInvoices.length === 0 ? (
                        <p className="text-text-secondary text-sm italic">
                            {t("common.noResults")}
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            {/* Table would go here */}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
