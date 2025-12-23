import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { 
    PlusIcon, 
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import TextInput from "@/Components/TextInput";
import Pagination from "@/Components/Pagination";

interface Frame {
    id: number;
    sku: string;
    barcode: string;
    brand: string;
    model: string;
    color_name: string;
    category: string;
    quantity: number;
    low_stock_threshold: number;
    selling_price: number;
    is_active: boolean;
}

interface Props {
    frames: {
        data: Frame[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
        category?: string;
        low_stock?: boolean;
    };
}

export default function Index({ frames, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = React.useState(filters.search || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route("business.inventory.frames.index"), { 
            search, 
            category: filters.category,
            low_stock: filters.low_stock 
        }, { preserveState: true });
    };

    const toggleLowStock = () => {
        router.get(route("business.inventory.frames.index"), { 
            search, 
            category: filters.category,
            low_stock: !filters.low_stock 
        }, { preserveState: true });
    };

    const deleteFrame = (id: number) => {
        if (confirm(t("common.confirm_delete"))) {
            router.delete(route("business.inventory.frames.destroy", id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {t("inventory.frames.title")}
                    </h2>
                    <Link
                        href={route("business.inventory.frames.create")}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        {t("inventory.frames.add_new")}
                    </Link>
                </div>
            }
        >
            <Head title={t("inventory.frames.title")} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Filters */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <form onSubmit={handleSearch} className="flex-1 max-w-md">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MagnifyingGlassIcon className="h-5 h-5 text-gray-400" />
                                        </div>
                                        <TextInput
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder={t("inventory.frames.search_placeholder")}
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                </form>

                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={toggleLowStock}
                                        className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                                            filters.low_stock
                                                ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
                                                : "bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        }`}
                                    >
                                        <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                                        {t("inventory.frames.filters.low_stock")}
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t("inventory.frames.fields.sku")}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t("inventory.frames.fields.brand_model")}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t("inventory.frames.fields.category")}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t("inventory.frames.fields.quantity")}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t("inventory.frames.fields.selling_price")}
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t("common.actions")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {frames.data.length > 0 ? (
                                            frames.data.map((frame) => (
                                                <tr key={frame.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {frame.sku}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                                            {frame.brand} - {frame.model}
                                                        </div>
                                                        <div className="text-xs">{frame.color_name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {t(`inventory.frames.categories.${frame.category}`)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            frame.quantity <= frame.low_stock_threshold
                                                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                        }`}>
                                                            {frame.quantity}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {new Intl.NumberFormat(undefined, {
                                                            style: "currency",
                                                            currency: "AED", // TODO: Get from business settings
                                                        }).format(frame.selling_price)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                        <Link
                                                            href={route("business.inventory.frames.edit", frame.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            <PencilSquareIcon className="w-5 h-5 inline" />
                                                        </Link>
                                                        <button
                                                            onClick={() => deleteFrame(frame.id)}
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                        >
                                                            <TrashIcon className="w-5 h-5 inline" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                                    {t("inventory.frames.no_results")}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6">
                                <Pagination meta={frames.meta} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
