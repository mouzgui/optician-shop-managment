import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";
import { Button } from "@/Components/UI/Button";
import { Badge } from "@/Components/UI/Badge";
import { Card } from "@/Components/UI/Card";
import { DataTable } from "@/Components/UI/DataTable";
import { Plus, Search, User, Mail, Shield, Edit2 } from "lucide-react";

interface Staff {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    branch?: {
        name: string;
    };
}

interface IndexProps {
    staff: {
        data: Staff[];
        links: any;
    };
    filters: {
        search?: string;
    };
}

export default function Index({ staff, filters }: IndexProps) {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState(filters?.search || "");

    const handleSearch = (value: string) => {
        setSearchValue(value);
        setTimeout(() => {
            router.get(
                "/business/staff",
                { search: value },
                { preserveState: true, replace: true }
            );
        }, 300);
    };

    const toggleStatus = (id: number) => {
        router.post(`/business/staff/${id}/toggle-status`);
    };

    const columns = [
        {
            header: t("business.staff.fields.name"),
            accessor: (member: Staff) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-default/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-default" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-text-primary">
                            {member.name}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-text-muted">
                            <Mail className="w-3 h-3" />
                            {member.email}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: t("business.staff.fields.role"),
            accessor: (member: Staff) => (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Shield className="w-3.5 h-3.5 text-text-muted" />
                    {t(`roles.${member.role}`)}
                </div>
            ),
        },
        {
            header: t("business.staff.fields.branch"),
            accessor: (member: Staff) => (
                <span className="text-sm text-text-secondary">
                    {member.branch?.name || "-"}
                </span>
            ),
        },
        {
            header: t("business.staff.fields.status"),
            accessor: (member: Staff) => (
                <button
                    onClick={() => toggleStatus(member.id)}
                    className="hover:opacity-80 transition-opacity"
                >
                    <Badge variant={member.is_active ? "success" : "danger"}>
                        {member.is_active
                            ? t("common.status.active")
                            : t("common.status.inactive")}
                    </Badge>
                </button>
            ),
        },
        {
            header: t("common.actions.title"),
            accessor: (member: Staff) => (
                <div className="flex justify-end gap-2">
                    <Link href={`/business/staff/${member.id}/edit`}>
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
            <Head title={t("business.staff.index.title")} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-text-primary tracking-tight">
                            {t("business.staff.index.title")}
                        </h1>
                        <p className="text-text-muted text-sm mt-1">
                            {t("business.staff.index.subtitle")}
                        </p>
                    </div>
                    <Button
                        href="/business/staff/create"
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        {t("business.staff.index.create_btn")}
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
                        data={staff.data}
                        meta={staff.links}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
