import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import TextInput from "@/Components/TextInput";
import Pagination from "@/Components/Pagination";

interface ContactLens {
    id: number;
    brand: string;
    product_line: string;
    type: string;
    replacement_schedule: string;
    power: number;
    cylinder: number;
    axis: number;
    selling_price_per_box: number;
    boxes_in_stock: number;
    box_quantity: number;
    expiry_date: string;
    is_active: boolean;
}

interface Props {
    contactLenses: {
        data: ContactLens[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
    };
}

export default function Index({ contactLenses, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = React.useState(filters.search || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route("business.inventory.contact-lenses.index"),
            { search },
            { preserveState: true }
        );
    };

    const deleteCL = (id: number) => {
        if (confirm(t("common.confirm_delete"))) {
            router.delete(
                route("business.inventory.contact-lenses.destroy", id)
            );
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {t("inventory.contact_lenses.title")}
                    </h2>
                    <Link
                        href={route("business.inventory.contact-lenses.create")}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        {t("inventory.contact_lenses.add_new")}
                    </Link>
                </div>
            }
        >
            <Head title={t("inventory.contact_lenses.title")} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Filters */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <form
                                    onSubmit={handleSearch}
                                    className="flex-1 max-w-md"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MagnifyingGlassIcon className="h-5 h-5 text-gray-400" />
                                        </div>
                                        <TextInput
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder={t(
                                                "inventory.contact_lenses.search_placeholder"
                                            )}
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t(
                                                    "inventory.contact_lenses.fields.brand_line"
                                                )}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t(
                                                    "inventory.contact_lenses.fields.type"
                                                )}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t("clinical.rx.sphere")} /{" "}
                                                {t("clinical.rx.cylinder")}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t(
                                                    "inventory.contact_lenses.boxes"
                                                )}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t(
                                                    "inventory.contact_lenses.fields.selling_price_per_box"
                                                )}
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t("common.actions")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {contactLenses.data.length > 0 ? (
                                            contactLenses.data.map((cl) => (
                                                <tr
                                                    key={cl.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                                            {cl.brand} -{" "}
                                                            {cl.product_line}
                                                        </div>
                                                        <div className="text-xs">
                                                            {t(
                                                                `clinical.rx.replacement_schedule.${cl.replacement_schedule}`
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {t(
                                                            `clinical.rx.types.${cl.type}`
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {cl.power !== null && (
                                                            <div className="text-xs">
                                                                PWR:{" "}
                                                                {cl.power > 0
                                                                    ? "+"
                                                                    : ""}
                                                                {cl.power.toFixed(
                                                                    2
                                                                )}
                                                                {cl.cylinder !==
                                                                    null &&
                                                                    ` CYL: ${cl.cylinder.toFixed(
                                                                        2
                                                                    )} AX: ${
                                                                        cl.axis
                                                                    }`}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                cl.boxes_in_stock <=
                                                                2
                                                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                                            }`}
                                                        >
                                                            {t(
                                                                "inventory.contact_lenses.stock"
                                                            )}
                                                            :{" "}
                                                            {cl.boxes_in_stock}{" "}
                                                            {t(
                                                                "inventory.contact_lenses.boxes"
                                                            )}
                                                        </span>
                                                        {cl.expiry_date && (
                                                            <div
                                                                className={`text-[10px] mt-1 ${
                                                                    new Date(
                                                                        cl.expiry_date
                                                                    ) <
                                                                    new Date()
                                                                        ? "text-red-500"
                                                                        : "text-gray-400"
                                                                }`}
                                                            >
                                                                {t(
                                                                    "inventory.contact_lenses.fields.expiry"
                                                                )}
                                                                :{" "}
                                                                {cl.expiry_date}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {new Intl.NumberFormat(
                                                            undefined,
                                                            {
                                                                style: "currency",
                                                                currency: "AED",
                                                            }
                                                        ).format(
                                                            cl.selling_price_per_box
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                        <Link
                                                            href={route(
                                                                "business.inventory.contact-lenses.edit",
                                                                cl.id
                                                            )}
                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            <PencilSquareIcon className="w-5 h-5 inline" />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                deleteCL(cl.id)
                                                            }
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                        >
                                                            <TrashIcon className="w-5 h-5 inline" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                                                >
                                                    {t(
                                                        "inventory.contact_lenses.no_results"
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6">
                                <Pagination meta={contactLenses.meta} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
