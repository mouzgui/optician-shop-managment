import React from "react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import {
    MagnifyingGlassIcon,
    PlusIcon,
    EyeIcon,
    PencilSquareIcon,
    UserIcon,
    PhoneIcon,
    CalendarIcon,
} from "@heroicons/react/24/outline";
import { debounce } from "lodash";
import { DataTable } from "@/Components/UI/DataTable";
import { Button } from "@/Components/UI/Button";
import { Card } from "@/Components/UI/Card";
import { Badge } from "@/Components/UI/Badge";

interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    email: string | null;
    last_visit_at: string | null;
    branch: {
        id: number;
        name: string;
    } | null;
}

interface Props {
    customers: {
        data: Customer[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
    };
}

export default function Index({ customers, filters }: Props) {
    const { t } = useTranslation();

    const handleSearch = debounce((value: string) => {
        router.get(
            route("business.customers.index"),
            { search: value },
            { preserveState: true, replace: true }
        );
    }, 300);

    const columns = [
        {
            header: t("customers.fields.name"),
            accessor: (item: Customer) => (
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-interactive-primary/10 rounded-full flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-interactive-primary" />
                    </div>
                    <div className="ms-4">
                        <div className="text-sm font-medium text-text-primary">
                            {item.first_name} {item.last_name}
                        </div>
                        <div className="text-sm text-text-muted">
                            {item.email}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: t("customers.fields.phone"),
            accessor: (item: Customer) => (
                <div className="flex items-center text-sm text-text-primary">
                    <PhoneIcon className="h-4 w-4 me-2 text-text-muted" />
                    {item.phone}
                </div>
            ),
        },
        {
            header: t("customers.fields.branch"),
            accessor: (item: Customer) => (
                <Badge variant="info">
                    {item.branch?.name || t("common.none")}
                </Badge>
            ),
        },
        {
            header: t("customers.fields.last_visit"),
            accessor: (item: Customer) => (
                <div className="flex items-center text-sm text-text-primary">
                    <CalendarIcon className="h-4 w-4 me-2 text-text-muted" />
                    {item.last_visit_at
                        ? new Date(item.last_visit_at).toLocaleDateString()
                        : t("common.never")}
                </div>
            ),
        },
        {
            header: t("common.actions"),
            accessor: (item: Customer) => (
                <div className="flex justify-end gap-2">
                    <Link
                        href={route("business.customers.show", item.id)}
                        className="text-interactive-primary hover:text-interactive-hover"
                        title={t("common.view")}
                    >
                        <EyeIcon className="h-5 w-5" />
                    </Link>
                    <Link
                        href={route("business.customers.edit", item.id)}
                        className="text-status-warning-text hover:text-status-warning-text/80"
                        title={t("common.edit")}
                    >
                        <PencilSquareIcon className="h-5 w-5" />
                    </Link>
                </div>
            ),
            className: "text-end",
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={t("customers.title")} />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-text-primary">
                        {t("customers.title")}
                    </h1>
                    <Button
                        as={Link}
                        href={route("business.customers.create")}
                        icon={<PlusIcon className="w-4 h-4" />}
                    >
                        {t("customers.add_new")}
                    </Button>
                </div>

                <Card>
                    <div className="mb-6 relative">
                        <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-text-muted" />
                        </div>
                        <input
                            type="text"
                            defaultValue={filters.search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder={t("customers.search_placeholder")}
                            className="block w-full ps-10 pe-3 py-2 border border-border-default rounded-md bg-bg-base text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-border-focus focus:border-border-focus sm:text-sm"
                        />
                    </div>

                    <DataTable
                        columns={columns}
                        data={customers.data}
                        keyField="id"
                        emptyMessage={t("customers.no_results")}
                    />

                    {customers.meta?.total > customers.meta?.per_page && (
                        <div className="mt-6 flex justify-between items-center">
                            <div className="text-sm text-text-muted">
                                {t("common.showing_results", {
                                    from: customers.meta.from,
                                    to: customers.meta.to,
                                    total: customers.meta.total,
                                })}
                            </div>
                            <div className="flex gap-2">
                                {customers.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        className={`px-3 py-1 rounded-md text-sm ${
                                            link.active
                                                ? "bg-interactive-primary text-text-inverted"
                                                : "bg-bg-muted text-text-primary hover:bg-bg-muted/80"
                                        } ${
                                            !link.url &&
                                            "opacity-50 cursor-not-allowed"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
