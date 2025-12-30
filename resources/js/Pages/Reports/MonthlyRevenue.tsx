import React from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { BarChart } from "@/Components/Charts/BarChart";
import { Card } from "@/Components/UI/Card";
import { DataTable } from "@/Components/UI/DataTable";
import {
    ChevronLeft,
    Calendar,
    FileText,
    Download,
    DollarSign,
    TrendingUp,
    BarChart3,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/Components/UI/Button";
import { exportToCSV } from "@/Utils/csvExport";
import { StatCard } from "@/Components/Charts/StatCard";

interface Props {
    data?: { month: string; total: number }[];
    filters?: { year: string };
}

export default function MonthlyRevenue({
    data = [],
    filters = { year: new Date().getFullYear().toString() },
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

    const handleYearChange = (year: string) => {
        router.get(
            route("business.reports.monthly-revenue"),
            { year },
            { preserveState: true, preserveScroll: true }
        );
    };

    const safeData = data || [];
    const totalYearly = safeData.reduce(
        (sum, item) => sum + (item?.total || 0),
        0
    );

    const handleExportCSV = () => {
        const headers = [
            t("reports.revenue.fields.month"),
            t("reports.revenue.fields.total_revenue"),
        ];

        const csvData = safeData.map((item) => [
            item?.month || "",
            item?.total || 0,
        ]);

        exportToCSV(csvData, `monthly-revenue-${filters.year}`, headers);
    };

    const handleExportPDF = () => {
        window.open(
            route("business.reports.monthly-revenue.download", {
                year: filters.year,
            }),
            "_blank"
        );
    };

    const columns = [
        {
            header: t("reports.revenue.fields.month"),
            accessor: (item: any) => (
                <span className="font-medium text-text-primary">
                    {item?.month || "-"}
                </span>
            ),
        },
        {
            header: t("reports.revenue.fields.total_revenue"),
            className: "text-end",
            accessor: (item: any) => (
                <span className="font-bold text-text-primary">
                    {formatCurrency(item?.total || 0)}
                </span>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head
                title={`${t("reports.revenue.monthly_title")} - ${
                    filters.year
                }`}
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
                                {t("reports.revenue.monthly_title")}
                            </h1>
                            <p className="text-text-muted">
                                {t("reports.revenue.monthly_subtitle", {
                                    year: filters.year,
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <select
                                className="bg-bg-primary border border-border-default rounded-lg ps-9 pe-3 py-2 outline-none focus:ring-2 focus:ring-interactive-primary text-text-primary text-sm appearance-none min-w-[120px]"
                                defaultValue={filters.year}
                                onChange={(e) =>
                                    handleYearChange(e.target.value)
                                }
                            >
                                {[2023, 2024, 2025].map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
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
                        title={t("reports.revenue.yearly_total")}
                        value={formatCurrency(totalYearly)}
                        icon={DollarSign}
                        color="primary"
                    />
                    <StatCard
                        title={t("reports.revenue.monthly_average")}
                        value={formatCurrency(totalYearly / 12)}
                        icon={TrendingUp}
                        color="success"
                    />
                    <StatCard
                        title={t("reports.revenue.best_month")}
                        value={
                            safeData.length > 0
                                ? formatCurrency(
                                      Math.max(...safeData.map((d) => d.total))
                                  )
                                : formatCurrency(0)
                        }
                        icon={BarChart3}
                        color="info"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <Card className="p-6 lg:col-span-3">
                        <h3 className="text-sm font-semibold text-text-muted mb-6 uppercase tracking-wider">
                            {t("reports.revenue.trend")}
                        </h3>
                        <div className="h-[350px]">
                            {safeData.length > 0 ? (
                                <BarChart
                                    data={safeData}
                                    xKey="month"
                                    yKey="total"
                                    height={350}
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-text-muted italic">
                                    {t("reports.revenue.no_data_year")}
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card className="p-0 overflow-hidden lg:col-span-1">
                        <DataTable
                            columns={columns}
                            data={safeData}
                            keyField="month"
                            emptyMessage={t("reports.revenue.no_payments")}
                        />
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
