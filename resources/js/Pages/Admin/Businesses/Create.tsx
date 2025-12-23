import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";

export default function Create() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        owner_name: "",
        owner_email: "",
        owner_password: "",
        primary_color: "#3b82f6",
        default_language: "en",
        currency_code: "USD",
        tax_rate: 0,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.businesses.store"));
    };

    return (
        <AuthenticatedLayout>
            <Head title={t("admin.businesses.create.title")} />

            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-text-primary">
                    {t("admin.businesses.create.title")}
                </h1>

                <form onSubmit={submit} className="bg-bg-primary p-6 rounded-xl border border-border-subtle shadow-sm space-y-4">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-text-primary border-b border-border-subtle pb-2">
                            {t("admin.businesses.sections.business_info")}
                        </h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">
                                {t("admin.businesses.fields.name")}
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                className="mt-1 block w-full rounded-md border-border-subtle bg-bg-muted text-text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">
                                    {t("admin.businesses.fields.primary_color")}
                                </label>
                                <input
                                    type="color"
                                    value={data.primary_color}
                                    onChange={(e) => setData("primary_color", e.target.value)}
                                    className="mt-1 block w-full h-10 rounded-md border-border-subtle bg-bg-muted"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">
                                    {t("admin.businesses.fields.default_language")}
                                </label>
                                <select
                                    value={data.default_language}
                                    onChange={(e) => setData("default_language", e.target.value)}
                                    className="mt-1 block w-full rounded-md border-border-subtle bg-bg-muted text-text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                >
                                    <option value="en">English</option>
                                    <option value="ar">Arabic</option>
                                    <option value="fr">French</option>
                                    <option value="es">Spanish</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <h2 className="text-lg font-semibold text-text-primary border-b border-border-subtle pb-2">
                            {t("admin.businesses.sections.owner_info")}
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary">
                                {t("admin.businesses.fields.owner_name")}
                            </label>
                            <input
                                type="text"
                                value={data.owner_name}
                                onChange={(e) => setData("owner_name", e.target.value)}
                                className="mt-1 block w-full rounded-md border-border-subtle bg-bg-muted text-text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                            {errors.owner_name && <p className="mt-1 text-xs text-red-500">{errors.owner_name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary">
                                {t("admin.businesses.fields.owner_email")}
                            </label>
                            <input
                                type="email"
                                value={data.owner_email}
                                onChange={(e) => setData("owner_email", e.target.value)}
                                className="mt-1 block w-full rounded-md border-border-subtle bg-bg-muted text-text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                            {errors.owner_email && <p className="mt-1 text-xs text-red-500">{errors.owner_email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary">
                                {t("admin.businesses.fields.owner_password")}
                            </label>
                            <input
                                type="password"
                                value={data.owner_password}
                                onChange={(e) => setData("owner_password", e.target.value)}
                                className="mt-1 block w-full rounded-md border-border-subtle bg-bg-muted text-text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                            {errors.owner_password && <p className="mt-1 text-xs text-red-500">{errors.owner_password}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                        >
                            {t("admin.businesses.create.submit_btn")}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
