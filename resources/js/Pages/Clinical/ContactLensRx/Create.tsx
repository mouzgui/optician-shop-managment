import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/Components/UI/Button";
import { Card } from "@/Components/UI/Card";
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
                        className="text-text-muted hover:text-text-primary transition-colors"
                    >
                        <ArrowLeftIcon className="w-6 h-6 icon-flip" />
                    </Link>
                    <h2 className="font-semibold text-xl text-text-primary leading-tight">
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
                    <Card>
                        <form onSubmit={submit} className="space-y-6">
                            <ContactLensRxForm
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
                                    {t("common.reset")}
                                </Button>
                                <Button type="submit" isLoading={processing}>
                                    {t("common.save")}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
