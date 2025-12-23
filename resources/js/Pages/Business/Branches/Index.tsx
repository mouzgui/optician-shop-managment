import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";

interface Branch {
    id: number;
    name: string;
    address: string;
    phone: string;
    is_headquarters: boolean;
    is_active: boolean;
}

interface IndexProps {
    branches: {
        data: Branch[];
        links: any;
    };
}

export default function Index({ branches }: IndexProps) {
    const { t } = useTranslation();

    const toggleStatus = (id: number) => {
        router.post(route("business.branches.toggle-status", id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={t("business.branches.index.title")} />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-text-primary">
                        {t("business.branches.index.title")}
                    </h1>
                    <Link
                        href={route("business.branches.create")}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        {t("business.branches.index.create_btn")}
                    </Link>
                </div>

                <div className="bg-bg-primary rounded-xl border border-border-subtle shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-border-subtle">
                        <thead className="bg-bg-muted">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    {t("business.branches.fields.name")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    {t("business.branches.fields.contact")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    {t("business.branches.fields.status")}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    {t("business.branches.fields.actions")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            {branches.data.map((branch) => (
                                <tr key={branch.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-text-primary">
                                            {branch.name}
                                            {branch.is_headquarters && (
                                                <span className="ml-2 px-2 py-0.5 text-[10px] bg-primary-100 text-primary-800 rounded-full">
                                                    {t("business.branches.fields.hq")}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-text-secondary">{branch.address}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                        {branch.phone}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => toggleStatus(branch.id)}
                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                branch.is_active
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {branch.is_active
                                                ? t("common.status.active")
                                                : t("common.status.inactive")}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            href={route("business.branches.edit", branch.id)}
                                            className="text-primary-600 hover:text-primary-900"
                                        >
                                            {t("common.actions.edit")}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
