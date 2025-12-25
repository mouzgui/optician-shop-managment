import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import FrameForm from "@/Components/Forms/FrameForm";

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
        sku: "",
        barcode: "",
        brand: "",
        model: "",
        color_code: "",
        color_name: "",
        size_eye: "",
        size_bridge: "",
        size_temple: "",
        category: "",
        material: "",
        gender: "",
        cost_price: "",
        selling_price: "",
        quantity: 0,
        low_stock_threshold: 5,
        image_url: "",
        is_active: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/business/inventory/frames");
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href="/business/inventory/frames"
                        className="text-text-muted hover:text-text-primary transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 icon-flip" />
                    </Link>
                    <h2 className="font-semibold text-xl text-text-primary leading-tight">
                        {safeT("inventory.frames.add_new", "Add New Frame")}
                    </h2>
                </div>
            }
        >
            <Head title={safeT("inventory.frames.add_new", "Add New Frame")} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-card-bg rounded-xl border border-card-border shadow-theme-md overflow-hidden p-6">
                        <form onSubmit={submit}>
                            <FrameForm
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

