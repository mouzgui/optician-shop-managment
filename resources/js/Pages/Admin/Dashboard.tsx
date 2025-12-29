import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";
import { Card } from "@/Components/UI/Card";
import { Button } from "@/Components/UI/Button";
import {
    Building2,
    CheckCircle2,
    Users,
    TrendingUp,
    DollarSign,
    AlertTriangle,
    Plus,
    BarChart3,
    ArrowRight
} from "lucide-react";

interface DashboardProps {
    stats: {
        totalBusinesses: number;
        activeBusinesses: number;
        totalUsers: number;
        totalRevenue?: number;
        pendingIssues?: number;
        newBusinessesThisMonth?: number;
    };
    recentBusinesses?: {
        id: number;
        name: string;
        is_active: boolean;
        created_at: string;
    }[];
}

export default function Dashboard({ stats, recentBusinesses = [] }: DashboardProps) {
    const { t } = useTranslation();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
        }).format(value);
    };

    const quickLinks = [
        {
            title: "Manage Businesses",
            description: "View and edit all businesses",
            href: "/admin/businesses",
            icon: Building2,
            color: "blue",
        },
        {
            title: "View Reports",
            description: "Access business analytics",
            href: "/admin/reports",
            icon: BarChart3,
            color: "green",
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={t("admin.dashboard.title")} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">
                            {t("admin.dashboard.welcome")}
                        </h1>
                        <p className="text-text-muted mt-1">
                            {t("admin.dashboard.subtitle")}
                        </p>
                    </div>
                    <Link href="/admin/businesses/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            New Business
                        </Button>
                    </Link>
                </div>

                {/* Primary Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-5 transition-all hover:shadow-md group border-l-4 border-l-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Total Businesses</p>
                                <p className="text-2xl font-bold text-text-primary mt-1">
                                    {stats.totalBusinesses}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 transition-all hover:shadow-md group border-l-4 border-l-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Active Businesses</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                                    {stats.activeBusinesses}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 transition-all hover:shadow-md group border-l-4 border-l-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Total Users</p>
                                <p className="text-2xl font-bold text-text-primary mt-1">
                                    {stats.totalUsers}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 transition-all hover:shadow-md group border-l-4 border-l-amber-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">New This Month</p>
                                <p className="text-2xl font-bold text-text-primary mt-1">
                                    {stats.newBusinessesThisMonth || 0}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Secondary Stats */}
                {(stats.totalRevenue !== undefined || stats.pendingIssues !== undefined) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stats.totalRevenue !== undefined && (
                            <Card className="p-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-text-muted">Total Platform Revenue</p>
                                        <p className="text-xl font-bold text-text-primary">
                                            {formatCurrency(stats.totalRevenue)}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {stats.pendingIssues !== undefined && (
                            <Card className="p-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-text-muted">Pending Issues</p>
                                        <p className="text-xl font-bold text-red-600 dark:text-red-400">
                                            {stats.pendingIssues}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                )}

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.title}
                            href={link.href}
                            className="group"
                        >
                            <Card className="p-5 hover:shadow-md transition-all hover:border-interactive-primary">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl bg-${link.color}-100 dark:bg-${link.color}-900/30 flex items-center justify-center`}>
                                            <link.icon className={`w-6 h-6 text-${link.color}-600 dark:text-${link.color}-400`} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-text-primary group-hover:text-interactive-primary transition-colors">
                                                {link.title}
                                            </h3>
                                            <p className="text-sm text-text-muted">
                                                {link.description}
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-interactive-primary group-hover:translate-x-1 transition-all" />
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Recent Businesses */}
                {recentBusinesses.length > 0 && (
                    <Card className="overflow-hidden">
                        <div className="p-4 border-b border-border-default flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                Recent Businesses
                            </h3>
                            <Link href="/admin/businesses">
                                <Button variant="secondary" size="sm">
                                    View All
                                </Button>
                            </Link>
                        </div>
                        <div className="divide-y divide-border-default">
                            {recentBusinesses.slice(0, 5).map((business) => (
                                <div key={business.id} className="p-4 flex items-center justify-between hover:bg-bg-subtle/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary-default/10 flex items-center justify-center">
                                            <Building2 className="w-5 h-5 text-primary-default" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-text-primary">{business.name}</p>
                                            <p className="text-xs text-text-muted">
                                                Created {new Date(business.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${business.is_active
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                        }`}>
                                        {business.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
