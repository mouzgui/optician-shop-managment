import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import {
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    CakeIcon,
    CalendarIcon,
    PlusIcon,
    ClipboardDocumentListIcon,
    IdentificationIcon,
    ArrowLeftIcon,
    PencilSquareIcon,
    DocumentTextIcon,
    BeakerIcon,
} from "@heroicons/react/24/outline";
import { Tab } from "@headlessui/react";
import RxDisplay from "@/Components/Clinical/RxDisplay";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

interface Prescription {
    id: number;
    prescribed_at: string;
    expires_at: string;
    notes: string | null;
    prescribed_by: {
        name: string;
    };
}

interface SpectacleRx extends Prescription {
    od_sphere: string;
    od_cylinder: string | null;
    od_axis: number | null;
    od_add: string | null;
    os_sphere: string;
    os_cylinder: string | null;
    os_axis: number | null;
    os_add: string | null;
    pd_far: string | null;
    pd_near: string | null;
    pd_type: "single" | "dual";
}

interface ContactLensRx extends Prescription {
    od_sphere: string;
    od_cylinder: string | null;
    od_axis: number | null;
    od_base_curve: string | null;
    od_diameter: string | null;
    os_sphere: string;
    os_cylinder: string | null;
    os_axis: number | null;
    os_base_curve: string | null;
    os_diameter: string | null;
    replacement_schedule: string | null;
}

interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    phone: string;
    email: string | null;
    address: string | null;
    date_of_birth: string | null;
    notes: string | null;
    rx_expiry_flagged: boolean;
    last_visit_at: string | null;
    branch: { name: string } | null;
    family_head: { id: number; full_name: string } | null;
    family_members: { id: number; full_name: string; phone: string }[];
    spectacle_prescriptions: SpectacleRx[];
    contact_lens_prescriptions: ContactLensRx[];
    invoices: any[];
}

interface Props {
    customer: Customer;
}

export default function Show({ customer }: Props) {
    const { t } = useTranslation();

    const tabs = [
        { name: t("customers.tabs.overview"), icon: ClipboardDocumentListIcon },
        { name: t("customers.tabs.spectacle_rx"), icon: DocumentTextIcon },
        { name: t("customers.tabs.contact_lens_rx"), icon: BeakerIcon },
        { name: t("customers.tabs.invoices"), icon: IdentificationIcon },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("business.customers.index")}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <ArrowLeftIcon className="w-6 h-6 icon-flip" />
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            {customer.full_name}
                        </h2>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route("business.customers.edit", customer.id)}
                            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            <PencilSquareIcon className="w-4 h-4 me-2" />
                            {t("common.edit")}
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={customer.full_name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Top Stats/Quick Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
                                    <PhoneIcon className="h-6 w-6" />
                                </div>
                                <div className="ms-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {t("customers.fields.phone")}
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {customer.phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                                    <CalendarIcon className="h-6 w-6" />
                                </div>
                                <div className="ms-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {t("customers.fields.last_visit")}
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {customer.last_visit_at
                                            ? new Date(
                                                  customer.last_visit_at
                                              ).toLocaleDateString()
                                            : t("common.never")}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div
                                    className={`p-3 rounded-full ${
                                        customer.rx_expiry_flagged
                                            ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                                            : "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                                    }`}
                                >
                                    <DocumentTextIcon className="h-6 w-6" />
                                </div>
                                <div className="ms-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {t("customers.fields.rx_status")}
                                    </p>
                                    <p
                                        className={`text-lg font-semibold ${
                                            customer.rx_expiry_flagged
                                                ? "text-red-600 dark:text-red-400"
                                                : "text-gray-900 dark:text-gray-100"
                                        }`}
                                    >
                                        {customer.rx_expiry_flagged
                                            ? t("customers.rx_expired")
                                            : t("customers.rx_valid")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar: Profile Info */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    {t("customers.profile_details")}
                                </h3>
                                <div className="space-y-4">
                                    {customer.email && (
                                        <div className="flex items-start text-sm">
                                            <EnvelopeIcon className="h-5 w-5 text-gray-400 me-2 mt-0.5" />
                                            <span>{customer.email}</span>
                                        </div>
                                    )}
                                    <div className="flex items-start text-sm">
                                        <CakeIcon className="h-5 w-5 text-gray-400 me-2 mt-0.5" />
                                        <span>
                                            {customer.date_of_birth
                                                ? new Date(
                                                      customer.date_of_birth
                                                  ).toLocaleDateString()
                                                : t("customers.show.no_dob")}
                                        </span>
                                    </div>

                                    <div className="flex items-start text-sm">
                                        <MapPinIcon className="h-5 w-5 text-gray-400 me-2 mt-0.5" />
                                        <span>
                                            {customer.address ||
                                                t("customers.show.no_address")}
                                        </span>
                                    </div>
                                    <div className="flex items-start text-sm">
                                        <ClipboardDocumentListIcon className="h-5 w-5 text-gray-400 me-2 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">
                                                {t("customers.fields.notes")}
                                            </p>
                                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                                {customer.notes || "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Family Info */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    {t("customers.family")}
                                </h3>
                                {customer.family_head && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 uppercase">
                                            {t("customers.fields.family_head")}
                                        </p>
                                        <Link
                                            href={route(
                                                "business.customers.show",
                                                customer.family_head.id
                                            )}
                                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                                        >
                                            {customer.family_head.full_name}
                                        </Link>
                                    </div>
                                )}
                                {customer.family_members.length > 0 && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-2">
                                            {t("customers.family_members")}
                                        </p>
                                        <ul className="space-y-2">
                                            {customer.family_members.map(
                                                (member) => (
                                                    <li key={member.id}>
                                                        <Link
                                                            href={route(
                                                                "business.customers.show",
                                                                member.id
                                                            )}
                                                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                                                        >
                                                            {member.full_name}
                                                        </Link>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}
                                {!customer.family_head &&
                                    customer.family_members.length === 0 && (
                                        <p className="text-sm text-gray-500">
                                            {t("customers.no_family")}
                                        </p>
                                    )}
                            </div>
                        </div>

                        {/* Main Content: Tabs */}
                        <div className="lg:col-span-3">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <Tab.Group>
                                    <Tab.List className="flex p-1 gap-1 bg-gray-100 dark:bg-gray-700">
                                        {tabs.map((tab) => (
                                            <Tab
                                                key={tab.name}
                                                className={({ selected }) =>
                                                    classNames(
                                                        "w-full py-2.5 text-sm font-medium leading-5 rounded-lg flex items-center justify-center transition-all duration-200",
                                                        "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-indigo-400 ring-white",
                                                        selected
                                                            ? "bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-400 shadow"
                                                            : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-indigo-600"
                                                    )
                                                }
                                            >
                                                <tab.icon className="w-4 h-4 me-2" />
                                                {tab.name}
                                            </Tab>
                                        ))}
                                    </Tab.List>
                                    <Tab.Panels className="mt-2">
                                        {/* Overview Panel */}
                                        <Tab.Panel className="p-6">
                                            <div className="space-y-6">
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {t(
                                                        "customers.recent_activity"
                                                    )}
                                                </h4>
                                                {/* Add recent activity timeline here */}
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                    Activity history coming
                                                    soon...
                                                </p>
                                            </div>
                                        </Tab.Panel>

                                        {/* Spectacle Rx Panel */}
                                        <Tab.Panel className="p-6">
                                            <div className="flex justify-between items-center mb-6">
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {t(
                                                        "customers.tabs.spectacle_rx"
                                                    )}
                                                </h4>
                                                <Link
                                                    href={route(
                                                        "business.spectacle-rx.create",
                                                        {
                                                            customer_id:
                                                                customer.id,
                                                        }
                                                    )}
                                                    className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700"
                                                >
                                                    <PlusIcon className="w-4 h-4 me-1" />
                                                    {t("customers.add_rx")}
                                                </Link>
                                            </div>

                                            {customer.spectacle_prescriptions
                                                .length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {customer.spectacle_prescriptions.map(
                                                        (rx) => (
                                                            <RxDisplay
                                                                key={rx.id}
                                                                rx={rx}
                                                                type="spectacle"
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                                                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {t("customers.no_rx")}
                                                    </h3>
                                                </div>
                                            )}
                                        </Tab.Panel>

                                        {/* Contact Lens Rx Panel */}
                                        <Tab.Panel className="p-6">
                                            <div className="flex justify-between items-center mb-6">
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {t(
                                                        "customers.tabs.contact_lens_rx"
                                                    )}
                                                </h4>
                                                <Link
                                                    href={route(
                                                        "business.contact-lens-rx.create",
                                                        {
                                                            customer_id:
                                                                customer.id,
                                                        }
                                                    )}
                                                    className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700"
                                                >
                                                    <PlusIcon className="w-4 h-4 me-1" />
                                                    {t("customers.add_rx")}
                                                </Link>
                                            </div>

                                            {customer.contact_lens_prescriptions
                                                .length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {customer.contact_lens_prescriptions.map(
                                                        (rx) => (
                                                            <RxDisplay
                                                                key={rx.id}
                                                                rx={rx}
                                                                type="contact_lens"
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                                                    <BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {t("customers.no_rx")}
                                                    </h3>
                                                </div>
                                            )}
                                        </Tab.Panel>

                                        {/* Invoices Panel */}
                                        <Tab.Panel className="p-6">
                                            <div className="flex justify-between items-center mb-6">
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {t(
                                                        "customers.tabs.invoices"
                                                    )}
                                                </h4>
                                                <Link
                                                    href={route(
                                                        "business.pos.index",
                                                        {
                                                            customer_id:
                                                                customer.id,
                                                        }
                                                    )}
                                                    className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700"
                                                >
                                                    <PlusIcon className="w-4 h-4 me-1" />
                                                    {t(
                                                        "customers.create_invoice"
                                                    )}
                                                </Link>
                                            </div>

                                            {customer.invoices.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                        <thead className="bg-gray-50 dark:bg-gray-900">
                                                            <tr>
                                                                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {t(
                                                                        "common.date"
                                                                    )}
                                                                </th>
                                                                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {t(
                                                                        "invoices.fields.number"
                                                                    )}
                                                                </th>
                                                                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {t(
                                                                        "invoices.fields.status"
                                                                    )}
                                                                </th>
                                                                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {t(
                                                                        "invoices.fields.total"
                                                                    )}
                                                                </th>
                                                                <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {t(
                                                                        "common.actions"
                                                                    )}
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                            {customer.invoices.map(
                                                                (invoice) => (
                                                                    <tr
                                                                        key={
                                                                            invoice.id
                                                                        }
                                                                    >
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                            {new Date(
                                                                                invoice.created_at
                                                                            ).toLocaleDateString()}
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                            {
                                                                                invoice.invoice_number
                                                                            }
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <span
                                                                                className={classNames(
                                                                                    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                                                                    invoice.status ===
                                                                                        "paid"
                                                                                        ? "bg-green-100 text-green-800"
                                                                                        : "bg-yellow-100 text-yellow-800"
                                                                                )}
                                                                            >
                                                                                {
                                                                                    invoice.status
                                                                                }
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                            {
                                                                                invoice.total_amount
                                                                            }
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                                            <Link
                                                                                href={route(
                                                                                    "business.invoices.show",
                                                                                    invoice.id
                                                                                )}
                                                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                                                                            >
                                                                                View
                                                                            </Link>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                                                    <IdentificationIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {t(
                                                            "customers.no_invoices"
                                                        )}
                                                    </h3>
                                                </div>
                                            )}
                                        </Tab.Panel>
                                    </Tab.Panels>
                                </Tab.Group>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
