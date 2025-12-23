import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";

interface Branch {
    id: number;
    name: string;
}

interface CreateProps {
    branches: Branch[];
}

export default function Create({ branches }: CreateProps) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "receptionist",
        branch_id: branches[0]?.id || "",
        is_active: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("business.staff.store"));
    };

    return (
        <AuthenticatedLayout>
            <Head title={t("business.staff.create.title")} />

            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-text-primary">
                    {t("business.staff.create.title")}
                </h1>

                <form onSubmit={submit} className="bg-bg-primary p-6 rounded-xl border border-border-subtle shadow-sm space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">
                            {t("business.staff.fields.name")}
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
                                {t("business.staff.fields.email")}
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                className="mt-1 block w-full rounded-md border-border-subtle bg-bg-muted text-text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                required
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">
                                {t("business.staff.fields.password")}
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className="mt-1 block w-full rounded-md border-border-subtle bg-bg-muted text-text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                required
                            />
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">
                                {t("business.staff.fields.role")}
                            </label>
                            <select
                                value={data.role}
                                onChange={(e) => setData("role", e.target.value)}
                                className="mt-1 block w-full rounded-md border-border-subtle bg-bg-muted text-text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            >
                                <option value="optometrist">{t("roles.optometrist")}</option>
                                <option value="receptionist">{t("roles.receptionist")}</option>
                                <option value="sales_agent">{t("roles.sales_agent")}</option>
                                <option value="lab_technician">{t("roles.lab_technician")}</option>
                                <option value="inventory_manager">{t("roles.inventory_manager")}</option>
                            </select>
                            {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">
                                {t("business.staff.fields.branch")}
                            </label>
                            <select
                                value={data.branch_id}
                                onChange={(e) => setData("branch_id", e.target.value)}
                                className="mt-1 block w-full rounded-md border-border-subtle bg-bg-muted text-text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            >
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                            {errors.branch_id && <p className="mt-1 text-xs text-red-500">{errors.branch_id}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary">
                            {t("business.staff.fields.phone")}
                        </label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            className="mt-1 block w-full rounded-md border-border-subtle bg-bg-muted text-text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
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
                            {t("business.staff.fields.active_status")}
                        </label>
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                        >
                            {t("business.staff.create.submit_btn")}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
