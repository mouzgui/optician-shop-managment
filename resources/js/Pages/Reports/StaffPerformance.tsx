import React from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Card } from "@/Components/UI/Card";
import { DataTable } from "@/Components/UI/DataTable";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

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

    const columns = [
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
            className: "text-right",
            accessor: (item: StaffStat) => (
                <span className="font-bold text-text-primary">
                    {formatCurrency(parseFloat(item.total_collected))}
                </span>
            ),
        },
        {
            header: t("reports.staff.fields.performance_share"),
            className: "text-right",
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
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-text-primary">
                                {t("reports.staff.title")}
                            </h1>
                            <p className="text-text-muted">
                                {t("reports.staff.subtitle", {
                                    start: filters.start_date,
                                    end: filters.end_date,
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
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
                        <span className="text-text-muted">
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
