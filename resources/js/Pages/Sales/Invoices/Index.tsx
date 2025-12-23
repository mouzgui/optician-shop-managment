import React from "react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Search, Eye, Filter, Plus } from "lucide-react";
import Pagination from "@/Components/Pagination";
import { DataTable } from "@/Components/UI/DataTable";
import { Badge } from "@/Components/UI/Badge";
import { Button } from "@/Components/UI/Button";
import { Card } from "@/Components/UI/Card";
import { useTranslation } from "react-i18next";

interface Invoice {
    id: number;
    invoice_number: string;
    customer: {
        first_name: string;
        last_name: string;
    };
    branch: {
        name: string;
    };
    total: string;
    amount_paid: string;
    balance_due: string;
    status: string;
    created_at: string;
}

interface Props {
    invoices: {
        data: Invoice[];
        links: any[];
        meta: any;
    };
}

export default function Index({ invoices }: Props) {
    const { t } = useTranslation();

    const getStatusVariant = (status: string): any => {
        const variants: Record<string, string> = {
            deposit_paid: "info",
            in_lab: "warning",
            ready_pickup: "warning",
            completed: "success",
            cancelled: "danger",
        };
        return variants[status] || "neutral";
    };

    const columns = [
        {
            header: t("sales.invoices.fields.invoice_number"),
            accessor: (item: Invoice) => (
                <span className="font-medium text-text-primary">
                    {item.invoice_number}
                </span>
            ),
        },
        {
            header: t("sales.invoices.fields.customer"),
            accessor: (item: Invoice) =>
                `${item.customer.first_name} ${item.customer.last_name}`,
        },
        {
            header: t("sales.invoices.fields.date"),
            accessor: (item: Invoice) =>
                new Date(item.created_at).toLocaleDateString(),
        },
        {
            header: t("sales.invoices.fields.total"),
            accessor: (item: Invoice) => item.total,
        },
        {
            header: t("sales.invoices.fields.balance"),
            accessor: (item: Invoice) => (
                <span
                    className={
                        parseFloat(item.balance_due) > 0
                            ? "text-status-error-text font-medium"
                            : "text-status-success-text"
                    }
                >
                    {item.balance_due}
                </span>
            ),
        },
        {
            header: t("sales.invoices.fields.status"),
            accessor: (item: Invoice) => (
                <Badge variant={getStatusVariant(item.status)}>
                    {t(`sales.invoices.statuses.${item.status}`)}
                </Badge>
            ),
        },
        {
            header: t("common.actions"),
            accessor: (item: Invoice) => (
                <Link
                    href={route("business.sales.invoices.show", item.id)}
                    className="text-interactive-primary hover:text-interactive-hover flex items-center gap-1"
                >
                    <Eye className="w-4 h-4" />
                    {t("common.view")}
                </Link>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={t("sales.invoices.title")} />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-text-primary">
                        {t("sales.invoices.title")}
                    </h1>
                    <Button
                        as={Link}
                        href={route("business.sales.pos.index")}
                        icon={<Plus className="w-4 h-4" />}
                    >
                        {t("sales.invoices.new_sale")}
                    </Button>
                </div>

                <Card>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                            <input
                                type="text"
                                placeholder={t("sales.invoices.search_placeholder")}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border-border-default bg-bg-base text-text-primary focus:ring-border-focus focus:border-border-focus"
                            />
                        </div>
                        <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
                            {t("common.filters")}
                        </Button>
                    </div>

                    <DataTable
                        columns={columns}
                        data={invoices.data}
                        keyField="id"
                        emptyMessage={t("common.noResults")}
                    />

                    <div className="mt-6">
                        <Pagination links={invoices.links} />
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
