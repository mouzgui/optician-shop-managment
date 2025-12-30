import React, { useState } from "react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Search,
    Plus,
    Eye,
    DollarSign,
    Clock,
    CheckCircle,
    Truck,
    FileText,
} from "lucide-react";
import { StatCard } from "@/Components/Charts/StatCard";
import { exportToCSV } from "@/Utils/csvExport";
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
    filters: {
        search?: string;
        status?: string;
    };
    stats?: {
        totalRevenue: number;
        outstandingBalance: number;
        completedToday: number;
        pendingPickup: number;
        depositPaid: number;
        inLab: number;
    };
}

export default function Index({ invoices, filters, stats }: Props) {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState(filters?.search || "");
    const [activeStatus, setActiveStatus] = useState(filters?.status || "all");

    const handleSearch = (value: string) => {
        setSearchValue(value);
        setTimeout(() => {
            router.get(
                route("business.sales.invoices.index"),
                {
                    search: value,
                    status: activeStatus !== "all" ? activeStatus : undefined,
                },
                { preserveState: true, replace: true }
            );
        }, 300);
    };

    const handleStatusFilter = (status: string) => {
        setActiveStatus(status);
        router.get(
            route("business.sales.invoices.index"),
            {
                search: searchValue,
                status: status !== "all" ? status : undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleExportCSV = () => {
        const headers = [
            t("sales.invoices.fields.invoice_number"),
            t("sales.invoices.fields.customer"),
            t("sales.invoices.fields.date"),
            t("sales.invoices.fields.total"),
            t("sales.invoices.fields.balance"),
            t("sales.invoices.fields.status"),
        ];

        const data = invoices.data.map((item) => [
            item.invoice_number,
            `${item.customer?.first_name} ${item.customer?.last_name}`,
            new Date(item.created_at).toLocaleDateString(),
            item.total,
            item.balance_due,
            getStatusLabel(item.status),
        ]);

        exportToCSV(data, "invoices-list", headers);
    };

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

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            deposit_paid: "Deposit Paid",
            in_lab: "In Lab",
            ready_pickup: "Ready",
            completed: "Completed",
            cancelled: "Cancelled",
        };
        return labels[status] || status;
    };

    const formatCurrency = (value: number | string) => {
        const num = typeof value === "string" ? parseFloat(value) : value;
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
        }).format(num || 0);
    };

    const statusTabs = [
        { key: "all", label: "All", count: invoices.meta?.total },
        {
            key: "deposit_paid",
            label: "Deposit Paid",
            count: stats?.depositPaid,
        },
        { key: "in_lab", label: "In Lab", count: stats?.inLab },
        {
            key: "ready_pickup",
            label: "Ready for Pickup",
            count: stats?.pendingPickup,
        },
        { key: "completed", label: "Completed", count: stats?.completedToday },
    ];

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
            accessor: (item: Invoice) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-bg-subtle flex items-center justify-center text-sm font-medium text-text-muted">
                        {item.customer?.first_name?.[0]}
                        {item.customer?.last_name?.[0]}
                    </div>
                    <span className="text-sm">
                        {item.customer?.first_name} {item.customer?.last_name}
                    </span>
                </div>
            ),
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
                    {formatCurrency(item.total)}
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
                    {formatCurrency(item.balance_due)}
                </span>
            ),
        },
        {
            header: t("sales.invoices.fields.status"),
            accessor: (item: Invoice) => (
                <Badge variant={getStatusVariant(item.status)}>
                    {getStatusLabel(item.status)}
                </Badge>
            ),
        },
        {
            header: t("common.actions.title"),
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
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-text-primary tracking-tight">
                            {t("sales.invoices.title")}
                        </h1>
                        <p className="text-text-muted text-sm mt-1">
                            {t("sales.invoices.subtitle")}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={route("business.sales.pos")}>
                            <Button className="flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                {t("sales.invoices.new_sale")}
                            </Button>
                        </Link>
                        <Button
                            variant="secondary"
                            onClick={handleExportCSV}
                            className="flex items-center gap-2"
                        >
                            <FileText className="w-4 h-4" />
                            {t("common.actions.export")}
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 border-l-4 border-l-emerald-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">
                                    Total Revenue
                                </p>
                                <p className="text-xl font-bold text-text-primary mt-1">
                                    {formatCurrency(stats?.totalRevenue || 0)}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">
                                    Outstanding
                                </p>
                                <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">
                                    {formatCurrency(
                                        stats?.outstandingBalance || 0
                                    )}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-amber-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">
                                    Ready for Pickup
                                </p>
                                <p className="text-xl font-bold text-text-primary mt-1">
                                    {stats?.pendingPickup || 0}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <Truck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">
                                    Completed Today
                                </p>
                                <p className="text-xl font-bold text-text-primary mt-1">
                                    {stats?.completedToday || 0}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
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
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    activeStatus === tab.key
                                        ? "bg-primary-default text-white"
                                        : "bg-bg-subtle text-text-muted hover:bg-bg-subtle/80 hover:text-text-primary"
                                }`}
                            >
                                {tab.label}
                                {tab.count !== undefined && (
                                    <span
                                        className={`ms-2 px-2 py-0.5 rounded-full text-xs ${
                                            activeStatus === tab.key
                                                ? "bg-white/20"
                                                : "bg-bg-base"
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                )}
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
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder={t("common.search")}
                            className="w-full ps-10 pe-4 py-2 bg-bg-base border border-border-default rounded-lg focus:ring-2 focus:ring-interactive-primary focus:border-transparent transition-all"
                        />
                    </div>
                </Card>

                {/* Table */}
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
