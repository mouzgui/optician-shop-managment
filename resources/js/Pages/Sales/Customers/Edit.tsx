import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import CustomerForm from "@/Components/Forms/CustomerForm";

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
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <ArrowLeftIcon className="w-6 h-6 icon-flip" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {t("customers.edit_customer")}: {customer.first_name}{" "}
                        {customer.last_name}
                    </h2>
                </div>
            }
        >
            <Head title={t("customers.edit_customer")} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
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
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
