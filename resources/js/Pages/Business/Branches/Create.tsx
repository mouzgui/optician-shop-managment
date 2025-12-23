import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";

export default function Create() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        address: "",
        phone: "",
        email: "",
        is_headquarters: false,
        is_active: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("business.branches.store"));
    };

    return (
        <AuthenticatedLayout>
            <Head title={t("business.branches.create.title")} />

            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-text-primary">
                    {t("business.branches.create.title")}
                </h1>

                <form onSubmit={submit} className="bg-bg-primary p-6 rounded-xl border border-border-subtle shadow-sm space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">
                            {t("business.branches.fields.name")}
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

                    <div>
                        <label className="block text-sm font-medium text-text-secondary">
                            {t("business.branches.fields.address")}
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
                                {t("business.branches.fields.phone")}
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData("phone", e.target.value)}
                                className="mt-1 block w-full rounded-md border-border-subtle bg-bg-muted text-text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">
                                {t("business.branches.fields.email")}
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                className="mt-1 block w-full rounded-md border-border-subtle bg-bg-muted text-text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_headquarters"
                                checked={data.is_headquarters}
                                onChange={(e) => setData("is_headquarters", e.target.checked)}
                                className="rounded border-border-subtle text-primary-600 shadow-sm focus:ring-primary-500"
                            />
                            <label htmlFor="is_headquarters" className="text-sm font-medium text-text-secondary">
                                {t("business.branches.fields.is_hq")}
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData("is_active", e.target.checked)}
                                className="rounded border-border-subtle text-primary-600 shadow-sm focus:ring-primary-500"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-text-secondary">
                                {t("business.branches.fields.active_status")}
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                        >
                            {t("business.branches.create.submit_btn")}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
