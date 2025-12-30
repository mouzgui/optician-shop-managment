import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";
import { Button } from "@/Components/UI/Button";
import { Badge } from "@/Components/UI/Badge";
import { Card } from "@/Components/UI/Card";
import { DataTable, Column } from "@/Components/UI/DataTable";
import {
    Plus,
    Search,
    MapPin,
    Phone,
    Edit2,
    Building2,
    CheckCircle,
    XCircle,
    Star,
    Eye,
} from "lucide-react";

interface Branch {
    id: number;
    name: string;
    address: string;
    phone: string;
    is_headquarters: boolean;
    is_active: boolean;
}

interface IndexProps {
    branches: {
        data: Branch[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
    };
    stats?: {
        total: number;
        active: number;
        inactive: number;
        headquarters: string;
    };
}

export default function Index({ branches, filters, stats }: IndexProps) {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState(filters?.search || "");

    const handleSearch = (value: string) => {
        setSearchValue(value);
        setTimeout(() => {
            router.get(
                "/business/branches",
                { search: value },
                { preserveState: true, replace: true }
            );
        }, 300);
    };

    const toggleStatus = (id: number) => {
        router.post(`/business/branches/${id}/toggle-status`);
    };

    const hqBranch = branches.data.find((b) => b.is_headquarters);

    const columns: Column<Branch>[] = [
        {
            header: t("business.branches.fields.name"),
            accessor: (branch: Branch) => (
                <div className="flex items-center gap-3">
                    <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            branch.is_headquarters
                                ? "bg-amber-100 dark:bg-amber-900/30"
                                : "bg-blue-100 dark:bg-blue-900/30"
                        }`}
                    >
                        {branch.is_headquarters ? (
                            <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        ) : (
                            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-text-primary">
                                {branch.name}
                            </span>
                            {branch.is_headquarters && (
                                <Badge variant="warning" size="sm">
                                    HQ
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-text-muted">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[200px]">
                                {branch.address}
                            </span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: t("business.branches.fields.contact"),
            accessor: (branch: Branch) => (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Phone className="w-4 h-4 text-text-muted" />
                    {branch.phone}
                </div>
            ),
        },
        {
            header: t("business.branches.fields.status"),
            accessor: (branch: Branch) => (
                <button
                    onClick={() => toggleStatus(branch.id)}
                    className="hover:opacity-80 transition-opacity"
                >
                    <Badge variant={branch.is_active ? "success" : "danger"}>
                        {branch.is_active
                            ? t("common.status.active")
                            : t("common.status.inactive")}
                    </Badge>
                </button>
            ),
        },
        {
            header: t("common.actions.title"),
            accessor: (branch: Branch) => (
                <div className="flex justify-end gap-2">
                    <Link href={`/business/branches/${branch.id}/edit`}>
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
            <Head title={t("business.branches.index.title")} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-text-primary tracking-tight">
                            {t("business.branches.index.title")}
                        </h1>
                        <p className="text-text-muted text-sm mt-1">
                            {t("business.branches.index.subtitle")}
                        </p>
                    </div>
                    <Link href="/business/branches/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            {t("business.branches.index.create_btn")}
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 border-l-4 border-l-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">
                                    Total Branches
                                </p>
                                <p className="text-2xl font-bold text-text-primary mt-1">
                                    {stats?.total || branches.data.length}
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
                                <p className="text-sm font-medium text-text-muted">
                                    Active
                                </p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                                    {stats?.active ||
                                        branches.data.filter((b) => b.is_active)
                                            .length}
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
                                <p className="text-sm font-medium text-text-muted">
                                    Inactive
                                </p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                                    {stats?.inactive ||
                                        branches.data.filter(
                                            (b) => !b.is_active
                                        ).length}
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
                                <p className="text-sm font-medium text-text-muted">
                                    Headquarters
                                </p>
                                <p className="text-lg font-bold text-text-primary mt-1 truncate">
                                    {stats?.headquarters ||
                                        hqBranch?.name ||
                                        "N/A"}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Search */}
                <Card className="p-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="text"
                            placeholder={t("common.search")}
                            className="w-full ps-10 pe-4 py-2 bg-bg-base border border-border-default rounded-lg focus:ring-2 focus:ring-interactive-primary focus:border-transparent transition-all"
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </Card>

                {/* Table */}
                <Card className="overflow-hidden border-none shadow-sm">
                    <DataTable<Branch>
                        columns={columns}
                        data={branches.data}
                        keyField="id"
                        meta={branches.meta}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
