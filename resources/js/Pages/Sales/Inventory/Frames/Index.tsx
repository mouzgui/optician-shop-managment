import React from "react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Card } from "@/Components/UI/Card";
import { Button } from "@/Components/UI/Button";
import { Badge } from "@/Components/UI/Badge";
import { DataTable } from "@/Components/UI/DataTable";

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
}

export default function Index({ frames, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = React.useState(filters.search || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            "/business/inventory/frames",
            {
                search,
                category: filters.category,
                low_stock: filters.low_stock,
            },
            { preserveState: true }
        );
    };

    const toggleLowStock = () => {
        router.get(
            "/business/inventory/frames",
            {
                search,
                category: filters.category,
                low_stock: !filters.low_stock,
            },
            { preserveState: true }
        );
    };

    const deleteFrame = (id: number) => {
        if (confirm(t("common.confirm_delete"))) {
            router.delete(`/business/inventory/frames/${id}`);
        }
    };

    const columns = [
        {
            header: t("inventory.frames.fields.sku"),
            accessor: "sku",
        },
        {
            header: t("inventory.frames.fields.brand_model"),
            accessor: (item: Frame) => (
                <div>
                    <div className="font-medium text-text-primary">
                        {item.brand} - {item.model}
                    </div>
                    <div className="text-xs text-text-muted">
                        {item.color_name}
                    </div>
                </div>
            ),
        },
        {
            header: t("inventory.frames.fields.category"),
            accessor: (item: Frame) =>
                t(`inventory.frames.categories.${item.category}`),
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
                    {item.quantity}
                </Badge>
            ),
        },
        {
            header: t("inventory.frames.fields.price"),
            accessor: (item: Frame) => (
                <span className="font-bold text-text-primary">
                    {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "AED",
                    }).format(item.selling_price)}
                </span>
            ),
        },
        {
            header: t("common.actions.title"),
            accessor: (item: Frame) => (
                <div className="flex gap-2">
                    <Link
                        href={`/business/inventory/frames/${item.id}/edit`}
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
                    <Link href="/business/inventory/frames/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            {t("inventory.frames.create_button")}
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title={t("inventory.frames.title")} />

            <div className="space-y-6">
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
                            {t("inventory.frames.low_stock_filter")}
                        </Button>
                    </div>
                </Card>

                <Card>
                    <DataTable
                        columns={columns}
                        data={frames.data}
                        meta={frames.meta}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
