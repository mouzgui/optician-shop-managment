import React from "react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Search, Filter, Plus, Eye } from "lucide-react";
import { DataTable } from "@/Components/UI/DataTable";
import { Badge } from "@/Components/UI/Badge";
import { Button } from "@/Components/UI/Button";
import { Card } from "@/Components/UI/Card";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";

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
    filters: {
        search?: string;
    };
}

export default function Index({ invoices, filters }: Props) {
    const { t } = useTranslation();

    const handleSearch = debounce((value: string) => {
        router.get(
            route("business.sales.invoices.index"),
            { search: value },
            { preserveState: true, replace: true }
        );
    }, 300);

    const getStatusVariant = (status: string): any => {
        const variants: Record<
            string,
            "info" | "warning" | "success" | "danger" | "neutral"
        > = {
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
            accessor: (item: Invoice) => (
                <span className="font-bold text-text-primary">
                    {item.total}
                </span>
            ),
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
                <div className="flex justify-end">
                    <Link href={route("business.sales.invoices.show", item.id)}>
                        <Button variant="secondary" size="sm">
                            <Eye className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={t("sales.invoices.title")} />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-text-primary tracking-tight">
                            {t("sales.invoices.title")}
                        </h1>
                        <p className="text-text-muted text-sm mt-1">
                            {t("sales.invoices.subtitle")}
                        </p>
                    </div>
                    <Link href={route("business.sales.pos.index")}>
                        <Button className="flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            {t("sales.invoices.new_sale")}
                        </Button>
                    </Link>
                </div>

                <Card className="p-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="text"
                            defaultValue={filters?.search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder={t("common.search")}
                            className="w-full ps-10 pe-4 py-2 bg-bg-base border border-border-default rounded-lg focus:ring-2 focus:ring-interactive-primary focus:border-transparent transition-all"
                        />
                    </div>
                </Card>

                <Card className="overflow-hidden border-none shadow-sm">
                    <DataTable
                        columns={columns}
                        data={invoices.data}
                        meta={invoices.meta}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
