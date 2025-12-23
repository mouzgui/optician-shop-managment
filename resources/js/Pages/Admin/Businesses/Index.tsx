import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";

interface Business {
    id: number;
    name: string;
    is_active: boolean;
    owner?: {
        name: string;
        email: string;
    };
}

interface IndexProps {
    businesses: {
        data: Business[];
        links: any;
    };
}

export default function Index({ businesses }: IndexProps) {
    const { t } = useTranslation();

    const toggleStatus = (id: number) => {
        router.post(route("admin.businesses.toggle-status", id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={t("admin.businesses.index.title")} />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-text-primary">
                        {t("admin.businesses.index.title")}
                    </h1>
                    <Link
                        href={route("admin.businesses.create")}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        {t("admin.businesses.index.create_btn")}
                    </Link>
                </div>

                <div className="bg-bg-primary rounded-xl border border-border-subtle shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-border-subtle">
                        <thead className="bg-bg-muted">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    {t("admin.businesses.fields.name")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    {t("admin.businesses.fields.owner")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    {t("admin.businesses.fields.status")}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    {t("admin.businesses.fields.actions")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            {businesses.data.map((business) => (
                                <tr key={business.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                                        {business.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                        {business.owner?.name} ({business.owner?.email})
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => toggleStatus(business.id)}
                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                business.is_active
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {business.is_active
                                                ? t("common.status.active")
                                                : t("common.status.inactive")}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            href={route("admin.businesses.edit", business.id)}
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
