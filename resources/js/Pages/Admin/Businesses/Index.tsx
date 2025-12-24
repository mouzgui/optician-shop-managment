import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";
import { Button } from "@/Components/UI/Button";
import { Badge } from "@/Components/UI/Badge";
import { Card } from "@/Components/UI/Card";
import { Input } from "@/Components/UI/Input";
import { Plus, Search, Edit2, Building2, User, Mail } from "lucide-react";
import { debounce } from "lodash";

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
    filters: {
        search?: string;
    };
}

export default function Index({ businesses, filters }: IndexProps) {
    const { t } = useTranslation();

    const handleSearch = debounce((value: string) => {
        router.get(
            route("admin.businesses.index"),
            { search: value },
            { preserveState: true, replace: true }
        );
    }, 300);

    const toggleStatus = (id: number) => {
        router.post(route("admin.businesses.toggle-status", id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={t("admin.businesses.index.title")} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl font-bold text-text-primary">
                        {t("admin.businesses.index.title")}
                    </h1>
                    <Button
                        href={route("admin.businesses.create")}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {t("admin.businesses.index.create_btn")}
                    </Button>
                </div>

                <Card className="p-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <Input
                            placeholder={t("common.search")}
                            className="ps-10"
                            defaultValue={filters?.search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </Card>

                <Card className="overflow-hidden border-none shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border-subtle">
                            <thead className="bg-bg-subtle">
                                <tr>
                                    <th className="px-6 py-4 text-start text-xs font-semibold text-text-muted uppercase tracking-wider">
                                        {t("admin.businesses.fields.name")}
                                    </th>
                                    <th className="px-6 py-4 text-start text-xs font-semibold text-text-muted uppercase tracking-wider">
                                        {t("admin.businesses.fields.owner")}
                                    </th>
                                    <th className="px-6 py-4 text-start text-xs font-semibold text-text-muted uppercase tracking-wider">
                                        {t("admin.businesses.fields.status")}
                                    </th>
                                    <th className="px-6 py-4 text-end text-xs font-semibold text-text-muted uppercase tracking-wider">
                                        {t("common.actions.title")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle bg-bg-base">
                                {businesses.data.map((business) => (
                                    <tr
                                        key={business.id}
                                        className="group hover:bg-bg-subtle transition-colors"
                                    >
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
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1.5 text-sm text-text-secondary font-medium">
                                                    <User className="w-3.5 h-3.5 text-text-muted" />
                                                    {business.owner?.name}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {business.owner?.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() =>
                                                    toggleStatus(business.id)
                                                }
                                                className="hover:opacity-80 transition-opacity"
                                            >
                                                <Badge
                                                    variant={
                                                        business.is_active
                                                            ? "success"
                                                            : "danger"
                                                    }
                                                >
                                                    {business.is_active
                                                        ? t(
                                                              "common.status.active"
                                                          )
                                                        : t(
                                                              "common.status.inactive"
                                                          )}
                                                </Badge>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-end">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route(
                                                        "admin.businesses.edit",
                                                        business.id
                                                    )}
                                                >
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                        {t(
                                                            "common.actions.edit"
                                                        )}
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
