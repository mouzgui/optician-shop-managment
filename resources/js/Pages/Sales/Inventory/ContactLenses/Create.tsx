import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import ContactLensForm from "@/Components/Forms/ContactLensForm";
import { Card } from "@/Components/UI/Card";

export default function Create() {
    const { t } = useTranslation();

    const { data, setData, post, processing, errors, reset } = useForm({
        brand: "",
        product_line: "",
        type: "",
        replacement_schedule: "",
        power: "",
        cylinder: "",
        axis: "",
        add: "",
        base_curve: "",
        diameter: "",
        box_quantity: 1,
        boxes_in_stock: 0,
        cost_price_per_box: "",
        selling_price_per_box: "",
        expiry_date: "",
        is_active: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("business.inventory.contact-lenses.store"));
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
                        {t("inventory.contact_lenses.add_new")}
                    </h2>
                </div>
            }
        >
            <Head title={t("inventory.contact_lenses.add_new")} />

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
                                submitLabel={t("common.create")}
                            />
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
