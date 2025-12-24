import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import LensForm from "@/Components/Forms/LensForm";
import { Card } from "@/Components/UI/Card";

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
        lead_time_days: lens.lead_time_days || "",
        is_active: lens.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route("business.inventory.lenses.update", lens.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route("business.inventory.lenses.index")}
                        className="text-text-muted hover:text-text-primary transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 icon-flip" />
                    </Link>
                    <h2 className="font-semibold text-xl text-text-primary leading-tight">
                        {t("inventory.lenses.edit_lens")}
                    </h2>
                </div>
            }
        >
            <Head title={t("inventory.lenses.edit_lens")} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <form onSubmit={submit}>
                            <LensForm
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
