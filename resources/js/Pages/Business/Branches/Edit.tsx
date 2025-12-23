import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";

interface Branch {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    is_headquarters: boolean;
    is_active: boolean;
}

interface EditProps {
    branch: Branch;
}

export default function Edit({ branch }: EditProps) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        name: branch.name,
        address: branch.address || "",
        phone: branch.phone || "",
        email: branch.email || "",
        is_headquarters: branch.is_headquarters,
        is_active: branch.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("business.branches.update", branch.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={t("business.branches.edit.title")} />

            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-text-primary">
                    {t("business.branches.edit.title")}
                </h1>

                <form
                    onSubmit={submit}
                    className="bg-bg-primary p-6 rounded-xl border border-border-subtle shadow-sm space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">
                            {t("business.branches.fields.name")}
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="mt-1 block w-full rounded-md border-border-default bg-bg-base text-text-primary shadow-sm focus:border-border-focus focus:ring-1 focus:ring-border-focus transition-colors"
                            required
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-status-error-text">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary">
                            {t("business.branches.fields.address")}
                        </label>
                        <textarea
                            value={data.address}
                            onChange={(e) => setData("address", e.target.value)}
                            className="mt-1 block w-full rounded-md border-border-default bg-bg-base text-text-primary shadow-sm focus:border-border-focus focus:ring-1 focus:ring-border-focus transition-colors"
                            rows={3}
                        />
                        {errors.address && (
                            <p className="mt-1 text-xs text-status-error-text">
                                {errors.address}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">
                                {t("business.branches.fields.phone")}
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-border-default bg-bg-base text-text-primary shadow-sm focus:border-border-focus focus:ring-1 focus:ring-border-focus transition-colors"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-xs text-status-error-text">
                                    {errors.phone}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">
                                {t("business.branches.fields.email")}
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-border-default bg-bg-base text-text-primary shadow-sm focus:border-border-focus focus:ring-1 focus:ring-border-focus transition-colors"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-status-error-text">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_headquarters"
                                checked={data.is_headquarters}
                                onChange={(e) =>
                                    setData("is_headquarters", e.target.checked)
                                }
                                className="rounded border-border-default text-interactive-primary shadow-sm focus:ring-border-focus"
                            />
                            <label
                                htmlFor="is_headquarters"
                                className="text-sm font-medium text-text-secondary"
                            >
                                {t("business.branches.fields.is_hq")}
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) =>
                                    setData("is_active", e.target.checked)
                                }
                                className="rounded border-border-default text-interactive-primary shadow-sm focus:ring-border-focus"
                            />
                            <label
                                htmlFor="is_active"
                                className="text-sm font-medium text-text-secondary"
                            >
                                {t("business.branches.fields.is_active")}
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                        >
                            {t("common.actions.cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-interactive-primary text-text-inverted rounded-lg hover:bg-interactive-primary-hover disabled:opacity-50 transition-colors"
                        >
                            {t("common.actions.save")}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
