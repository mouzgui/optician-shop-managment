import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";

interface Staff {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    branch?: {
        name: string;
    };
}

interface IndexProps {
    staff: {
        data: Staff[];
        links: any;
    };
}

export default function Index({ staff }: IndexProps) {
    const { t } = useTranslation();

    const toggleStatus = (id: number) => {
        router.post(route("business.staff.toggle-status", id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={t("business.staff.index.title")} />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-text-primary">
                        {t("business.staff.index.title")}
                    </h1>
                    <Link
                        href={route("business.staff.create")}
                        className="px-4 py-2 bg-interactive-primary text-text-inverted rounded-lg hover:bg-interactive-primary-hover transition-colors"
                    >
                        {t("business.staff.index.create_btn")}
                    </Link>
                </div>

                <div className="bg-bg-primary rounded-xl border border-border-subtle shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-border-subtle">
                        <thead className="bg-bg-muted">
                            <tr>
                                <th className="px-6 py-3 text-start text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    {t("business.staff.fields.name")}
                                </th>
                                <th className="px-6 py-3 text-start text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    {t("business.staff.fields.role")}
                                </th>
                                <th className="px-6 py-3 text-start text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    {t("business.staff.fields.branch")}
                                </th>
                                <th className="px-6 py-3 text-start text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    {t("business.staff.fields.status")}
                                </th>
                                <th className="px-6 py-3 text-end text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    {t("business.staff.fields.actions")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            {staff.data.map((member) => (
                                <tr key={member.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-text-primary">
                                            {member.name}
                                        </div>
                                        <div className="text-xs text-text-secondary">
                                            {member.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                        {t(`roles.${member.role}`)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                        {member.branch?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() =>
                                                toggleStatus(member.id)
                                            }
                                            className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                                                member.is_active
                                                    ? "bg-status-success-bg text-status-success-text border-status-success-border"
                                                    : "bg-status-error-bg text-status-error-text border-status-error-border"
                                            }`}
                                        >
                                            {member.is_active
                                                ? t("common.status.active")
                                                : t("common.status.inactive")}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                        <Link
                                            href={route(
                                                "business.staff.edit",
                                                member.id
                                            )}
                                            className="text-text-link hover:text-text-link-hover"
                                        >
                                            {t("common.edit")}
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
