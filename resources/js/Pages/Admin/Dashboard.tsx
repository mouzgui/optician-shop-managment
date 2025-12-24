import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";
import { Card } from "@/Components/UI/Card";
import { Building2, CheckCircle2, Users } from "lucide-react";

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
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">
                        {t("admin.dashboard.welcome")}
                    </h1>
                    <p className="text-text-muted mt-1">
                        {t("admin.dashboard.subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 transition-all hover:shadow-md group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary-default/10 flex items-center justify-center group-hover:bg-primary-default/20 transition-colors">
                                <Building2 className="w-6 h-6 text-primary-default" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-text-secondary">
                                    {t("admin.dashboard.total_businesses")}
                                </h3>
                                <p className="text-3xl font-bold text-text-primary mt-0.5">
                                    {stats.totalBusinesses}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 transition-all hover:shadow-md group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-status-success-bg flex items-center justify-center group-hover:opacity-80 transition-opacity">
                                <CheckCircle2 className="w-6 h-6 text-status-success-text" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-text-secondary">
                                    {t("admin.dashboard.active_businesses")}
                                </h3>
                                <p className="text-3xl font-bold text-text-primary mt-0.5">
                                    {stats.activeBusinesses}
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
                                    {t("admin.dashboard.total_users")}
                                </h3>
                                <p className="text-3xl font-bold text-text-primary mt-0.5">
                                    {stats.totalUsers}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
