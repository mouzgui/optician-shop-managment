import React from "react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { 
    PlusIcon, 
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { Card } from "@/Components/UI/Card";
import { Button } from "@/Components/UI/Button";
import { Badge } from "@/Components/UI/Badge";
import { DataTable } from "@/Components/UI/DataTable";
import Pagination from "@/Components/Pagination";

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
        router.get(route("business.inventory.frames.index"), { 
            search, 
            category: filters.category,
            low_stock: filters.low_stock 
        }, { preserveState: true });
    };

    const toggleLowStock = () => {
        router.get(route("business.inventory.frames.index"), { 
            search, 
            category: filters.category,
            low_stock: !filters.low_stock 
        }, { preserveState: true });
    };

    const deleteFrame = (id: number) => {
        if (confirm(t("common.confirm_delete"))) {
            router.delete(route("business.inventory.frames.destroy", id));
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
                    <div className="text-xs text-text-muted">{item.color_name}</div>
                </div>
            ),
        },
        {
            header: t("inventory.frames.fields.category"),
            accessor: (item: Frame) => t(`inventory.frames.categories.${item.category}`),
        },
        {
            header: t("inventory.frames.fields.quantity"),
            accessor: (item: Frame) => (
                <Badge variant={item.quantity <= item.low_stock_threshold ? "danger" : "success"}>
                    {item.quantity}
                </Badge>
            ),
        },
        {
            header: t("inventory.frames.fields.selling_price"),
            accessor: (item: Frame) => (
                <span className="font-medium text-text-primary">
                    {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "USD", // Should be dynamic
                    }).format(item.selling_price)}
                </span>
            ),
        },
        {
            header: t("common.actions"),
            className: "text-right",
            accessor: (item: Frame) => (
                <div className="flex justify-end gap-2">
                    <Link href={route("business.inventory.frames.edit", item.id)}>
                        <Button variant="ghost" size="sm">
                            <PencilSquareIcon className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteFrame(item.id)}
                        className="text-status-error-text hover:bg-status-error-bg/10"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={t("inventory.frames.title")} />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">
                            {t("inventory.frames.title")}
                        </h1>
                    </div>
                    <Link href={route("business.inventory.frames.create")}>
                        <Button>
                            <PlusIcon className="w-4 h-4 mr-2" />
                            {t("inventory.frames.add_new")}
                        </Button>
                    </Link>
                </div>

                <Card>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <form onSubmit={handleSearch} className="flex-1 max-w-md">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-text-muted" />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-border-default rounded-lg bg-bg-primary text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-interactive-primary focus:border-transparent sm:text-sm"
                                    placeholder={t("inventory.frames.search_placeholder")}
                                />
                            </div>
                        </form>

                        <div className="flex items-center gap-3">
                            <Button 
                                variant={filters.low_stock ? "danger" : "secondary"}
                                size="sm"
                                onClick={toggleLowStock}
                            >
                                <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                                {t("inventory.frames.filters.low_stock")}
                            </Button>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={frames.data}
                        keyField="id"
                        emptyMessage={t("inventory.frames.no_results")}
                    />

                    <div className="mt-6">
                        <Pagination meta={frames.meta} />
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
    );
}
