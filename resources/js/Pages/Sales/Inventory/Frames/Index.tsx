import React from "react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    AlertTriangle,
    Package,
    DollarSign,
    Tag,
    Glasses,
    FileText,
} from "lucide-react";
import { Card } from "@/Components/UI/Card";
import { Button } from "@/Components/UI/Button";
import { Badge } from "@/Components/UI/Badge";
import { DataTable, Column } from "@/Components/UI/DataTable";
import { StatCard } from "@/Components/Charts/StatCard";
import { exportToCSV } from "@/Utils/csvExport";

interface Frame {
    id: number;
    sku: string;
    barcode: string;
    brand: string;
    model: string;
    color_name: string;
    category: string;
    quantity: number;
    low_stock_threshold: number;
    selling_price: number;
    is_active: boolean;
}

interface Props {
    frames: {
        data: Frame[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
        category?: string;
        low_stock?: boolean;
    };
    stats?: {
        total: number;
        lowStock: number;
        totalValue: number;
        brands: number;
    };
}

export default function Index({ frames, filters, stats }: Props) {
    const { t, i18n } = useTranslation();
    const { business } = usePage().props as any;
    const [search, setSearch] = React.useState(filters.search || "");
    const [activeCategory, setActiveCategory] = React.useState(
        filters.category || "all"
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route("business.inventory.frames.index"),
            {
                search,
                category: activeCategory !== "all" ? activeCategory : undefined,
                low_stock: filters.low_stock,
            },
            { preserveState: true }
        );
    };

    const handleCategoryFilter = (category: string) => {
        setActiveCategory(category);
        router.get(
            route("business.inventory.frames.index"),
            {
                search,
                category: category !== "all" ? category : undefined,
                low_stock: filters.low_stock,
            },
            { preserveState: true }
        );
    };

    const toggleLowStock = () => {
        router.get(
            route("business.inventory.frames.index"),
            {
                search,
                category: activeCategory !== "all" ? activeCategory : undefined,
                low_stock: !filters.low_stock,
            },
            { preserveState: true }
        );
    };

    const deleteFrame = (id: number) => {
        if (confirm(t("common.confirm_delete"))) {
            router.delete(route("business.inventory.frames.destroy", id));
        }
    };

    const handleExportCSV = () => {
        const headers = [
            t("inventory.frames.fields.sku"),
            t("inventory.frames.fields.brand_model"),
            t("inventory.frames.fields.category"),
            t("inventory.frames.fields.quantity"),
            t("inventory.frames.fields.price"),
        ];

        const data = frames.data.map((item) => [
            item.sku,
            `${item.brand} ${item.model}`,
            t(`inventory.frames.categories.${item.category}`),
            item.quantity,
            item.selling_price,
        ]);

        exportToCSV(data, "frames-inventory", headers);
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

    const categoryTabs = [
        { key: "all", label: "All" },
        { key: "optical", label: "Optical" },
        { key: "sunglasses", label: "Sunglasses" },
        { key: "sports", label: "Sports" },
        { key: "kids", label: "Kids" },
    ];

    // Calculate stats from data if not provided
    const calculatedStats = {
        total: stats?.total || frames.data.length,
        lowStock:
            stats?.lowStock ||
            frames.data.filter((f) => f.quantity <= f.low_stock_threshold)
                .length,
        totalValue:
            stats?.totalValue ||
            frames.data.reduce(
                (sum, f) => sum + f.selling_price * f.quantity,
                0
            ),
        brands:
            stats?.brands ||
            [...new Set(frames.data.map((f) => f.brand))].length,
    };

    const columns: Column<Frame>[] = [
        {
            header: t("inventory.frames.fields.sku"),
            accessor: (item: Frame) => (
                <span className="font-mono text-sm">{item.sku}</span>
            ),
        },
        {
            header: t("inventory.frames.fields.brand_model"),
            accessor: (item: Frame) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                        <Glasses className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <div className="font-medium text-text-primary">
                            {item.brand} - {item.model}
                        </div>
                        <div className="text-xs text-text-muted">
                            {item.color_name}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: t("inventory.frames.fields.category"),
            accessor: (item: Frame) => (
                <Badge variant="info">
                    {t(`inventory.frames.categories.${item.category}`)}
                </Badge>
            ),
        },
        {
            header: t("inventory.frames.fields.quantity"),
            accessor: (item: Frame) => (
                <Badge
                    variant={
                        item.quantity <= item.low_stock_threshold
                            ? "danger"
                            : "success"
                    }
                >
                    {item.quantity}{" "}
                    {item.quantity <= item.low_stock_threshold && "⚠"}
                </Badge>
            ),
        },
        {
            header: t("inventory.frames.fields.price"),
            accessor: (item: Frame) => (
                <span className="font-bold text-text-primary">
                    {formatCurrency(item.selling_price)}
                </span>
            ),
        },
        {
            header: t("common.actions.title"),
            accessor: (item: Frame) => (
                <div className="flex gap-2">
                    <Link
                        href={route("business.inventory.frames.edit", item.id)}
                    >
                        <Button variant="secondary" size="sm">
                            <Pencil className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteFrame(item.id)}
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
                        {t("inventory.frames.title")}
                    </h2>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={handleExportCSV}>
                            <FileText className="w-4 h-4 me-2" />
                            {t("common.export_csv")}
                        </Button>
                        <Link href={route("business.inventory.frames.create")}>
                            <Button className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                {t("inventory.frames.create_button")}
                            </Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={t("inventory.frames.title")} />

            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Frames"
                        value={calculatedStats.total}
                        icon={Glasses}
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

                {/* Category Filter Tabs */}
                <Card className="p-2">
                    <div className="flex flex-wrap gap-2">
                        {categoryTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleCategoryFilter(tab.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    activeCategory === tab.key
                                        ? "bg-primary-default text-white"
                                        : "bg-bg-subtle text-text-muted hover:bg-bg-subtle/80 hover:text-text-primary"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Search & Low Stock Filter */}
                <Card className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <form
                            onSubmit={handleSearch}
                            className="relative flex-1 w-full"
                        >
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t("common.search")}
                                className="w-full pl-10 pr-4 py-2 bg-bg-base border border-border-default rounded-lg focus:ring-2 focus:ring-interactive-primary focus:border-transparent transition-all"
                            />
                        </form>

                        <Button
                            variant={filters.low_stock ? "danger" : "secondary"}
                            onClick={toggleLowStock}
                            className="flex items-center gap-2 whitespace-nowrap"
                        >
                            <AlertTriangle className="w-4 h-4" />
                            {filters.low_stock
                                ? "Showing Low Stock"
                                : t("inventory.frames.low_stock_filter")}
                        </Button>
                    </div>
                </Card>

                {/* Table */}
                <Card>
                    <DataTable<Frame>
                        columns={columns}
                        data={frames.data}
                        keyField="id"
                        meta={frames.meta}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
