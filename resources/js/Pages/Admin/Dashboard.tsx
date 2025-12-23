import React from "react";
import { Head } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";

interface DashboardProps {
    stats: {
        totalBusinesses: number;
        activeBusinesses: number;
        totalUsers: number;
    };
}

export default function Dashboard({ stats }: DashboardProps) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout>
            <Head title={t("admin.dashboard.title")} />

            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-text-primary">
                    {t("admin.dashboard.welcome")}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-bg-primary rounded-xl border border-border-subtle shadow-sm">
                        <h3 className="text-sm font-medium text-text-secondary">
                            {t("admin.dashboard.total_businesses")}
                        </h3>
                        <p className="mt-2 text-3xl font-bold text-text-primary">
                            {stats.totalBusinesses}
                        </p>
                    </div>

                    <div className="p-6 bg-bg-primary rounded-xl border border-border-subtle shadow-sm">
                        <h3 className="text-sm font-medium text-text-secondary">
                            {t("admin.dashboard.active_businesses")}
                        </h3>
                        <p className="mt-2 text-3xl font-bold text-text-primary">
                            {stats.activeBusinesses}
                        </p>
                    </div>

                    <div className="p-6 bg-bg-primary rounded-xl border border-border-subtle shadow-sm">
                        <h3 className="text-sm font-medium text-text-secondary">
                            {t("admin.dashboard.total_users")}
                        </h3>
                        <p className="mt-2 text-3xl font-bold text-text-primary">
                            {stats.totalUsers}
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
