import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    DollarSign,
    Tag,
    AlertTriangle,
    CircleDot,
    FileText,
} from "lucide-react";
import { Button } from "@/Components/UI/Button";
import { DataTable, Column } from "@/Components/UI/DataTable";
import { Badge } from "@/Components/UI/Badge";
import { Card } from "@/Components/UI/Card";
import { StatCard } from "@/Components/Charts/StatCard";
import { exportToCSV } from "@/Utils/csvExport";

interface ContactLens {
    id: number;
    brand: string;
    product_line: string;
    type: string;
    replacement_schedule: string;
    power: number;
    cylinder: number;
    axis: number;
    selling_price_per_box: number;
    boxes_in_stock: number;
    box_quantity: number;
    low_stock_threshold?: number;
    expiry_date: string;
    is_active: boolean;
}

interface Props {
    contactLenses?: {
        data: ContactLens[];
        links: any[];
        meta: any;
    };
    filters?: {
        search?: string;
        schedule?: string;
    };
    stats?: {
        total: number;
        lowStock: number;
        totalValue: number;
        brands: number;
    };
}

export default function Index({
    contactLenses = { data: [], links: [], meta: {} },
    filters = {},
    stats,
}: Props) {
    const { t, i18n } = useTranslation();
    const { business } = usePage<any>().props;
    const [search, setSearch] = React.useState(filters.search || "");
    const [activeSchedule, setActiveSchedule] = React.useState(
        filters.schedule || "all"
    );

    const safeT = (key: string, fallback?: string) => {
        try {
            const result = t(key);
            return typeof result === "string" ? result : fallback || key;
        } catch {
            return fallback || key;
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route("business.inventory.contact-lenses.index"),
            {
                search,
                schedule: activeSchedule !== "all" ? activeSchedule : undefined,
            },
            { preserveState: true }
        );
    };

    const handleScheduleFilter = (schedule: string) => {
        setActiveSchedule(schedule);
        router.get(
            route("business.inventory.contact-lenses.index"),
            { search, schedule: schedule !== "all" ? schedule : undefined },
            { preserveState: true }
        );
    };

    const deleteCL = (id: number) => {
        if (
            confirm(
                safeT(
                    "common.confirm_delete",
                    "Are you sure you want to delete this item?"
                )
            )
        ) {
            router.delete(
                route("business.inventory.contact-lenses.destroy", id)
            );
        }
    };

    const handleExportCSV = () => {
        const headers = [
            safeT("inventory.contact_lenses.fields.name", "Name"),
            safeT("inventory.contact_lenses.fields.schedule", "Schedule"),
            safeT("inventory.contact_lenses.fields.power", "Power"),
            safeT("inventory.contact_lenses.fields.stock", "Stock"),
            safeT("inventory.contact_lenses.fields.price", "Price"),
        ];

        const data = contactLenses.data.map((item) => [
            `${item.brand} ${item.product_line}`,
            getScheduleLabel(item.replacement_schedule),
            `SPH: ${item.power}, CYL: ${item.cylinder} x ${item.axis}`,
            item.boxes_in_stock,
            item.selling_price_per_box,
        ]);

        exportToCSV(data, "contact-lenses-inventory", headers);
    };

    const formatCurrency = (value: number) => {
        try {
            return new Intl.NumberFormat(
                i18n.language === "ar" ? "ar-SA" : "en-US",
                {
                    style: "currency",
                    currency: business?.currency_code || "USD",
                }
            ).format(value || 0);
        } catch {
            return `${business?.currency_symbol || "$"}${value || 0}`;
        }
    };

    const scheduleTabs = [
        { key: "all", label: "All" },
        { key: "daily", label: "Daily" },
        { key: "biweekly", label: "Biweekly" },
        { key: "monthly", label: "Monthly" },
        { key: "quarterly", label: "Quarterly" },
    ];

    const getScheduleLabel = (schedule: string) => {
        const labels: Record<string, string> = {
            daily: "Daily",
            biweekly: "Biweekly",
            monthly: "Monthly",
            quarterly: "Quarterly",
        };
        return labels[schedule] || schedule;
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            spherical: "Spherical",
            toric: "Toric",
            multifocal: "Multifocal",
        };
        return labels[type] || type;
    };

    // Calculate stats from data if not provided
    const calculatedStats = {
        total: stats?.total || contactLenses.data.length,
        lowStock:
            stats?.lowStock ||
            contactLenses.data.filter(
                (cl) => cl.boxes_in_stock <= (cl.low_stock_threshold || 5)
            ).length,
        totalValue:
            stats?.totalValue ||
            contactLenses.data.reduce(
                (sum, cl) => sum + cl.selling_price_per_box * cl.boxes_in_stock,
                0
            ),
        brands:
            stats?.brands ||
            [...new Set(contactLenses.data.map((cl) => cl.brand))].length,
    };

    const columns: Column<ContactLens>[] = [
        {
            header: safeT("inventory.contact_lenses.fields.name", "Name"),
            accessor: (item: ContactLens) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                        <CircleDot className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                        <div className="font-medium text-text-primary">
                            {item.brand} - {item.product_line}
                        </div>
                        <div className="text-xs text-text-muted">
                            {getTypeLabel(item.type)}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: safeT(
                "inventory.contact_lenses.fields.schedule",
                "Schedule"
            ),
            accessor: (item: ContactLens) => (
                <Badge variant="info">
                    {getScheduleLabel(item.replacement_schedule)}
                </Badge>
            ),
        },
        {
            header: safeT("inventory.contact_lenses.fields.power", "Power"),
            accessor: (item: ContactLens) => (
                <div className="text-sm">
                    <div className="text-text-primary">
                        SPH: {item.power > 0 ? "+" : ""}
                        {item.power}
                    </div>
                    {item.cylinder !== 0 && (
                        <div className="text-xs text-text-muted">
                            CYL: {item.cylinder} x {item.axis}°
                        </div>
                    )}
                </div>
            ),
        },
        {
            header: safeT("inventory.contact_lenses.fields.stock", "Stock"),
            accessor: (item: ContactLens) => (
                <div className="flex flex-col items-start">
                    <Badge
                        variant={
                            item.boxes_in_stock <=
                            (item.low_stock_threshold || 5)
                                ? "danger"
                                : "success"
                        }
                    >
                        {item.boxes_in_stock} boxes{" "}
                        {item.boxes_in_stock <=
                            (item.low_stock_threshold || 5) && "⚠"}
                    </Badge>
                    <span className="text-[10px] text-text-muted mt-1">
                        {item.box_quantity} per box
                    </span>
                </div>
            ),
        },
        {
            header: safeT("inventory.contact_lenses.fields.price", "Price"),
            accessor: (item: ContactLens) => (
                <span className="font-bold text-text-primary">
                    {formatCurrency(item.selling_price_per_box)}
                </span>
            ),
        },
        {
            header: safeT("common.actions.title", "Actions"),
            accessor: (item: ContactLens) => (
                <div className="flex gap-2">
                    <Link
                        href={route(
                            "business.inventory.contact-lenses.edit",
                            item.id
                        )}
                    >
                        <Button variant="secondary" size="sm">
                            <Pencil className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteCL(item.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black text-text-primary tracking-tight">
                        {safeT(
                            "inventory.contact_lenses.title",
                            "Contact Lenses"
                        )}
                    </h2>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            onClick={handleExportCSV}
                            className="flex items-center gap-2"
                        >
                            <FileText className="w-4 h-4" />
                            {safeT("common.export_csv", "Export CSV")}
                        </Button>
                        <Link
                            href={route(
                                "business.inventory.contact-lenses.create"
                            )}
                        >
                            <Button className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                {safeT(
                                    "inventory.contact_lenses.create_button",
                                    "Add Contact Lens"
                                )}
                            </Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head
                title={safeT(
                    "inventory.contact_lenses.title",
                    "Contact Lenses"
                )}
            />

            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Items"
                        value={calculatedStats.total}
                        icon={CircleDot}
                        color="primary"
                    />
                    <StatCard
                        title="Low Stock"
                        value={calculatedStats.lowStock}
                        icon={AlertTriangle}
                        color="danger"
                    />
                    <StatCard
                        title="Total Value"
                        value={formatCurrency(calculatedStats.totalValue)}
                        icon={DollarSign}
                        color="success"
                    />
                    <StatCard
                        title="Brands"
                        value={calculatedStats.brands}
                        icon={Tag}
                        color="info"
                    />
                </div>

                {/* Schedule Filter Tabs */}
                <Card className="p-2">
                    <div className="flex flex-wrap gap-2">
                        {scheduleTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleScheduleFilter(tab.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    activeSchedule === tab.key
                                        ? "bg-primary-default text-white"
                                        : "bg-bg-subtle text-text-muted hover:bg-bg-subtle/80 hover:text-text-primary"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Search */}
                <Card className="p-4">
                    <form onSubmit={handleSearch} className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={safeT("common.search", "Search...")}
                            className="w-full pl-10 pr-4 py-2 bg-bg-base border border-border-default rounded-lg focus:ring-2 focus:ring-interactive-primary focus:border-transparent transition-all"
                        />
                    </form>
                </Card>

                {/* Table */}
                <Card>
                    <DataTable<ContactLens>
                        columns={columns}
                        data={contactLenses.data}
                        keyField="id"
                        meta={contactLenses.meta}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
