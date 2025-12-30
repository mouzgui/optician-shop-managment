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
    Circle,
    FileText,
} from "lucide-react";
import { Button } from "@/Components/UI/Button";
import { DataTable, Column } from "@/Components/UI/DataTable";
import { Card } from "@/Components/UI/Card";
import { Badge } from "@/Components/UI/Badge";
import { StatCard } from "@/Components/Charts/StatCard";
import { exportToCSV } from "@/Utils/csvExport";

interface Lens {
    id: number;
    brand: string;
    name: string;
    type: string;
    index: string;
    coatings: string[];
    selling_price: number;
    lab_supplier: string;
    lead_time_days: number;
    is_active: boolean;
    quantity?: number;
    low_stock_threshold?: number;
}

interface Props {
    lenses?: {
        data: Lens[];
        links: any[];
        meta: any;
    };
    filters?: {
        search?: string;
        type?: string;
    };
    stats?: {
        total: number;
        lowStock: number;
        totalValue: number;
        types: number;
    };
}

export default function Index({
    lenses = { data: [], links: [], meta: {} },
    filters = {},
    stats,
}: Props) {
    const { t, i18n } = useTranslation();
    const { business } = usePage<any>().props;
    const [search, setSearch] = React.useState(filters.search || "");
    const [activeType, setActiveType] = React.useState(filters.type || "all");

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
            route("business.inventory.lenses.index"),
            { search, type: activeType !== "all" ? activeType : undefined },
            { preserveState: true }
        );
    };

    const handleTypeFilter = (type: string) => {
        setActiveType(type);
        router.get(
            route("business.inventory.lenses.index"),
            { search, type: type !== "all" ? type : undefined },
            { preserveState: true }
        );
    };

    const deleteLens = (id: number) => {
        if (
            confirm(
                safeT(
                    "common.confirm_delete",
                    "Are you sure you want to delete this item?"
                )
            )
        ) {
            router.delete(route("business.inventory.lenses.destroy", id));
        }
    };

    const handleExportCSV = () => {
        const headers = [
            safeT("inventory.lenses.fields.name", "Name"),
            safeT("inventory.lenses.fields.type", "Type"),
            safeT("inventory.lenses.fields.index", "Index"),
            safeT("inventory.lenses.fields.supplier", "Supplier"),
            safeT("inventory.lenses.fields.price", "Price"),
        ];

        const data = lenses.data.map((item) => [
            `${item.brand} ${item.name}`,
            getTypeLabel(item.type),
            item.index,
            item.lab_supplier,
            item.selling_price,
        ]);

        exportToCSV(data, "lenses-inventory", headers);
    };

    const formatCoatings = (coatings: string[]) => {
        if (!coatings || coatings.length === 0) return "None";
        return (
            coatings.slice(0, 2).join(", ") +
            (coatings.length > 2 ? ` +${coatings.length - 2}` : "")
        );
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "AED",
        }).format(value);
    };

    const typeTabs = [
        { key: "all", label: "All" },
        { key: "single_vision", label: "Single Vision" },
        { key: "bifocal", label: "Bifocal" },
        { key: "progressive", label: "Progressive" },
    ];

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            single_vision: "Single Vision",
            bifocal: "Bifocal",
            progressive: "Progressive",
        };
        return labels[type] || type;
    };

    // Calculate stats from data if not provided
    const calculatedStats = {
        total: stats?.total || lenses.data.length,
        lowStock: stats?.lowStock || 0,
        totalValue:
            stats?.totalValue ||
            lenses.data.reduce((sum, l) => sum + l.selling_price, 0),
        types:
            stats?.types || [...new Set(lenses.data.map((l) => l.type))].length,
    };

    const columns: Column<Lens>[] = [
        {
            header: safeT("inventory.lenses.fields.name", "Name"),
            accessor: (item: Lens) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 flex items-center justify-center">
                        <Circle className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                        <div className="font-medium text-text-primary">
                            {item.brand} - {item.name}
                        </div>
                        <div className="text-xs text-text-muted">
                            {formatCoatings(item.coatings)}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: safeT("inventory.lenses.fields.type", "Type"),
            accessor: (item: Lens) => (
                <Badge variant="info">{getTypeLabel(item.type)}</Badge>
            ),
        },
        {
            header: safeT("inventory.lenses.fields.index", "Index"),
            accessor: (item: Lens) => (
                <span className="text-sm text-text-secondary">
                    {item.index}
                </span>
            ),
        },
        {
            header: safeT("inventory.lenses.fields.supplier", "Supplier"),
            accessor: (item: Lens) => (
                <div className="text-sm">
                    <div className="text-text-secondary">
                        {item.lab_supplier}
                    </div>
                    <div className="text-xs text-text-muted">
                        {item.lead_time_days} days lead time
                    </div>
                </div>
            ),
        },
        {
            header: safeT("inventory.lenses.fields.price", "Price"),
            accessor: (item: Lens) => (
                <span className="font-bold text-text-primary">
                    {formatCurrency(item.selling_price)}
                </span>
            ),
        },
        {
            header: safeT("common.actions.title", "Actions"),
            accessor: (item: Lens) => (
                <div className="flex gap-2">
                    <Link
                        href={route("business.inventory.lenses.edit", item.id)}
                    >
                        <Button variant="secondary" size="sm">
                            <Pencil className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteLens(item.id)}
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
                        {safeT("inventory.lenses.title", "Lenses")}
                    </h2>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={handleExportCSV}>
                            <FileText className="w-4 h-4 me-2" />
                            {t("common.export_csv")}
                        </Button>
                        <Link href={route("business.inventory.lenses.create")}>
                            <Button className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                {safeT(
                                    "inventory.lenses.create_button",
                                    "Add Lens"
                                )}
                            </Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={safeT("inventory.lenses.title", "Lenses")} />

            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        title={safeT(
                            "inventory.lenses.stats.total",
                            "Total Lenses"
                        )}
                        value={calculatedStats.total}
                        icon={Circle}
                        color="primary"
                    />
                    <StatCard
                        title={safeT(
                            "inventory.lenses.stats.low_stock",
                            "Low Stock"
                        )}
                        value={calculatedStats.lowStock}
                        icon={AlertTriangle}
                        color="danger"
                    />
                    <StatCard
                        title={safeT(
                            "inventory.lenses.stats.total_value",
                            "Total Value"
                        )}
                        value={formatCurrency(calculatedStats.totalValue)}
                        icon={DollarSign}
                        color="success"
                    />
                    <StatCard
                        title={safeT(
                            "inventory.lenses.stats.types",
                            "Lens Types"
                        )}
                        value={calculatedStats.types}
                        icon={Tag}
                        color="info"
                    />
                </div>

                {/* Type Filter Tabs */}
                <Card className="p-2">
                    <div className="flex flex-wrap gap-2">
                        {typeTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleTypeFilter(tab.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    activeType === tab.key
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
                    <DataTable<Lens>
                        columns={columns}
                        data={lenses.data}
                        keyField="id"
                        meta={lenses.meta}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
