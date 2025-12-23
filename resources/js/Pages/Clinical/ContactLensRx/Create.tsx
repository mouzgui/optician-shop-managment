import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ContactLensRxForm from "@/Components/Forms/ContactLensRxForm";

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
        od_base_curve: "",
        od_diameter: "",
        od_brand: "",
        os_sphere: "",
        os_cylinder: "",
        os_axis: "",
        os_base_curve: "",
        os_diameter: "",
        os_brand: "",
        replacement_schedule: "",
        notes: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("business.contact-lens-rx.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route("business.customers.show", customer.id)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {t("clinical.rx.new_cl_rx_for", {
                            name: customer.full_name,
                        })}
                    </h2>
                </div>
            }
        >
            <Head title={t("clinical.rx.new_cl_rx")} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <ContactLensRxForm
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                />

                                <div className="flex items-center justify-end gap-4">
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
