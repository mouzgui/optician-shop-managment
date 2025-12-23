import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";

interface Business {
    id: number;
    name: string;
    primary_color: string;
    default_language: string;
    currency_code: string;
    tax_rate: number;
    is_active: boolean;
    owner?: {
        name: string;
        email: string;
    };
}

interface EditProps {
    business: Business;
}

export default function Edit({ business }: EditProps) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        name: business.name,
        primary_color: business.primary_color || "#3b82f6",
        default_language: business.default_language || "en",
        currency_code: business.currency_code || "USD",
        tax_rate: business.tax_rate || 0,
        is_active: business.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.businesses.update", business.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={t("admin.businesses.edit.title")} />

            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-text-primary">
                    {t("admin.businesses.edit.title")}
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

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData("is_active", e.target.checked)}
                                className="rounded border-border-subtle text-primary-600 shadow-sm focus:ring-primary-500"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-text-secondary">
                                {t("admin.businesses.fields.active_status")}
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <h2 className="text-lg font-semibold text-text-primary border-b border-border-subtle pb-2">
                            {t("admin.businesses.sections.owner_info")}
                        </h2>
                        <div className="p-4 bg-bg-muted rounded-lg border border-border-subtle">
                            <p className="text-sm text-text-secondary">
                                <span className="font-semibold">{t("admin.businesses.fields.owner_name")}:</span> {business.owner?.name}
                            </p>
                            <p className="text-sm text-text-secondary">
                                <span className="font-semibold">{t("admin.businesses.fields.owner_email")}:</span> {business.owner?.email}
                            </p>
                        </div>
                        <p className="text-xs text-text-secondary italic">
                            {t("admin.businesses.edit.owner_note")}
                        </p>
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                        >
                            {t("admin.businesses.edit.submit_btn")}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
