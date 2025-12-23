import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";

interface Business {
    name: string;
    email: string;
    phone: string;
    address: string;
    tax_number: string;
    registration_number: string;
}

interface SettingsProps {
    business: Business;
}

export default function Settings({ business }: SettingsProps) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        name: business.name,
        email: business.email || "",
        phone: business.phone || "",
        address: business.address || "",
        tax_number: business.tax_number || "",
        registration_number: business.registration_number || "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("business.settings.update"));
    };

    return (
        <AuthenticatedLayout>
            <Head title={t("business.settings.title")} />

            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-text-primary">
                    {t("business.settings.title")}
                </h1>

                <form onSubmit={submit} className="bg-bg-primary p-6 rounded-xl border border-border-subtle shadow-sm space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">
                            {t("business.settings.fields.name")}
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="mt-1 block w-full rounded-md border-border-subtle bg-bg-muted text-text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            required
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">
                                {t("business.settings.fields.email")}
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                className="mt-1 block w-full rounded-md border-border-subtle bg-bg-muted text-text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">
                                {t("business.settings.fields.phone")}
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData("phone", e.target.value)}
                                className="mt-1 block w-full rounded-md border-border-subtle bg-bg-muted text-text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary">
                            {t("business.settings.fields.address")}
                        </label>
                        <textarea
                            value={data.address}
                            onChange={(e) => setData("address", e.target.value)}
                            className="mt-1 block w-full rounded-md border-border-subtle bg-bg-muted text-text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            rows={3}
                        />
                        {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">
                                {t("business.settings.fields.tax_number")}
                            </label>
                            <input
                                type="text"
                                value={data.tax_number}
                                onChange={(e) => setData("tax_number", e.target.value)}
                                className="mt-1 block w-full rounded-md border-border-subtle bg-bg-muted text-text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                            {errors.tax_number && <p className="mt-1 text-xs text-red-500">{errors.tax_number}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">
                                {t("business.settings.fields.registration_number")}
                            </label>
                            <input
                                type="text"
                                value={data.registration_number}
                                onChange={(e) => setData("registration_number", e.target.value)}
                                className="mt-1 block w-full rounded-md border-border-subtle bg-bg-muted text-text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                            {errors.registration_number && <p className="mt-1 text-xs text-red-500">{errors.registration_number}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                        >
                            {t("business.settings.submit_btn")}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
