import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import CustomerForm from "@/Components/Forms/CustomerForm";

interface Branch {
    id: number;
    name: string;
}

interface Props {
    branches?: Branch[];
}

export default function Create({ branches = [] }: Props) {
    const { t } = useTranslation();

    // Safe translation helper
    const safeT = (key: string, fallback?: string) => {
        try {
            const result = t(key);
            return typeof result === "string" ? result : fallback || key;
        } catch {
            return fallback || key;
        }
    };

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
        post("/business/customers");
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href="/business/customers"
                        className="text-text-muted hover:text-text-primary transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 icon-flip" />
                    </Link>
                    <h2 className="font-semibold text-xl text-text-primary leading-tight">
                        {safeT("customers.add_new", "Add New Customer")}
                    </h2>
                </div>
            }
        >
            <Head title={safeT("customers.add_new", "Add New Customer")} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-card-bg rounded-xl border border-card-border shadow-theme-md overflow-hidden p-6">
                        <form onSubmit={submit}>
                            <CustomerForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                branches={branches}
                                onCancel={() => reset()}
                                submitLabel={safeT("common.create", "Create")}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

