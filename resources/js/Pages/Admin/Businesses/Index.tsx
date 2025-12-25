import React from "react";
import { Head, Link } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";
import { Button } from "@/Components/UI/Button";
import { Badge } from "@/Components/UI/Badge";
import { Card } from "@/Components/UI/Card";
import { Plus, Building2, Edit2 } from "lucide-react";

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
    };
}

export default function Index({ businesses }: IndexProps) {
    const { t } = useTranslation();

    // Simple defensive check
    const businessList = businesses?.data || [];

    return (
        <AuthenticatedLayout>
            <Head title={t("admin.businesses.index.title")} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl font-bold text-text-primary">
                        {t("admin.businesses.index.title")}
                    </h1>
                    <Link href="/admin/businesses/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            {t("admin.businesses.index.create_btn")}
                        </Button>
                    </Link>
                </div>

                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border-subtle">
                            <thead className="bg-bg-subtle">
                                <tr>
                                    <th className="px-6 py-4 text-start text-xs font-semibold text-text-muted uppercase">
                                        {t("admin.businesses.fields.name")}
                                    </th>
                                    <th className="px-6 py-4 text-start text-xs font-semibold text-text-muted uppercase">
                                        {t("admin.businesses.fields.owner")}
                                    </th>
                                    <th className="px-6 py-4 text-start text-xs font-semibold text-text-muted uppercase">
                                        {t("admin.businesses.fields.status")}
                                    </th>
                                    <th className="px-6 py-4 text-end text-xs font-semibold text-text-muted uppercase">
                                        {t("common.actions.title")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle bg-bg-base">
                                {businessList.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-text-muted">
                                            {t("common.noResults")}
                                        </td>
                                    </tr>
                                ) : (
                                    businessList.map((business) => (
                                        <tr key={business.id} className="hover:bg-bg-subtle transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-primary-default/10 flex items-center justify-center">
                                                        <Building2 className="w-4 h-4 text-primary-default" />
                                                    </div>
                                                    <span className="text-sm font-semibold text-text-primary">
                                                        {business.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-text-secondary">
                                                    {business.owner?.name || "N/A"}
                                                </div>
                                                <div className="text-xs text-text-muted">
                                                    {business.owner?.email || ""}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={business.is_active ? "success" : "danger"}>
                                                    {business.is_active
                                                        ? t("common.status.active")
                                                        : t("common.status.inactive")}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-end">
                                                <Link href={`/admin/businesses/${business.id}/edit`}>
                                                    <Button variant="secondary" size="sm" className="flex items-center gap-2">
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                        {t("common.edit")}
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
