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
    expiry_date: string;
    is_active: boolean;
}

interface Props {
    contactLenses: {
        data: ContactLens[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
    };
}

export default function Index({ contactLenses, filters }: Props) {
    const { t } = useTranslation();
    const { business } = usePage<any>().props;
    const [search, setSearch] = React.useState(filters.search || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route("business.inventory.contact-lenses.index"),
            { search },
            { preserveState: true }
        );
    };

    const deleteCL = (id: number) => {
        if (confirm(t("common.confirm_delete"))) {
            router.delete(
                route("business.inventory.contact-lenses.destroy", id)
            );
        }
    };

    const columns = [
        {
            header: t("inventory.contact_lenses.fields.brand_line"),
            accessor: (item: ContactLens) => (
                <div>
                    <div className="font-medium text-text-primary">
                        {item.brand} - {item.product_line}
                    </div>
                    <div className="text-xs text-text-muted">
                        {t(
                            `clinical.rx.replacement_schedule.${item.replacement_schedule}`
                        )}
                    </div>
                </div>
            ),
        },
        {
            header: t("inventory.contact_lenses.fields.type"),
            accessor: (item: ContactLens) =>
                t(`clinical.rx.types.${item.type}`),
        },
        {
            header: `${t("clinical.rx.sphere")} / ${t("clinical.rx.cylinder")}`,
            accessor: (item: ContactLens) => (
                <div className="text-sm text-text-primary">
                    {item.power !== null && (
                        <span>
                            {item.power > 0 ? "+" : ""}
                            {item.power.toFixed(2)}
                        </span>
                    )}
                    {item.cylinder !== null && (
                        <span className="text-text-muted ms-1">
                            / {item.cylinder.toFixed(2)}
                            {item.axis && ` x ${item.axis}°`}
                        </span>
                    )}
                </div>
            ),
        },
        {
            header: t("inventory.contact_lenses.boxes"),
            accessor: (item: ContactLens) => (
                <div>
                    <Badge
                        variant={item.boxes_in_stock <= 2 ? "danger" : "info"}
                    >
                        {item.boxes_in_stock}{" "}
                        {t("inventory.contact_lenses.boxes")}
                    </Badge>
                    {item.expiry_date && (
                        <div
                            className={`text-[10px] mt-1 ${
                                new Date(item.expiry_date) < new Date()
                                    ? "text-error-default font-medium"
                                    : "text-text-muted"
                            }`}
                        >
                            {t("inventory.contact_lenses.fields.expiry")}:{" "}
                            {item.expiry_date}
                        </div>
                    )}
                </div>
            ),
        },
        {
            header: t("inventory.contact_lenses.fields.selling_price_per_box"),
            accessor: (item: ContactLens) =>
                new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: business?.currency_code || "AED",
                }).format(item.selling_price_per_box),
        },
        {
            header: t("common.actions"),
            id: "actions",
            className: "text-end",
            accessor: (item: ContactLens) => (
                <div className="flex justify-end gap-3">
                    <Link
                        href={route(
                            "business.inventory.contact-lenses.edit",
                            item.id
                        )}
                        className="text-interactive-primary hover:text-interactive-primary-hover transition-colors"
                    >
                        <PencilSquareIcon className="w-5 h-5" />
                    </Link>
                    <button
                        onClick={() => deleteCL(item.id)}
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
                        {t("inventory.contact_lenses.title")}
                    </h2>
                    <Link
                        href={route("business.inventory.contact-lenses.create")}
                    >
                        <Button>
                            <PlusIcon className="w-4 h-4 me-2" />
                            {t("inventory.contact_lenses.add_new")}
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title={t("inventory.contact_lenses.title")} />

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
                                            "inventory.contact_lenses.search_placeholder"
                                        )}
                                    />
                                </div>
                            </form>
                        </div>

                        <DataTable
                            columns={columns}
                            data={contactLenses.data}
                            keyField="id"
                            emptyMessage={t(
                                "inventory.contact_lenses.no_results"
                            )}
                            pagination={{
                                meta: contactLenses.meta,
                                links: contactLenses.links,
                            }}
                        />
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
