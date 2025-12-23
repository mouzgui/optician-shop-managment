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
} from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { enUS, arSA } from "date-fns/locale";
import { exportToCSV } from "@/Utils/csvExport";

interface Rx {
    id: number;
    customer_id: number;
    expiry_date: string;
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
            rx.expiry_date,
            t("reports.rx.spectacles"),
        ]);

        const contactLensData = contactLensRx.map((rx) => [
            `${rx.customer?.first_name} ${rx.customer?.last_name}`,
            rx.customer?.phone || "-",
            rx.customer?.email || "-",
            rx.expiry_date,
            t("reports.rx.contact_lenses"),
        ]);

        exportToCSV(
            [...spectacleData, ...contactLensData],
            "rx-expiry-report",
            headers
        );
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
            header: t("reports.rx.fields.expiry_date"),
            className: "text-center",
            accessor: (item: Rx) => (
                <Badge variant="warning">
                    {format(new Date(item.expiry_date), "PPP", {
                        locale: currentLocale,
                    })}
                </Badge>
            ),
        },
        {
            header: t("common.actions"),
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
                <div className="flex items-center justify-between">
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
                        <Button
                            variant="secondary"
                            onClick={() => window.print()}
                        >
                            <Download className="w-4 h-4 me-2" />
                            {t("common.export_pdf")}
                        </Button>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Spectacle Prescriptions */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-interactive-primary" />
                            {t("reports.rx.spectacle_alert")}
                        </h2>
                        <Card className="p-0 overflow-hidden">
                            <DataTable
                                columns={columns}
                                data={spectacleRx}
                                keyField="id"
                                emptyMessage={t("reports.rx.spectacle_empty")}
                            />
                        </Card>
                    </div>

                    {/* Contact Lens Prescriptions */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-interactive-primary" />
                            {t("reports.rx.cl_alert")}
                        </h2>
                        <Card className="p-0 overflow-hidden">
                            <DataTable
                                columns={columns}
                                data={contactLensRx}
                                keyField="id"
                                emptyMessage={t("reports.rx.cl_empty")}
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
