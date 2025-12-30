import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Badge } from "@/Components/UI/Badge";
import { Card } from "@/Components/UI/Card";
import { DataTable } from "@/Components/UI/DataTable";
import { Button } from "@/Components/UI/Button";
import {
    ChevronLeft,
    Calendar,
    Mail,
    Phone,
    FileText,
    Download,
    Eye,
    User,
    Clock,
    AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { enUS, arSA } from "date-fns/locale";
import { exportToCSV } from "@/Utils/csvExport";
import { StatCard } from "@/Components/Charts/StatCard";

interface Rx {
    id: number;
    customer_id: number;
    expires_at: string;
    customer?: {
        first_name: string;
        last_name: string;
        phone: string;
        email: string;
    };
}

interface Props {
    spectacleRx: Rx[];
    contactLensRx: Rx[];
}

export default function RxExpiry({ spectacleRx, contactLensRx }: Props) {
    const { t, i18n } = useTranslation();
    const { business } = usePage().props as any;
    const expiring_rx = [
        ...spectacleRx.map((rx) => ({ ...rx, type: "spectacle" })),
        ...contactLensRx.map((rx) => ({ ...rx, type: "contact_lens" })),
    ];

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
            t("reports.rx.fields.patient"),
            t("reports.rx.fields.phone"),
            t("reports.rx.fields.email"),
            t("reports.rx.fields.expiry_date"),
            t("reports.rx.fields.type"),
        ];

        const spectacleData = spectacleRx.map((rx) => [
            `${rx.customer?.first_name} ${rx.customer?.last_name}`,
            rx.customer?.phone || "-",
            rx.customer?.email || "-",
            rx.expires_at,
            t("reports.rx.spectacles"),
        ]);

        const contactLensData = contactLensRx.map((rx) => [
            `${rx.customer?.first_name} ${rx.customer?.last_name}`,
            rx.customer?.phone || "-",
            rx.customer?.email || "-",
            rx.expires_at,
            t("reports.rx.contact_lenses"),
        ]);

        exportToCSV(
            [...spectacleData, ...contactLensData],
            "rx-expiry-report",
            headers
        );
    };

    const handleExportPDF = () => {
        window.open(route("business.reports.rx-expiry.download"), "_blank");
    };

    const columns = [
        {
            header: t("reports.rx.fields.patient"),
            accessor: (item: Rx) => (
                <span className="font-medium text-text-primary">
                    {item.customer?.first_name} {item.customer?.last_name}
                </span>
            ),
        },
        {
            header: t("reports.rx.fields.contact_info"),
            accessor: (item: Rx) => (
                <div className="flex flex-col text-sm text-text-muted">
                    <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />{" "}
                        {item.customer?.phone || "-"}
                    </span>
                    <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />{" "}
                        {item.customer?.email || "-"}
                    </span>
                </div>
            ),
        },
        {
            header: t("reports.rx.fields.type"),
            accessor: (item: any) => (
                <Badge variant="info">
                    {item.type === "spectacle"
                        ? t("reports.rx.spectacles")
                        : t("reports.rx.contact_lenses")}
                </Badge>
            ),
        },
        {
            header: t("reports.rx.fields.expiry_date"),
            className: "text-center",
            accessor: (item: Rx) => (
                <Badge variant="warning">
                    {item.expires_at
                        ? format(new Date(item.expires_at), "PPP", {
                              locale: currentLocale,
                          })
                        : "-"}
                </Badge>
            ),
        },
        {
            header: t("common.actions.title"),
            className: "text-end",
            accessor: (item: Rx) => (
                <Link href={route("business.customers.show", item.customer_id)}>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-interactive-primary"
                    >
                        {t("reports.rx.recall_patient")}
                    </Button>
                </Link>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={t("reports.rx.title")} />

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
                                {t("reports.rx.title")}
                            </h1>
                            <p className="text-text-muted">
                                {t("reports.rx.subtitle")}
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
                        title={t("reports.rx.total_expiring")}
                        value={expiring_rx.length}
                        icon={Clock}
                        color="warning"
                    />
                    <StatCard
                        title={t("reports.rx.unique_customers")}
                        value={
                            new Set(expiring_rx.map((rx) => rx.customer_id))
                                .size
                        }
                        icon={User}
                        color="primary"
                    />
                    <StatCard
                        title={t("reports.rx.critical_followups")}
                        value={
                            expiring_rx.filter((rx) => {
                                const date = rx.expires_at
                                    ? new Date(rx.expires_at)
                                    : null;
                                return date && date < new Date();
                            }).length
                        }
                        icon={AlertTriangle}
                        color="danger"
                    />
                </div>

                <Card className="p-0 overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={expiring_rx}
                        keyField="id"
                        emptyMessage={t("reports.rx.empty")}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
