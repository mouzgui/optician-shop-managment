import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/Components/UI/Button";
import { DataTable } from "@/Components/UI/DataTable";

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
    lenses?: {
        data: Lens[];
        links: any[];
        meta: any;
    };
    filters?: {
        search?: string;
    };
}

export default function Index({ lenses = { data: [], links: [], meta: {} }, filters = {} }: Props) {
    const { t } = useTranslation();
    const { business } = usePage<any>().props;
    const [search, setSearch] = React.useState(filters.search || "");

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
            "/business/inventory/lenses",
            { search },
            { preserveState: true }
        );
    };

    const deleteLens = (id: number) => {
        if (confirm(safeT("common.confirm_delete", "Are you sure you want to delete this item?"))) {
            router.delete(`/business/inventory/lenses/${id}`);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: business?.currency_code || "USD",
        }).format(amount);
    };

    const getTypeLabel = (type: string) => {
        const typeLabels: Record<string, string> = {
            single_vision: "Single Vision",
            progressive: "Progressive",
            bifocal: "Bifocal",
            office: "Office",
            sports: "Sports",
        };
        return typeLabels[type] || type;
    };

    const formatCoatings = (coatings: string[] | string | null) => {
        if (!coatings) return "-";
        if (typeof coatings === "string") {
            try {
                const parsed = JSON.parse(coatings);
                return Array.isArray(parsed) ? parsed.join(", ") : coatings;
            } catch {
                return coatings;
            }
        }
        return Array.isArray(coatings) ? coatings.join(", ") : "-";
    };

    const columns = [
        {
            header: safeT("inventory.lenses.fields.brand_name", "Brand / Name"),
            accessor: (item: Lens) => (
                <div>
                    <div className="font-medium text-text-primary">
                        {item.brand} - {item.name}
                    </div>
                    <div className="text-xs text-text-muted">
                        {formatCoatings(item.coatings)}
                    </div>
                </div>
            ),
        },
        {
            header: safeT("inventory.lenses.fields.type", "Type"),
            accessor: (item: Lens) => getTypeLabel(item.type),
        },
        {
            header: safeT("inventory.lenses.fields.index", "Index"),
            accessor: "index",
        },
        {
            header: safeT("inventory.lenses.fields.lab_supplier", "Supplier"),
            accessor: (item: Lens) => (
                <div>
                    <div className="text-text-primary">
                        {item.lab_supplier || "-"}
                    </div>
                    {item.lead_time_days && (
                        <div className="text-xs text-text-muted">
                            {item.lead_time_days} {safeT("common.days", "days")}
                        </div>
                    )}
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
                        {safeT("inventory.lenses.title", "Prescription Lenses")}
                    </h2>
                    <Link href="/business/inventory/lenses/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            {safeT("inventory.lenses.create_button", "Add Lens")}
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title={safeT("inventory.lenses.title", "Prescription Lenses")} />

            <div className="space-y-6">
                <div className="bg-card-bg rounded-xl border border-card-border shadow-theme-md overflow-hidden p-4">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={safeT("common.search", "Search...")}
                            className="w-full pl-10 pr-4 py-2 bg-bg-base border border-border-default rounded-lg focus:ring-2 focus:ring-interactive-primary focus:border-transparent transition-all"
                        />
                    </form>
                </div>

                <div className="bg-card-bg rounded-xl border border-card-border shadow-theme-md overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={lenses.data || []}
                        meta={lenses.meta}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
