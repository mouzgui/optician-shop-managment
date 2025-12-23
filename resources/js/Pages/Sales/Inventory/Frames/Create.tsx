import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import FrameForm from "@/Components/Forms/FrameForm";

export default function Create() {
    const { t } = useTranslation();

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
        post(route("business.inventory.frames.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-4">
                    <Link
                        href={route("business.inventory.frames.index")}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {t("inventory.frames.add_new")}
                    </h2>
                </div>
            }
        >
            <Head title={t("inventory.frames.add_new")} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit}>
                                <FrameForm
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    processing={processing}
                                    onCancel={() => reset()}
                                    submitLabel={t("common.create")}
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
