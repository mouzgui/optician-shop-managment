import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/Components/UI/Button";
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

    const safeT = (key: string, fallback?: string) => {
        try {
            const result = t(key);
            return typeof result === "string" ? result : fallback || key;
        } catch {
            return fallback || key;
        }
    };

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
        post("/business/spectacle-rx");
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={`/business/customers/${customer.id}`}
                        className="text-text-muted hover:text-text-primary transition-colors"
                    >
                        <ArrowLeftIcon className="w-6 h-6 icon-flip" />
                    </Link>
                    <h2 className="font-semibold text-xl text-text-primary leading-tight">
                        {safeT("clinical.rx.new_spec_rx_for", "New Spectacle Rx for")} {customer.full_name}
                    </h2>
                </div>
            }
        >
            <Head title={safeT("clinical.rx.new_spec_rx", "New Spectacle Prescription")} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-card-bg rounded-xl border border-card-border shadow-theme-md overflow-hidden p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <SpectacleRxForm
                                data={data}
                                setData={setData}
                                errors={errors}
                            />

                            <div className="flex items-center justify-end gap-4 border-t border-border-subtle pt-6">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => reset()}
                                    disabled={processing}
                                >
                                    {safeT("common.reset", "Reset")}
                                </Button>
                                <Button type="submit" isLoading={processing}>
                                    {safeT("common.save", "Save")}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
