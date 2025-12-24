import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
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
            "/business/inventory/lenses",
            { search },
            { preserveState: true }
        );
    };

    const deleteLens = (id: number) => {
        if (confirm(t("common.confirm_delete"))) {
            router.delete(`/business/inventory/lenses/${id}`);
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
            header: t("inventory.lenses.fields.price"),
            accessor: (item: Lens) => (
                <span className="font-bold text-text-primary">
                    {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: business.currency_code,
                    }).format(item.selling_price)}
                </span>
            ),
        },
        {
            header: t("common.actions.title"),
            accessor: (item: Lens) => (
                <div className="flex gap-2">
                    <Link
                        href={`/business/inventory/lenses/${item.id}/edit`}
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
                        {t("inventory.lenses.title")}
                    </h2>
                    <Link href="/business/inventory/lenses/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            {t("inventory.lenses.create_button")}
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title={t("inventory.lenses.title")} />

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
                        data={lenses.data}
                        meta={lenses.meta}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
