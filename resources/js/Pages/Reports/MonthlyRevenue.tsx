import React from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { BarChart } from "@/Components/Charts/BarChart";
import { Card } from "@/Components/UI/Card";
import { DataTable } from "@/Components/UI/DataTable";
import { ChevronLeft, Calendar, FileText, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/Components/UI/Button";
import { exportToCSV } from "@/Utils/csvExport";

interface Props {
    data: { month: string; total: number }[];
    filters: { year: string };
}

export default function MonthlyRevenue({ data, filters }: Props) {
    const { t, i18n } = useTranslation();
    const { business } = usePage().props as any;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(
            i18n.language === "ar" ? "ar-SA" : "en-US",
            {
                style: "currency",
                currency: business?.currency_code || "USD",
            }
        ).format(amount);
    };

    const handleYearChange = (year: string) => {
        router.get(
            route("business.reports.monthly-revenue"),
            { year },
            { preserveState: true, preserveScroll: true }
        );
    };

    const totalYearly = data.reduce((sum, item) => sum + item.total, 0);

    const handleExportCSV = () => {
        const headers = [
            t("reports.revenue.fields.month"),
            t("reports.revenue.fields.total_revenue"),
        ];

        const csvData = data.map((item) => [item.month, item.total]);

        exportToCSV(csvData, `monthly-revenue-${filters.year}`, headers);
    };

    const columns = [
        {
            header: t("reports.revenue.fields.month"),
            accessor: (item: any) => (
                <span className="font-medium text-text-primary">
                    {item.month}
                </span>
            ),
        },
        {
            header: t("reports.revenue.fields.total_revenue"),
            className: "text-end",
            accessor: (item: any) => (
                <span className="font-bold text-text-primary">
                    {formatCurrency(item.total)}
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
                        <Calendar className="w-4 h-4 text-text-muted" />
                        <select
                            className="bg-bg-primary border border-border-default rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-interactive-primary text-text-primary text-sm"
                            defaultValue={filters.year}
                            onChange={(e) => handleYearChange(e.target.value)}
                        >
                            {[2023, 2024, 2025].map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                        <Button variant="secondary" onClick={handleExportCSV}>
                            <FileText className="w-4 h-4 me-2" />
                            {t("common.export_csv")}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => window.print()}
                        >
                            <Download className="w-4 h-4 me-2" />
                            {t("common.export_pdf")}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <Card className="p-6">
                        <h3 className="text-xs font-bold text-text-muted mb-6 uppercase tracking-widest">
                            {t("reports.revenue.summary")}
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1 block opacity-60">
                                    {t("reports.revenue.yearly_total")}
                                </span>
                                <span className="text-2xl font-black text-text-primary">
                                    {formatCurrency(totalYearly)}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1 block opacity-60">
                                    {t("reports.revenue.monthly_average")}
                                </span>
                                <span className="text-lg font-bold text-interactive-primary">
                                    {formatCurrency(totalYearly / 12)}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 lg:col-span-3">
                        <h3 className="text-xs font-bold text-text-muted mb-6 uppercase tracking-widest">
                            {t("reports.revenue.trend")}
                        </h3>
                        <div className="h-[350px]">
                            <BarChart
                                data={data}
                                xKey="month"
                                yKey="total"
                                height={350}
                            />
                        </div>
                    </Card>
                </div>

                <DataTable
                    columns={columns}
                    data={data}
                    keyField="month"
                    emptyMessage={t("reports.revenue.no_payments")}
                />
            </div>
        </AuthenticatedLayout>
    );
}
