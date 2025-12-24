import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";
import { Button } from "@/Components/UI/Button";
import { Badge } from "@/Components/UI/Badge";
import { Card } from "@/Components/UI/Card";
import { DataTable } from "@/Components/UI/DataTable";
import { Plus, Search, MapPin, Phone, Edit2, Building2 } from "lucide-react";
import { debounce } from "lodash";

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
        links: any;
    };
    filters: {
        search?: string;
    };
}

export default function Index({ branches, filters }: IndexProps) {
    const { t } = useTranslation();

    const handleSearch = debounce((value: string) => {
        router.get(
            route("business.branches.index"),
            { search: value },
            { preserveState: true, replace: true }
        );
    }, 300);

    const toggleStatus = (id: number) => {
        router.post(route("business.branches.toggle-status", id));
    };

    const columns = [
        {
            header: t("business.branches.fields.name"),
            accessor: (branch: Branch) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-text-primary">
                            {branch.name}
                        </span>
                        {branch.is_headquarters && (
                            <Badge variant="info" size="sm">
                                {t("business.branches.fields.hq")}
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-text-muted">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">
                            {branch.address}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            header: t("business.branches.fields.contact"),
            accessor: (branch: Branch) => (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Phone className="w-3.5 h-3.5 text-text-muted" />
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
                    <Link href={route("business.branches.edit", branch.id)}>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                            {t("common.actions.edit")}
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-text-primary tracking-tight">
                            {t("business.branches.index.title")}
                        </h1>
                        <p className="text-text-muted text-sm mt-1">
                            {t("business.branches.index.subtitle")}
                        </p>
                    </div>
                    <Button
                        href={route("business.branches.create")}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        {t("business.branches.index.create_btn")}
                    </Button>
                </div>

                <Card className="p-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="text"
                            placeholder={t("common.search")}
                            className="w-full ps-10 pe-4 py-2 bg-bg-base border border-border-default rounded-lg focus:ring-2 focus:ring-interactive-primary focus:border-transparent transition-all"
                            defaultValue={filters?.search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </Card>

                <Card className="overflow-hidden border-none shadow-sm">
                    <DataTable
                        columns={columns}
                        data={branches.data}
                        meta={branches.links}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
