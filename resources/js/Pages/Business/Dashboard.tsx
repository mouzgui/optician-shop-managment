import React from "react";
import { Head } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";
import { Card } from "@/Components/UI/Card";
import { TrendingUp, Clock, Users } from "lucide-react";

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
                    <Card className="p-6 transition-all hover:shadow-md group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary-default/10 flex items-center justify-center group-hover:bg-primary-default/20 transition-colors">
                                <TrendingUp className="w-6 h-6 text-primary-default" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-text-secondary">
                                    {t("business.dashboard.today_sales")}
                                </h3>
                                <p className="text-3xl font-bold text-text-primary mt-0.5">
                                    {stats.todaySales}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 transition-all hover:shadow-md group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-status-warning-bg flex items-center justify-center group-hover:opacity-80 transition-opacity">
                                <Clock className="w-6 h-6 text-status-warning-text" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-text-secondary">
                                    {t("business.dashboard.pending_pickups")}
                                </h3>
                                <p className="text-3xl font-bold text-text-primary mt-0.5">
                                    {stats.pendingPickups}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 transition-all hover:shadow-md group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-interactive-primary/10 flex items-center justify-center group-hover:bg-interactive-primary/20 transition-colors">
                                <Users className="w-6 h-6 text-interactive-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-text-secondary">
                                    {t("business.dashboard.total_customers")}
                                </h3>
                                <p className="text-3xl font-bold text-text-primary mt-0.5">
                                    {stats.customersCount}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card title={t("business.dashboard.recent_invoices")}>
                    {recentInvoices.length === 0 ? (
                        <p className="text-text-secondary text-sm italic py-4">
                            {t("common.noResults")}
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            {/* Table would go here */}
                        </div>
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
