import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
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
            "/business/inventory/contact-lenses",
            { search },
            { preserveState: true }
        );
    };

    const deleteCL = (id: number) => {
        if (confirm(t("common.confirm_delete"))) {
            router.delete(
                `/business/inventory/contact-lenses/${id}`
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
            header: t("inventory.contact_lenses.fields.stock"),
            accessor: (item: ContactLens) => (
                <div className="flex flex-col">
                    <Badge
                        variant={
                            item.boxes_in_stock > 5 ? "success" : "warning"
                        }
                    >
                        {item.boxes_in_stock}{" "}
                        {t("inventory.contact_lenses.fields.boxes")}
                    </Badge>
                    <span className="text-[10px] text-text-muted mt-1">
                        {item.box_quantity}{" "}
                        {t("inventory.contact_lenses.fields.per_box")}
                    </span>
                </div>
            ),
        },
        {
            header: t("inventory.contact_lenses.fields.price"),
            accessor: (item: ContactLens) => (
                <span className="font-bold text-text-primary">
                    {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: business.currency_code,
                    }).format(item.selling_price_per_box)}
                </span>
            ),
        },
        {
            header: t("common.actions.title"),
            accessor: (item: ContactLens) => (
                <div className="flex gap-2">
                    <Link
                        href={`/business/inventory/contact-lenses/${item.id}/edit`}
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
                        {t("inventory.contact_lenses.title")}
                    </h2>
                    <Link
                        href="/business/inventory/contact-lenses/create"
                    >
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            {t("inventory.contact_lenses.create_button")}
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title={t("inventory.contact_lenses.title")} />

            <div className="space-y-6">
                <Card className="p-4">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t("common.search")}
                            className="w-full pl-10 pr-4 py-2 bg-bg-base border border-border-default rounded-lg focus:ring-2 focus:ring-interactive-primary focus:border-transparent transition-all"
                        />
                    </form>
                </Card>

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
