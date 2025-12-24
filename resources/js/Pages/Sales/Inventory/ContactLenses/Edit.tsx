import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import ContactLensForm from "@/Components/Forms/ContactLensForm";
import { Card } from "@/Components/UI/Card";

interface ContactLens {
    id: number;
    brand: string;
    product_line: string;
    type: string;
    replacement_schedule: string;
    power: number;
    cylinder: number;
    axis: number;
    add: number;
    base_curve: number;
    diameter: number;
    box_quantity: number;
    boxes_in_stock: number;
    cost_price_per_box: number;
    selling_price_per_box: number;
    expiry_date: string;
    is_active: boolean;
}

interface Props {
    contactLens: ContactLens;
}

export default function Edit({ contactLens }: Props) {
    const { t } = useTranslation();

    const { data, setData, patch, processing, errors, reset } = useForm({
        brand: contactLens.brand || "",
        product_line: contactLens.product_line || "",
        type: contactLens.type || "",
        replacement_schedule: contactLens.replacement_schedule || "",
        power: contactLens.power || "",
        cylinder: contactLens.cylinder || "",
        axis: contactLens.axis || "",
        add: contactLens.add || "",
        base_curve: contactLens.base_curve || "",
        diameter: contactLens.diameter || "",
        box_quantity: contactLens.box_quantity || 1,
        boxes_in_stock: contactLens.boxes_in_stock || 0,
        cost_price_per_box: contactLens.cost_price_per_box || "",
        selling_price_per_box: contactLens.selling_price_per_box || "",
        expiry_date: contactLens.expiry_date || "",
        is_active: contactLens.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(
            route("business.inventory.contact-lenses.update", contactLens.id)
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route("business.inventory.contact-lenses.index")}
                        className="text-text-muted hover:text-text-primary transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 icon-flip" />
                    </Link>
                    <h2 className="font-semibold text-xl text-text-primary leading-tight">
                        {t("inventory.contact_lenses.edit_cl")}
                    </h2>
                </div>
            }
        >
            <Head title={t("inventory.contact_lenses.edit_cl")} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <form onSubmit={submit}>
                            <ContactLensForm
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
