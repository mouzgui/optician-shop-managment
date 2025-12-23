import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { Card } from "@/Components/UI/Card";
import { Button } from "@/Components/UI/Button";
import { DataTable } from "@/Components/UI/DataTable";
import { Badge } from "@/Components/UI/Badge";

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
}

interface Props {
    lenses: {
        data: Lens[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
    };
}

export default function Index({ lenses, filters }: Props) {
    const { t } = useTranslation();
    const { business } = usePage<any>().props;
    const [search, setSearch] = React.useState(filters.search || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route("business.inventory.lenses.index"),
            { search },
            { preserveState: true }
        );
    };

    const deleteLens = (id: number) => {
        if (confirm(t("common.confirm_delete"))) {
            router.delete(route("business.inventory.lenses.destroy", id));
        }
    };

    const columns = [
        {
            header: t("inventory.lenses.fields.brand_name"),
            accessor: (item: Lens) => (
                <div>
                    <div className="font-medium text-text-primary">
                        {item.brand} - {item.name}
                    </div>
                    <div className="text-xs text-text-muted">
                        {(item.coatings || []).join(", ")}
                    </div>
                </div>
            ),
        },
        {
            header: t("inventory.lenses.fields.type"),
            accessor: (item: Lens) => t(`inventory.lenses.types.${item.type}`),
        },
        {
            header: t("inventory.lenses.fields.index"),
            accessor: "index",
        },
        {
            header: t("inventory.lenses.fields.lab_supplier"),
            accessor: (item: Lens) => (
                <div>
                    <div className="text-text-primary">
                        {item.lab_supplier || "-"}
                    </div>
                    {item.lead_time_days && (
                        <div className="text-xs text-text-muted">
                            {item.lead_time_days} {t("common.days")}
                        </div>
                    )}
                </div>
            ),
        },
        {
            header: t("inventory.lenses.fields.selling_price"),
            accessor: (item: Lens) =>
                new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: business?.currency_code || "AED",
                }).format(item.selling_price),
        },
        {
            header: t("common.actions"),
            id: "actions",
            className: "text-end",
            accessor: (item: Lens) => (
                <div className="flex justify-end gap-3">
                    <Link
                        href={route("business.inventory.lenses.edit", item.id)}
                        className="text-interactive-primary hover:text-interactive-primary-hover transition-colors"
                    >
                        <PencilSquareIcon className="w-5 h-5" />
                    </Link>
                    <button
                        onClick={() => deleteLens(item.id)}
                        className="text-error-default hover:text-error-hover transition-colors"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-text-primary leading-tight">
                        {t("inventory.lenses.title")}
                    </h2>
                    <Link href={route("business.inventory.lenses.create")}>
                        <Button>
                            <PlusIcon className="w-4 h-4 me-2" />
                            {t("inventory.lenses.add_new")}
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title={t("inventory.lenses.title")} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <form
                                onSubmit={handleSearch}
                                className="flex-1 max-w-md"
                            >
                                <div className="relative">
                                    <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-text-muted" />
                                    </div>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="block w-full ps-10 pe-3 py-2 border border-border-default rounded-lg bg-bg-primary text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-interactive-primary focus:border-transparent sm:text-sm"
                                        placeholder={t(
                                            "inventory.lenses.search_placeholder"
                                        )}
                                    />
                                </div>
                            </form>
                        </div>

                        <DataTable
                            columns={columns}
                            data={lenses.data}
                            keyField="id"
                            emptyMessage={t("inventory.lenses.no_results")}
                            pagination={{
                                meta: lenses.meta,
                                links: lenses.links,
                            }}
                        />
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
