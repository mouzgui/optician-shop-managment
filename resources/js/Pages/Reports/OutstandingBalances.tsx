import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Badge } from "@/Components/UI/Badge";
import { Card } from "@/Components/UI/Card";
import { DataTable } from "@/Components/UI/DataTable";
import { Button } from "@/Components/UI/Button";
import {
    ChevronLeft,
    Phone,
    Eye,
    FileText,
    Download,
    DollarSign,
    Receipt,
    AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { enUS, arSA } from "date-fns/locale";
import { exportToCSV } from "@/Utils/csvExport";
import { StatCard } from "@/Components/Charts/StatCard";

interface Props {
    invoices: any[];
    total_outstanding: number;
}

export default function OutstandingBalances({
    invoices,
    total_outstanding,
}: Props) {
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

    const handleExportCSV = () => {
        const headers = [
            t("reports.outstanding.fields.invoice"),
            t("reports.outstanding.fields.customer"),
            t("reports.outstanding.fields.total"),
            t("reports.outstanding.fields.paid"),
            t("reports.outstanding.fields.balance"),
        ];

        const csvData = invoices.map((item) => [
            item.invoice_number,
            `${item.customer?.first_name} ${item.customer?.last_name}`,
            item.total,
            item.amount_paid,
            item.balance_due,
        ]);

        exportToCSV(csvData, "outstanding-balances", headers);
    };

    const handleExportPDF = () => {
        window.open(
            route("business.reports.outstanding-balances.download"),
            "_blank"
        );
    };

    const columns = [
        {
            header: t("reports.outstanding.fields.invoice"),
            accessor: (item: any) => (
                <div className="flex flex-col">
                    <span className="font-medium text-text-primary">
                        {item.invoice_number}
                    </span>
                    <span className="text-xs text-text-muted">
                        {format(new Date(item.created_at), "PP", {
                            locale: currentLocale,
                        })}
                    </span>
                </div>
            ),
        },
        {
            header: t("reports.outstanding.fields.customer"),
            accessor: (item: any) => (
                <div className="flex flex-col">
                    <span className="font-medium text-text-primary">
                        {item.customer?.first_name} {item.customer?.last_name}
                    </span>
                    <span className="text-xs text-text-muted flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {item.customer?.phone}
                    </span>
                </div>
            ),
        },
        {
            header: t("reports.outstanding.fields.total"),
            className: "text-end",
            accessor: (item: any) => (
                <span className="text-text-muted">
                    {formatCurrency(parseFloat(item.total))}
                </span>
            ),
        },
        {
            header: t("reports.outstanding.fields.paid"),
            className: "text-end",
            accessor: (item: any) => (
                <span className="text-interactive-success font-medium">
                    {formatCurrency(parseFloat(item.amount_paid))}
                </span>
            ),
        },
        {
            header: t("reports.outstanding.fields.balance"),
            className: "text-end",
            accessor: (item: any) => (
                <span className="font-bold text-interactive-error">
                    {formatCurrency(parseFloat(item.balance_due))}
                </span>
            ),
        },
        {
            header: t("common.actions.title"),
            className: "text-end",
            accessor: (item: any) => (
                <Link href={route("business.sales.invoices.show", item.id)}>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-interactive-primary gap-1"
                    >
                        <Eye className="w-4 h-4" />
                        {t("common.view")}
                    </Button>
                </Link>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={t("reports.outstanding.title")} />

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
                                {t("reports.outstanding.title")}
                            </h1>
                            <p className="text-text-muted">
                                {t("reports.outstanding.subtitle")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
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
                        title={t("reports.outstanding.total_receivables")}
                        value={formatCurrency(total_outstanding)}
                        icon={DollarSign}
                        color="danger"
                    />
                    <StatCard
                        title={t("reports.outstanding.pending_invoices")}
                        value={invoices.length}
                        icon={Receipt}
                        color="warning"
                    />
                    <StatCard
                        title={t("reports.outstanding.avg_balance")}
                        value={formatCurrency(
                            invoices.length > 0
                                ? total_outstanding / invoices.length
                                : 0
                        )}
                        icon={AlertCircle}
                        color="primary"
                    />
                </div>

                <Card className="p-0 overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={invoices}
                        keyField="id"
                        emptyMessage={t("reports.outstanding.empty")}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
