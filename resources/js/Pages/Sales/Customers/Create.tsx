import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import CustomerForm from "@/Components/Forms/CustomerForm";
import { Card } from "@/Components/UI/Card";

interface Branch {
    id: number;
    name: string;
}

interface CustomerSummary {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
}

interface Props {
    branches: Branch[];
}

export default function Create({ branches }: Props) {
    const { t } = useTranslation();

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        address: "",
        date_of_birth: "",
        notes: "",
        family_head_id: "",
        branch_id: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("business.customers.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route("business.customers.index")}
                        className="text-text-muted hover:text-text-primary transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 icon-flip" />
                    </Link>
                    <h2 className="font-semibold text-xl text-text-primary leading-tight">
                        {t("customers.add_new")}
                    </h2>
                </div>
            }
        >
            <Head title={t("customers.add_new")} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <form onSubmit={submit}>
                            <CustomerForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                branches={branches}
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
