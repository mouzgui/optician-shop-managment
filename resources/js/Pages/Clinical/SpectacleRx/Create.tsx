import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import SpectacleRxForm from "@/Components/Forms/SpectacleRxForm";

interface Customer {
    id: number;
    full_name: string;
}

interface Props {
    customer: Customer;
}

export default function Create({ customer }: Props) {
    const { t } = useTranslation();

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_id: customer.id,
        prescribed_at: new Date().toISOString().split("T")[0],
        od_sphere: "",
        od_cylinder: "",
        od_axis: "",
        od_add: "",
        od_prism: "",
        os_sphere: "",
        os_cylinder: "",
        os_axis: "",
        os_add: "",
        os_prism: "",
        pd_far: "",
        pd_near: "",
        pd_type: "single",
        notes: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("business.spectacle-rx.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-4">
                    <Link
                        href={route("business.customers.show", customer.id)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {t("clinical.rx.new_spec_rx_for", {
                            name: customer.full_name,
                        })}
                    </h2>
                </div>
            }
        >
            <Head title={t("clinical.rx.new_spec_rx")} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <SpectacleRxForm
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                />

                                <div className="flex items-center justify-end space-x-4">
                                    <SecondaryButton
                                        onClick={() => reset()}
                                        disabled={processing}
                                    >
                                        {t("common.reset")}
                                    </SecondaryButton>
                                    <PrimaryButton disabled={processing}>
                                        {t("common.save")}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
