import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";
import { Button } from "@/Components/UI/Button";
import { Badge } from "@/Components/UI/Badge";
import { Card } from "@/Components/UI/Card";
import { DataTable } from "@/Components/UI/DataTable";
import { Plus, Building2, Edit2, Search, CheckCircle, XCircle, Users, TrendingUp } from "lucide-react";

interface Business {
    id: number;
    name: string;
    is_active: boolean;
    created_at?: string;
    branches_count?: number;
    staff_count?: number;
    owner?: {
        name: string;
        email: string;
    };
}

interface IndexProps {
    businesses: {
        data: Business[];
        links?: any;
        meta?: any;
    };
    filters?: {
        search?: string;
        status?: string;
    };
    stats?: {
        total: number;
        active: number;
        inactive: number;
        newThisMonth: number;
    };
}

export default function Index({ businesses, filters = {}, stats }: IndexProps) {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState(filters?.search || "");
    const [activeStatus, setActiveStatus] = useState(filters?.status || "all");

    const businessList = businesses?.data || [];

    const handleSearch = (value: string) => {
        setSearchValue(value);
        setTimeout(() => {
            router.get(
                "/admin/businesses",
                { search: value, status: activeStatus !== "all" ? activeStatus : undefined },
                { preserveState: true, replace: true }
            );
        }, 300);
    };

    const handleStatusFilter = (status: string) => {
        setActiveStatus(status);
        router.get(
            "/admin/businesses",
            { search: searchValue, status: status !== "all" ? status : undefined },
            { preserveState: true }
        );
    };

    const calculatedStats = {
        total: stats?.total || businessList.length,
        active: stats?.active || businessList.filter(b => b.is_active).length,
        inactive: stats?.inactive || businessList.filter(b => !b.is_active).length,
        newThisMonth: stats?.newThisMonth || 0,
    };

    const statusTabs = [
        { key: "all", label: "All Businesses" },
        { key: "active", label: "Active" },
        { key: "inactive", label: "Inactive" },
    ];

    const columns: any[] = [
        {
            header: t("admin.businesses.fields.name"),
            accessor: (business: Business) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-default/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary-default" />
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-text-primary">
                            {business.name}
                        </span>
                        {business.created_at && (
                            <p className="text-xs text-text-muted">
                                Created {new Date(business.created_at).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            header: t("admin.businesses.fields.owner"),
            accessor: (business: Business) => (
                <div>
                    <div className="text-sm text-text-primary">
                        {business.owner?.name || "N/A"}
                    </div>
                    <div className="text-xs text-text-muted">
                        {business.owner?.email || ""}
                    </div>
                </div>
            ),
        },
        {
            header: "Stats",
            accessor: (business: Business) => (
                <div className="flex items-center gap-3 text-sm">
                    {business.branches_count !== undefined && (
                        <span className="text-text-muted">
                            {business.branches_count} branches
                        </span>
                    )}
                    {business.staff_count !== undefined && (
                        <span className="text-text-muted">
                            {business.staff_count} staff
                        </span>
                    )}
                    {business.branches_count === undefined && business.staff_count === undefined && (
                        <span className="text-text-muted">—</span>
                    )}
                </div>
            ),
        },
        {
            header: t("admin.businesses.fields.status"),
            accessor: (business: Business) => (
                <Badge variant={business.is_active ? "success" : "danger"}>
                    {business.is_active
                        ? t("common.status.active")
                        : t("common.status.inactive")}
                </Badge>
            ),
        },
        {
            header: t("common.actions.title"),
            accessor: (business: Business) => (
                <div className="flex justify-end">
                    <Link href={`/admin/businesses/${business.id}/edit`}>
                        <Button variant="secondary" size="sm">
                            <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={t("admin.businesses.index.title")} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">
                            {t("admin.businesses.index.title")}
                        </h1>
                        <p className="text-text-muted text-sm mt-1">
                            Manage all businesses on the platform
                        </p>
                    </div>
                    <Link href="/admin/businesses/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            {t("admin.businesses.index.create_btn")}
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 border-l-4 border-l-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Total</p>
                                <p className="text-2xl font-bold text-text-primary mt-1">
                                    {calculatedStats.total}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Active</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                                    {calculatedStats.active}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Inactive</p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                                    {calculatedStats.inactive}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-amber-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">New This Month</p>
                                <p className="text-2xl font-bold text-text-primary mt-1">
                                    {calculatedStats.newThisMonth}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Status Filter Tabs */}
                <Card className="p-2">
                    <div className="flex flex-wrap gap-2">
                        {statusTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleStatusFilter(tab.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeStatus === tab.key
                                    ? "bg-primary-default text-white"
                                    : "bg-bg-subtle text-text-muted hover:bg-bg-subtle/80 hover:text-text-primary"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Search */}
                <Card className="p-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search businesses..."
                            className="w-full ps-10 pe-4 py-2 bg-bg-base border border-border-default rounded-lg focus:ring-2 focus:ring-interactive-primary focus:border-transparent transition-all"
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </Card>

                {/* Table */}
                <Card className="overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={businessList}
                        keyField="id"
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
