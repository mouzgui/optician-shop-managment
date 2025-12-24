import React from "react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { Search, Plus, Eye, Pencil, User, Phone, Calendar } from "lucide-react";
import { debounce } from "lodash";
import { DataTable } from "@/Components/UI/DataTable";
import { Button } from "@/Components/UI/Button";
import { Card } from "@/Components/UI/Card";
import { Badge } from "@/Components/UI/Badge";

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
        meta: any;
    };
    filters: {
        search?: string;
    };
}

export default function Index({ customers, filters }: Props) {
    const { t } = useTranslation();

    const handleSearch = debounce((value: string) => {
        router.get(
            route("business.customers.index"),
            { search: value },
            { preserveState: true, replace: true }
        );
    }, 300);

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
            header: t("common.actions"),
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
                    <Link href={route("business.customers.create")}>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            {t("customers.create_button")}
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title={t("customers.title")} />

            <div className="space-y-6">
                <Card className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                        <input
                            type="text"
                            defaultValue={filters.search}
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
