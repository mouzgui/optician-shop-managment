import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import LensForm from "@/Components/Forms/LensForm";

export default function Create() {
    const { t } = useTranslation();

    // Safe translation helper
    const safeT = (key: string, fallback?: string) => {
        try {
            const result = t(key);
            return typeof result === "string" ? result : fallback || key;
        } catch {
            return fallback || key;
        }
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        brand: "",
        type: "",
        index: "",
        coatings: [],
        material: "",
        cost_price: "",
        selling_price: "",
        lab_supplier: "",
        lead_time_days: "",
        is_active: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/business/inventory/lenses");
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
                        {safeT("inventory.lenses.add_new", "Add New Lens")}
                    </h2>
                </div>
            }
        >
            <Head title={safeT("inventory.lenses.add_new", "Add New Lens")} />

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
                                submitLabel={safeT("common.create", "Create")}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

