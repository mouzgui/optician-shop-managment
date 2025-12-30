import React, { useState } from "react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import {
    Search,
    Plus,
    Eye,
    Pencil,
    User,
    Phone,
    Calendar,
    FileText,
    Trash2,
    Users,
    UserPlus,
    History,
} from "lucide-react";
import { DataTable } from "@/Components/UI/DataTable";
import { Button } from "@/Components/UI/Button";
import { Card } from "@/Components/UI/Card";
import { Badge } from "@/Components/UI/Badge";
import { StatCard } from "@/Components/Charts/StatCard";
import { exportToCSV } from "@/Utils/csvExport";

interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    email: string | null;
    last_visit_at: string | null;
    branch: {
        id: number;
        name: string;
    } | null;
}

interface Props {
    customers: {
        data: Customer[];
        links: any[];
        meta?: any;
    };
    filters: {
        search?: string;
    };
}

export default function Index({ customers, filters }: Props) {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState(filters?.search || "");

    const handleSearch = (value: string) => {
        setSearchValue(value);
        // Simple timeout instead of lodash debounce
        const timeoutId = setTimeout(() => {
            router.get(
                route("business.customers.index"),
                { search: value },
                { preserveState: true, replace: true }
            );
        }, 300);
        return () => clearTimeout(timeoutId);
    };

    const handleDelete = (id: number) => {
        if (confirm(t("common.confirm_delete"))) {
            router.delete(route("business.customers.destroy", id));
        }
    };

    const handleExportCSV = () => {
        const headers = [
            t("customers.fields.name"),
            t("customers.fields.phone"),
            t("customers.fields.email"),
            t("customers.fields.branch"),
            t("customers.fields.last_visit"),
        ];

        const data = customers.data.map((item) => [
            `${item.first_name} ${item.last_name}`,
            item.phone,
            item.email || "-",
            item.branch?.name || "-",
            item.last_visit_at
                ? new Date(item.last_visit_at).toLocaleDateString()
                : "-",
        ]);

        exportToCSV(data, "customers-report", headers);
    };

    const columns = [
        {
            header: t("customers.fields.name"),
            accessor: (item: Customer) => (
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-bg-subtle rounded-full flex items-center justify-center border border-border-subtle">
                        <User className="h-5 w-5 text-text-muted" />
                    </div>
                    <div className="ms-4">
                        <div className="text-sm font-medium text-text-primary group-hover:text-interactive-primary transition-colors">
                            {item.first_name} {item.last_name}
                        </div>
                        <div className="text-sm text-text-muted">
                            {item.email}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: t("customers.fields.phone"),
            accessor: (item: Customer) => (
                <div className="flex items-center text-sm text-text-primary">
                    <Phone className="h-4 w-4 me-2 text-text-muted" />
                    {item.phone}
                </div>
            ),
        },
        {
            header: t("customers.fields.branch"),
            accessor: (item: Customer) => (
                <Badge variant="info">
                    {item.branch?.name || t("common.none")}
                </Badge>
            ),
        },
        {
            header: t("customers.fields.last_visit"),
            accessor: (item: Customer) => (
                <div className="flex items-center text-sm text-text-primary">
                    <Calendar className="h-4 w-4 me-2 text-text-muted" />
                    {item.last_visit_at
                        ? new Date(item.last_visit_at).toLocaleDateString()
                        : t("common.never")}
                </div>
            ),
        },
        {
            header: t("common.actions.title"),
            accessor: (item: Customer) => (
                <div className="flex justify-end gap-2">
                    <Link href={route("business.customers.show", item.id)}>
                        <Button variant="secondary" size="sm">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={route("business.customers.edit", item.id)}>
                        <Button variant="secondary" size="sm">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black text-text-primary tracking-tight">
                        {t("customers.title")}
                    </h2>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={handleExportCSV}>
                            <FileText className="h-5 w-5 me-2" />
                            {t("common.export_csv")}
                        </Button>
                        <Link href={route("business.customers.create")}>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                {t("customers.create_button")}
                            </Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={t("customers.title")} />

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title={t("customers.stats.total")}
                        value={customers.meta?.total || customers.data.length}
                        icon={Users}
                        color="primary"
                    />
                    <StatCard
                        title={t("customers.stats.new_this_month")}
                        value={
                            customers.data.filter((c) => {
                                const date = c.last_visit_at
                                    ? new Date(c.last_visit_at)
                                    : null;
                                return (
                                    date &&
                                    date.getMonth() === new Date().getMonth()
                                );
                            }).length
                        }
                        icon={UserPlus}
                        color="success"
                    />
                    <StatCard
                        title={t("customers.stats.recent_visits")}
                        value={
                            customers.data.filter((c) => c.last_visit_at).length
                        }
                        icon={History}
                        color="info"
                    />
                </div>

                <Card className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder={t("customers.search_placeholder")}
                            className="w-full pl-10 pr-4 py-2 bg-bg-base border border-border-default rounded-lg focus:ring-2 focus:ring-interactive-primary focus:border-transparent transition-all"
                        />
                    </div>
                </Card>

                <Card>
                    <DataTable
                        columns={columns}
                        data={customers.data}
                        meta={customers.meta}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
