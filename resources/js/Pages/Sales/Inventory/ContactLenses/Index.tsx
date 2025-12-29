import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Pencil, Trash2, DollarSign, Tag, AlertTriangle, CircleDot } from "lucide-react";
import { Button } from "@/Components/UI/Button";
import { DataTable } from "@/Components/UI/DataTable";
import { Badge } from "@/Components/UI/Badge";
import { Card } from "@/Components/UI/Card";

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

export default function Index({ contactLenses = { data: [], links: [], meta: {} }, filters = {}, stats }: Props) {
    const { t } = useTranslation();
    const { business } = usePage<any>().props;
    const [search, setSearch] = React.useState(filters.search || "");
    const [activeSchedule, setActiveSchedule] = React.useState(filters.schedule || "all");

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
            "/business/inventory/contact-lenses",
            { search, schedule: activeSchedule !== "all" ? activeSchedule : undefined },
            { preserveState: true }
        );
    };

    const handleScheduleFilter = (schedule: string) => {
        setActiveSchedule(schedule);
        router.get(
            "/business/inventory/contact-lenses",
            { search, schedule: schedule !== "all" ? schedule : undefined },
            { preserveState: true }
        );
    };

    const deleteCL = (id: number) => {
        if (confirm(safeT("common.confirm_delete", "Are you sure you want to delete this item?"))) {
            router.delete(`/business/inventory/contact-lenses/${id}`);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "AED",
        }).format(value);
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
        lowStock: stats?.lowStock || contactLenses.data.filter(cl => cl.boxes_in_stock <= (cl.low_stock_threshold || 5)).length,
        totalValue: stats?.totalValue || contactLenses.data.reduce((sum, cl) => sum + (cl.selling_price_per_box * cl.boxes_in_stock), 0),
        brands: stats?.brands || [...new Set(contactLenses.data.map(cl => cl.brand))].length,
    };

    const columns: any[] = [
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
            header: safeT("inventory.contact_lenses.fields.schedule", "Schedule"),
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
                    <div className="text-text-primary">SPH: {item.power > 0 ? '+' : ''}{item.power}</div>
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
                            item.boxes_in_stock <= (item.low_stock_threshold || 5)
                                ? "danger"
                                : "success"
                        }
                    >
                        {item.boxes_in_stock} boxes {item.boxes_in_stock <= (item.low_stock_threshold || 5) && "⚠"}
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
                    <Link href={`/business/inventory/contact-lenses/${item.id}/edit`}>
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
                        {safeT("inventory.contact_lenses.title", "Contact Lenses")}
                    </h2>
                    <Link href="/business/inventory/contact-lenses/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            {safeT("inventory.contact_lenses.create_button", "Add Contact Lens")}
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title={safeT("inventory.contact_lenses.title", "Contact Lenses")} />

            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 border-l-4 border-l-teal-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Total Items</p>
                                <p className="text-2xl font-bold text-text-primary mt-1">
                                    {calculatedStats.total}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                                <CircleDot className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Low Stock</p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                                    {calculatedStats.lowStock}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Total Value</p>
                                <p className="text-xl font-bold text-text-primary mt-1">
                                    {formatCurrency(calculatedStats.totalValue)}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Brands</p>
                                <p className="text-2xl font-bold text-text-primary mt-1">
                                    {calculatedStats.brands}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Tag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Schedule Filter Tabs */}
                <Card className="p-2">
                    <div className="flex flex-wrap gap-2">
                        {scheduleTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleScheduleFilter(tab.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSchedule === tab.key
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
                    <form
                        onSubmit={handleSearch}
                        className="relative max-w-md"
                    >
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
                    <DataTable
                        columns={columns}
                        data={contactLenses.data}
                        meta={contactLenses.meta}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
