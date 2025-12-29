import React from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Card } from "@/Components/UI/Card";
import { DataTable } from "@/Components/UI/DataTable";
import { ChevronLeft, FileText, Download, Users, Receipt, DollarSign, Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { enUS, arSA } from "date-fns/locale";
import { Button } from "@/Components/UI/Button";
import { exportToCSV } from "@/Utils/csvExport";

interface StaffStat {
    name: string;
    payment_count: number;
    total_collected: string;
}

interface Props {
    performance: StaffStat[];
    filters: {
        start_date: string;
        end_date: string;
    };
}

export default function StaffPerformance({ performance, filters }: Props) {
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

    const handleDateChange = (start: string, end: string) => {
        router.get(
            route("business.reports.staff-performance"),
            { start_date: start, end_date: end },
            { preserveState: true, preserveScroll: true }
        );
    };

    const totalAll = performance.reduce(
        (sum, s) => sum + parseFloat(s.total_collected),
        0
    );

    const totalTransactions = performance.reduce(
        (sum, s) => sum + s.payment_count,
        0
    );

    const topPerformer = performance.reduce(
        (top, s) => parseFloat(s.total_collected) > parseFloat(top?.total_collected || "0") ? s : top,
        performance[0]
    );

    const handleExportCSV = () => {
        const headers = [
            t("reports.staff.fields.staff_member"),
            t("reports.staff.fields.transactions"),
            t("reports.staff.fields.total_collected"),
            t("reports.staff.fields.performance_share"),
        ];

        const csvData = performance.map((item) => {
            const share =
                totalAll > 0
                    ? (parseFloat(item.total_collected) / totalAll) * 100
                    : 0;
            return [
                item.name,
                item.payment_count,
                item.total_collected,
                `${share.toFixed(1)}%`,
            ];
        });

        exportToCSV(
            csvData,
            `staff-performance-${filters.start_date}-to-${filters.end_date}`,
            headers
        );
    };

    const columns: any[] = [
        {
            header: t("reports.staff.fields.staff_member"),
            accessor: (item: StaffStat) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-interactive-primary/10 text-interactive-primary flex items-center justify-center font-bold text-xs uppercase">
                        {item.name.substring(0, 2)}
                    </div>
                    <span className="font-medium text-text-primary">
                        {item.name}
                    </span>
                    {topPerformer && item.name === topPerformer.name && (
                        <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full">
                            Top Performer
                        </span>
                    )}
                </div>
            ),
        },
        {
            header: t("reports.staff.fields.transactions"),
            className: "text-center",
            accessor: (item: StaffStat) => (
                <span className="text-text-primary font-medium">
                    {item.payment_count}
                </span>
            ),
        },
        {
            header: t("reports.staff.fields.total_collected"),
            className: "text-end",
            accessor: (item: StaffStat) => (
                <span className="font-bold text-text-primary">
                    {formatCurrency(parseFloat(item.total_collected))}
                </span>
            ),
        },
        {
            header: t("reports.staff.fields.performance_share"),
            className: "text-end",
            accessor: (item: StaffStat) => {
                const share =
                    totalAll > 0
                        ? (parseFloat(item.total_collected) / totalAll) * 100
                        : 0;
                return (
                    <div className="flex items-center justify-end gap-3">
                        <div className="w-32 h-2 bg-bg-secondary rounded-full overflow-hidden hidden sm:block">
                            <div
                                className="h-full bg-interactive-primary"
                                style={{ width: `${share}%` }}
                            />
                        </div>
                        <span className="text-sm font-bold text-text-muted">
                            {share.toFixed(1)}%
                        </span>
                    </div>
                );
            },
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={t("reports.staff.title")} />

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
                                {t("reports.staff.title")}
                            </h1>
                            <p className="text-text-muted">
                                {t("reports.staff.subtitle", {
                                    start: format(
                                        new Date(filters.start_date),
                                        "PPP",
                                        {
                                            locale: currentLocale,
                                        }
                                    ),
                                    end: format(
                                        new Date(filters.end_date),
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
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                className="bg-bg-primary border border-border-default rounded-lg px-3 py-2 text-text-primary outline-none focus:ring-2 focus:ring-interactive-primary text-sm"
                                defaultValue={filters.start_date}
                                onChange={(e) =>
                                    handleDateChange(
                                        e.target.value,
                                        filters.end_date
                                    )
                                }
                            />
                            <span className="text-text-muted text-sm">
                                {t("common.to")}
                            </span>
                            <input
                                type="date"
                                className="bg-bg-primary border border-border-default rounded-lg px-3 py-2 text-text-primary outline-none focus:ring-2 focus:ring-interactive-primary text-sm"
                                defaultValue={filters.end_date}
                                onChange={(e) =>
                                    handleDateChange(
                                        filters.start_date,
                                        e.target.value
                                    )
                                }
                            />
                        </div>
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

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 border-l-4 border-l-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Staff Members</p>
                                <p className="text-2xl font-bold text-text-primary mt-1">
                                    {performance.length}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Total Transactions</p>
                                <p className="text-2xl font-bold text-text-primary mt-1">
                                    {totalTransactions}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Total Collected</p>
                                <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
                                    {formatCurrency(totalAll)}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-amber-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Top Performer</p>
                                <p className="text-lg font-bold text-text-primary mt-1 truncate">
                                    {topPerformer?.name || "N/A"}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="p-0 overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={performance}
                        keyField="name"
                        emptyMessage={t("reports.staff.no_data")}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
