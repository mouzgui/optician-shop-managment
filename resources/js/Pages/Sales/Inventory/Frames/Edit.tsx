import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import FrameForm from "@/Components/Forms/FrameForm";
import { Card } from "@/Components/UI/Card";

interface Frame {
    id: number;
    sku: string;
    barcode: string;
    brand: string;
    model: string;
    color_code: string;
    color_name: string;
    size_eye: number;
    size_bridge: number;
    size_temple: number;
    category: string;
    material: string;
    gender: string;
    cost_price: number;
    selling_price: number;
    quantity: number;
    low_stock_threshold: number;
    image_url: string;
    is_active: boolean;
}

interface Props {
    frame: Frame;
}

export default function Edit({ frame }: Props) {
    const { t } = useTranslation();

    const { data, setData, patch, processing, errors, reset } = useForm({
        sku: frame.sku || "",
        barcode: frame.barcode || "",
        brand: frame.brand || "",
        model: frame.model || "",
        color_code: frame.color_code || "",
        color_name: frame.color_name || "",
        size_eye: frame.size_eye || "",
        size_bridge: frame.size_bridge || "",
        size_temple: frame.size_temple || "",
        category: frame.category || "",
        material: frame.material || "",
        gender: frame.gender || "",
        cost_price: frame.cost_price || "",
        selling_price: frame.selling_price || "",
        quantity: frame.quantity || 0,
        low_stock_threshold: frame.low_stock_threshold || 5,
        image_url: frame.image_url || "",
        is_active: frame.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route("business.inventory.frames.update", frame.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route("business.inventory.frames.index")}
                        className="text-text-muted hover:text-text-primary transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 icon-flip" />
                    </Link>
                    <h2 className="font-semibold text-xl text-text-primary leading-tight">
                        {t("inventory.frames.edit_frame")}
                    </h2>
                </div>
            }
        >
            <Head title={t("inventory.frames.edit_frame")} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <form onSubmit={submit}>
                            <FrameForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                onCancel={() => reset()}
                                submitLabel={t("common.save")}
                            />
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
