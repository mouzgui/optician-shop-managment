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

interface Customer extends CustomerSummary {
    email: string | null;
    address: string | null;
    date_of_birth: string | null;
    notes: string | null;
    family_head_id: number | null;
    branch_id: number | null;
}

interface Props {
    customer: Customer;
    branches: Branch[];
    familyHead: CustomerSummary | null;
}

export default function Edit({ customer, branches, familyHead }: Props) {
    const { t } = useTranslation();

    const { data, setData, patch, processing, errors, reset } = useForm({
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        email: customer.email || "",
        address: customer.address || "",
        date_of_birth: customer.date_of_birth || "",
        notes: customer.notes || "",
        family_head_id: customer.family_head_id || "",
        branch_id: customer.branch_id || "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route("business.customers.update", customer.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route("business.customers.show", customer.id)}
                        className="text-text-muted hover:text-text-primary transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 icon-flip" />
                    </Link>
                    <h2 className="font-semibold text-xl text-text-primary leading-tight">
                        {t("customers.edit_customer")}: {customer.first_name}{" "}
                        {customer.last_name}
                    </h2>
                </div>
            }
        >
            <Head title={t("customers.edit_customer")} />

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
                                initialFamilyHead={familyHead}
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
