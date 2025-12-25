import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import LensForm from "@/Components/Forms/LensForm";

interface Lens {
    id: number;
    name: string;
    brand: string;
    type: string;
    material: string;
    index: string;
    coatings: string[];
    cost_price: number;
    selling_price: number;
    lab_supplier: string;
    lead_time_days: number;
    is_active: boolean;
}

interface Props {
    lens: Lens;
}

export default function Edit({ lens }: Props) {
    const { t } = useTranslation();

    const safeT = (key: string, fallback?: string) => {
        try {
            const result = t(key);
            return typeof result === "string" ? result : fallback || key;
        } catch {
            return fallback || key;
        }
    };

    const { data, setData, patch, processing, errors, reset } = useForm({
        name: lens.name || "",
        brand: lens.brand || "",
        type: lens.type || "",
        index: lens.index || "",
        coatings: lens.coatings || [],
        material: lens.material || "",
        cost_price: lens.cost_price || "",
        selling_price: lens.selling_price || "",
        lab_supplier: lens.lab_supplier || "",
        lead_time_days: lens.lead_time_days || 7,
        is_active: lens.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/business/inventory/lenses/${lens.id}`);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href="/business/inventory/lenses"
                        className="text-text-muted hover:text-text-primary transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 icon-flip" />
                    </Link>
                    <h2 className="font-semibold text-xl text-text-primary leading-tight">
                        {safeT("inventory.lenses.edit_lens", "Edit Lens")}
                    </h2>
                </div>
            }
        >
            <Head title={safeT("inventory.lenses.edit_lens", "Edit Lens")} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-card-bg rounded-xl border border-card-border shadow-theme-md overflow-hidden p-6">
                        <form onSubmit={submit}>
                            <LensForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                onCancel={() => reset()}
                                submitLabel={safeT("common.save", "Save")}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
