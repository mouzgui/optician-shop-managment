import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
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
    contactLenses?: {
        data: ContactLens[];
        links: any[];
        meta: any;
    };
    filters?: {
        search?: string;
    };
}

export default function Index({ contactLenses = { data: [], links: [], meta: {} }, filters = {} }: Props) {
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
            "/business/inventory/contact-lenses",
            { search },
            { preserveState: true }
        );
    };

    const deleteCL = (id: number) => {
        if (confirm(safeT("common.confirm_delete", "Are you sure you want to delete this item?"))) {
            router.delete(
                `/business/inventory/contact-lenses/${id}`
            );
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
            spherical: "Spherical",
            toric: "Toric",
            multifocal: "Multifocal",
            color: "Color",
        };
        return typeLabels[type] || type;
    };

    const getScheduleLabel = (schedule: string) => {
        const scheduleLabels: Record<string, string> = {
            daily: "Daily",
            biweekly: "Bi-weekly",
            monthly: "Monthly",
            quarterly: "Quarterly",
            yearly: "Yearly",
        };
        return scheduleLabels[schedule] || schedule;
    };

    const columns = [
        {
            header: safeT("inventory.contact_lenses.fields.brand_line", "Brand / Product"),
            accessor: (item: ContactLens) => (
                <div>
                    <div className="font-medium text-text-primary">
                        {item.brand} - {item.product_line}
                    </div>
                    <div className="text-xs text-text-muted">
                        {getScheduleLabel(item.replacement_schedule)}
                    </div>
                </div>
            ),
        },
        {
            header: safeT("inventory.contact_lenses.fields.type", "Type"),
            accessor: (item: ContactLens) => getTypeLabel(item.type),
        },
        {
            header: "Power / Cyl",
            accessor: (item: ContactLens) => (
                <div className="text-sm text-text-primary">
                    {item.power !== null && (
                        <span>
                            {item.power > 0 ? "+" : ""}
                            {Number(item.power).toFixed(2)}
                        </span>
                    )}
                    {item.cylinder !== null && item.cylinder !== 0 && (
                        <span className="text-text-muted ms-1">
                            / {Number(item.cylinder).toFixed(2)}
                            {item.axis && ` x ${item.axis}°`}
                        </span>
                    )}
                </div>
            ),
        },
        {
            header: safeT("inventory.contact_lenses.fields.stock", "Stock"),
            accessor: (item: ContactLens) => (
                <div className="flex flex-col">
                    <Badge
                        variant={
                            item.boxes_in_stock > 5 ? "success" : "warning"
                        }
                    >
                        {item.boxes_in_stock} boxes
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
                        {safeT("inventory.contact_lenses.title", "Contact Lenses")}
                    </h2>
                    <Link
                        href="/business/inventory/contact-lenses/create"
                    >
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
                        data={contactLenses.data || []}
                        meta={contactLenses.meta}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
