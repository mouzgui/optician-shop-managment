import React from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/UI/Button";
import { Card } from "@/Components/UI/Card";
import { DataTable } from "@/Components/UI/DataTable";
import {
    ChevronLeft,
    Calendar as CalendarIcon,
    Download,
    FileText,
    DollarSign,
    CreditCard,
    TrendingUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { exportToCSV } from "@/Utils/csvExport";
import { StatCard } from "@/Components/Charts/StatCard";
import { Badge } from "@/Components/UI/Badge";

interface Payment {
    id: number;
    amount: string;
    payment_method: string;
    invoice?: {
        invoice_number: string;
        customer?: {
            first_name: string;
            last_name: string;
        };
    };
    received_by?: {
        name: string;
    };
}

interface Props {
    payments?: Payment[];
    summary?: {
        total: number;
        by_method: Record<string, number>;
    };
    filters?: {
        date: string;
    };
}

export default function DailyRevenue({
    payments = [],
    summary = { total: 0, by_method: {} },
    filters = { date: new Date().toISOString().split("T")[0] },
}: Props) {
    const { t, i18n } = useTranslation();
    const { business } = usePage().props as any;

    const formatCurrency = (amount: number) => {
        try {
            return new Intl.NumberFormat(
                i18n.language === "ar" ? "ar-SA" : "en-US",
                {
                    style: "currency",
                    currency: business?.currency_code || "USD",
                }
            ).format(amount || 0);
        } catch {
            return `$${amount || 0}`;
        }
    };

    const handleDateChange = (date: string) => {
        router.get(
            route("business.reports.daily-revenue"),
            { date },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleExportCSV = () => {
        const headers = [
            t("reports.revenue.fields.invoice"),
            t("reports.revenue.fields.customer"),
            t("reports.revenue.fields.method"),
            t("reports.revenue.fields.staff"),
            t("reports.revenue.fields.amount"),
        ];

        const data = (payments || []).map((p) => [
            p.invoice?.invoice_number || "-",
            p.invoice?.customer
                ? `${p.invoice.customer.first_name} ${p.invoice.customer.last_name}`
                : "-",
            (p.payment_method || "").replace("_", " "),
            p.received_by?.name || "-",
            p.amount || "0",
        ]);

        exportToCSV(data, `daily-revenue-${filters.date}`, headers);
    };

    const handleExportPDF = () => {
        window.open(
            route("business.reports.daily-revenue.download", {
                date: filters.date,
            }),
            "_blank"
        );
    };

    const columns = [
        {
            header: t("reports.revenue.fields.invoice"),
            accessor: (item: Payment) => (
                <div className="flex flex-col">
                    <span className="font-medium text-text-primary">
                        {item.invoice?.invoice_number || "-"}
                    </span>
                    <span className="text-xs text-text-muted">
                        {item.invoice?.customer
                            ? `${item.invoice.customer.first_name} ${item.invoice.customer.last_name}`
                            : "-"}
                    </span>
                </div>
            ),
        },
        {
            header: t("reports.revenue.fields.method"),
            accessor: (item: Payment) => (
                <Badge
                    variant={
                        item.payment_method === "cash"
                            ? "success"
                            : item.payment_method === "card"
                            ? "info"
                            : "secondary"
                    }
                    className="capitalize"
                >
                    {(item.payment_method || "").replace("_", " ")}
                </Badge>
            ),
        },
        {
            header: t("reports.revenue.fields.staff"),
            accessor: (item: Payment) => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-interactive-primary/10 text-interactive-primary flex items-center justify-center text-[10px] font-bold uppercase">
                        {item.received_by?.name?.substring(0, 2) || "??"}
                    </div>
                    <span className="text-text-muted text-sm">
                        {item.received_by?.name || "-"}
                    </span>
                </div>
            ),
        },
        {
            header: t("reports.revenue.fields.amount"),
            className: "text-end",
            accessor: (item: Payment) => (
                <span className="font-bold text-text-primary">
                    {formatCurrency(parseFloat(String(item.amount || "0")))}
                </span>
            ),
        },
    ];

    const byMethodEntries = Object.entries(summary?.by_method || {});

    return (
        <AuthenticatedLayout>
            <Head
                title={`${t("reports.revenue.daily_title")} - ${filters.date}`}
            />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("business.reports.index")}
                            className="p-2 hover:bg-bg-secondary rounded-lg transition-colors text-text-muted"
                        >
                            <ChevronLeft className="w-5 h-5 icon-flip" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-text-primary">
                                {t("reports.revenue.daily_title")}
                            </h1>
                            <p className="text-text-muted">
                                {t("reports.revenue.daily_subtitle", {
                                    date: filters.date,
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <CalendarIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                                type="date"
                                className="bg-bg-primary border border-border-default rounded-lg ps-9 pe-3 py-2 text-text-primary outline-none focus:ring-2 focus:ring-interactive-primary text-sm"
                                defaultValue={filters.date}
                                onChange={(e) =>
                                    handleDateChange(e.target.value)
                                }
                            />
                        </div>
                        <Button variant="secondary" onClick={handleExportCSV}>
                            <FileText className="w-4 h-4 me-2" />
                            {t("common.export_csv")}
                        </Button>
                        <Button variant="secondary" onClick={handleExportPDF}>
                            <Download className="w-4 h-4 me-2" />
                            {t("common.export_pdf")}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title={t("reports.revenue.total_collected")}
                        value={formatCurrency(summary?.total || 0)}
                        icon={DollarSign}
                        color="primary"
                    />
                    <StatCard
                        title={t("reports.revenue.transactions")}
                        value={payments.length}
                        icon={TrendingUp}
                        color="success"
                    />
                    <StatCard
                        title={t("reports.revenue.avg_transaction")}
                        value={formatCurrency(
                            payments.length > 0
                                ? (summary?.total || 0) / payments.length
                                : 0
                        )}
                        icon={CreditCard}
                        color="info"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <Card className="lg:col-span-1 h-fit p-6">
                        <h3 className="text-sm font-semibold text-text-muted mb-4 uppercase tracking-wider">
                            {t("reports.revenue.by_method")}
                        </h3>
                        <div className="space-y-4">
                            {byMethodEntries.length > 0 ? (
                                <div className="space-y-3">
                                    {byMethodEntries.map(([method, amount]) => (
                                        <div
                                            key={method}
                                            className="flex justify-between items-center text-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`w-2 h-2 rounded-full ${
                                                        method === "cash"
                                                            ? "bg-green-500"
                                                            : method === "card"
                                                            ? "bg-blue-500"
                                                            : "bg-gray-500"
                                                    }`}
                                                />
                                                <span className="capitalize text-text-muted">
                                                    {method.replace("_", " ")}
                                                </span>
                                            </div>
                                            <span className="font-bold text-text-primary">
                                                {formatCurrency(
                                                    amount as number
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-text-muted italic">
                                    {t("reports.revenue.no_payments")}
                                </p>
                            )}
                        </div>
                    </Card>

                    <Card className="p-0 overflow-hidden lg:col-span-3">
                        <DataTable
                            columns={columns}
                            data={payments || []}
                            keyField="id"
                            emptyMessage={t("reports.revenue.no_payments")}
                        />
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
