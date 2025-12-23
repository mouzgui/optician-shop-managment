import React from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/UI/Button";
import { Card } from "@/Components/UI/Card";
import { DataTable } from "@/Components/UI/DataTable";
import { ChevronLeft, Calendar as CalendarIcon, Download } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { enUS, arSA } from "date-fns/locale";

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
    payments: Payment[];
    summary: {
        total: number;
        by_method: Record<string, number>;
    };
    filters: {
        date: string;
    };
}

export default function DailyRevenue({ payments, summary, filters }: Props) {
    const { t, i18n } = useTranslation();
    const { business } = usePage().props as any;

    const locales: Record<string, any> = {
        en: enUS,
        ar: arSA,
    };

    const currentLocale = locales[i18n.language] || enUS;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(
            i18n.language === "ar" ? "ar-SA" : "en-US",
            {
                style: "currency",
                currency: business?.currency_code || "USD",
            }
        ).format(amount);
    };

    const handleDateChange = (date: string) => {
        router.get(
            route("business.reports.daily-revenue"),
            { date },
            { preserveState: true, preserveScroll: true }
        );
    };

    const columns = [
        {
            header: t("reports.revenue.fields.invoice"),
            accessor: (item: Payment) => (
                <span className="font-medium text-text-primary">
                    {item.invoice?.invoice_number || "-"}
                </span>
            ),
        },
        {
            header: t("reports.revenue.fields.customer"),
            accessor: (item: Payment) => (
                <span className="text-text-primary">
                    {item.invoice?.customer
                        ? `${item.invoice.customer.first_name} ${item.invoice.customer.last_name}`
                        : "-"}
                </span>
            ),
        },
        {
            header: t("reports.revenue.fields.method"),
            accessor: (item: Payment) => (
                <span className="capitalize text-text-muted text-sm">
                    {item.payment_method.replace("_", " ")}
                </span>
            ),
        },
        {
            header: t("reports.revenue.fields.staff"),
            accessor: (item: Payment) => (
                <span className="text-text-muted text-sm">
                    {item.received_by?.name || "-"}
                </span>
            ),
        },
        {
            header: t("reports.revenue.fields.amount"),
            className: "text-right",
            accessor: (item: Payment) => (
                <span className="font-bold text-text-primary">
                    {formatCurrency(parseFloat(item.amount))}
                </span>
            ),
        },
    ];

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
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-text-primary">
                                {t("reports.revenue.daily_title")}
                            </h1>
                            <p className="text-text-muted">
                                {t("reports.revenue.collections_for", {
                                    date: format(
                                        new Date(filters.date),
                                        "PPP",
                                        {
                                            locale: currentLocale,
                                        }
                                    ),
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="date"
                            className="bg-bg-primary border border-border-default rounded-lg px-3 py-2 text-text-primary outline-none focus:ring-2 focus:ring-interactive-primary"
                            defaultValue={filters.date}
                            onChange={(e) => handleDateChange(e.target.value)}
                        />
                        <Button
                            variant="secondary"
                            onClick={() => window.print()}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {t("common.export_pdf")}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <Card className="lg:col-span-1 h-fit">
                        <h3 className="text-sm font-semibold text-text-muted mb-4 uppercase tracking-wider">
                            {t("reports.revenue.summary")}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <span className="text-xs text-text-muted block">
                                    {t("reports.revenue.total_collected")}
                                </span>
                                <span className="text-2xl font-bold text-text-primary">
                                    {formatCurrency(summary.total)}
                                </span>
                            </div>
                            <div className="pt-4 border-t border-border-default">
                                <span className="text-xs text-text-muted block mb-2">
                                    {t("reports.revenue.by_method")}
                                </span>
                                <div className="space-y-2">
                                    {Object.entries(summary.by_method).map(
                                        ([method, amount]) => (
                                            <div
                                                key={method}
                                                className="flex justify-between items-center text-sm"
                                            >
                                                <span className="capitalize text-text-muted">
                                                    {method.replace("_", " ")}
                                                </span>
                                                <span className="font-medium text-text-primary">
                                                    {formatCurrency(amount)}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-0 overflow-hidden lg:col-span-3">
                        <DataTable
                            columns={columns}
                            data={payments}
                            keyField="id"
                            emptyMessage={t("reports.revenue.no_payments")}
                        />
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
