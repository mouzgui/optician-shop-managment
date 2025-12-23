import React from "react";
import { Head, Link } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Badge } from "@/Components/UI/Badge";
import { Card } from "@/Components/UI/Card";
import { DataTable } from "@/Components/UI/DataTable";
import { Button } from "@/Components/UI/Button";
import { ChevronLeft, Box, Package, FileText, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { exportToCSV } from "@/Utils/csvExport";

interface Frame {
    id: number;
    brand: string;
    model: string;
    color_name: string;
    sku: string;
    quantity: number;
}

interface ContactLens {
    id: number;
    brand: string;
    product_line: string;
    power: string;
    base_curve: string;
    boxes_in_stock: number;
}

interface Props {
    lowStockFrames: Frame[];
    lowStockCL: ContactLens[];
}

export default function Inventory({ lowStockFrames, lowStockCL }: Props) {
    const { t } = useTranslation();

    const handleExportCSV = () => {
        // Frames CSV
        const frameHeaders = [
            t("reports.inventory.fields.frame"),
            t("inventory.frames.fields.sku"),
            t("reports.inventory.fields.stock"),
        ];
        const frameData = lowStockFrames.map((f) => [
            `${f.brand} ${f.model}`,
            f.sku,
            f.quantity,
        ]);
        exportToCSV(frameData, "low-stock-frames", frameHeaders);

        // CL CSV
        const clHeaders = [
            t("reports.inventory.fields.contact_lens"),
            t("reports.inventory.fields.boxes"),
        ];
        const clData = lowStockCL.map((cl) => [
            `${cl.brand} ${cl.product_line}`,
            cl.boxes_in_stock,
        ]);
        exportToCSV(clData, "low-stock-contact-lenses", clHeaders);
    };

    const frameColumns = [
        {
            header: t("reports.inventory.fields.frame"),
            accessor: (item: Frame) => (
                <div className="flex flex-col">
                    <span className="font-medium text-text-primary">
                        {item.brand} - {item.model}
                    </span>
                    <span className="text-xs text-text-muted">
                        {item.color_name} | {item.sku}
                    </span>
                </div>
            ),
        },
        {
            header: t("reports.inventory.fields.stock"),
            className: "text-center",
            accessor: (item: Frame) => (
                <Badge variant={item.quantity === 0 ? "danger" : "warning"}>
                    {item.quantity} {t("reports.inventory.left")}
                </Badge>
            ),
        },
        {
            header: t("common.actions"),
            className: "text-end",
            accessor: (item: Frame) => (
                <Link href={route("business.inventory.frames.edit", item.id)}>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-interactive-primary"
                    >
                        {t("common.edit")}
                    </Button>
                </Link>
            ),
        },
    ];

    const clColumns = [
        {
            header: t("reports.inventory.fields.contact_lens"),
            accessor: (item: ContactLens) => (
                <div className="flex flex-col">
                    <span className="font-medium text-text-primary">
                        {item.brand} - {item.product_line}
                    </span>
                    <span className="text-xs text-text-muted">
                        Power: {item.power} | BC: {item.base_curve}
                    </span>
                </div>
            ),
        },
        {
            header: t("reports.inventory.fields.boxes"),
            className: "text-center",
            accessor: (item: ContactLens) => (
                <Badge
                    variant={item.boxes_in_stock <= 2 ? "danger" : "warning"}
                >
                    {item.boxes_in_stock} {t("reports.inventory.boxes")}
                </Badge>
            ),
        },
        {
            header: t("common.actions"),
            className: "text-end",
            accessor: (item: ContactLens) => (
                <Link
                    href={route(
                        "business.inventory.contact-lenses.edit",
                        item.id
                    )}
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-interactive-primary"
                    >
                        {t("common.edit")}
                    </Button>
                </Link>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={t("reports.inventory.title")} />

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
                                {t("reports.inventory.title")}
                            </h1>
                            <p className="text-text-muted">
                                {t("reports.inventory.subtitle")}
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Frames Low Stock */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-text-primary font-bold text-lg">
                            <Box className="w-5 h-5 text-interactive-primary" />
                            <h2>{t("reports.inventory.frames_alert")}</h2>
                        </div>
                        <Card className="p-0 overflow-hidden">
                            <DataTable
                                columns={frameColumns}
                                data={lowStockFrames}
                                keyField="id"
                                emptyMessage={t(
                                    "reports.inventory.frames_empty"
                                )}
                            />
                        </Card>
                    </div>

                    {/* Contact Lenses Low Stock */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-text-primary font-bold text-lg">
                            <Package className="w-5 h-5 text-interactive-primary" />
                            <h2>{t("reports.inventory.cl_alert")}</h2>
                        </div>
                        <Card className="p-0 overflow-hidden">
                            <DataTable
                                columns={clColumns}
                                data={lowStockCL}
                                keyField="id"
                                emptyMessage={t("reports.inventory.cl_empty")}
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
