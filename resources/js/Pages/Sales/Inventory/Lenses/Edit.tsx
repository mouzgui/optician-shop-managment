import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
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
                <div className="flex items-center space-x-4">
                    <Link
                        href={route("business.inventory.lenses.index")}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {t("inventory.lenses.edit_lens")}
                    </h2>
                </div>
            }
        >
            <Head title={t("inventory.lenses.edit_lens")} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
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
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
