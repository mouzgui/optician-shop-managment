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
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route("business.customers.index")}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            {customer.full_name}
                        </h2>
                    </div>
                    <div className="flex space-x-2">
                        <Link
                            href={route("business.customers.edit", customer.id)}
                            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            <PencilSquareIcon className="w-4 h-4 mr-2" />
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
                                <div className="ml-4">
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
                                <div className="ml-4">
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
                                <div className="ml-4">
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
                                    <div className="flex items-start">
                                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">
                                                {t("customers.fields.email")}
                                            </p>
                                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                                {customer.email || "-"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <CakeIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">
                                                {t(
                                                    "customers.fields.date_of_birth"
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                                {customer.date_of_birth
                                                    ? new Date(
                                                          customer.date_of_birth
                                                      ).toLocaleDateString()
                                                    : "-"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">
                                                {t("customers.fields.address")}
                                            </p>
                                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                                {customer.address || "-"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <ClipboardDocumentListIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
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
                                    <Tab.List className="flex p-1 space-x-1 bg-gray-100 dark:bg-gray-700">
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
                                                <tab.icon className="w-4 h-4 mr-2" />
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
                                                    <PlusIcon className="w-4 h-4 mr-1" />
                                                    {t("customers.add_rx")}
                                                </Link>
                                            </div>
                                            {customer.spectacle_prescriptions
                                                .length > 0 ? (
                                                <div className="space-y-4">
                                                    {customer.spectacle_prescriptions.map(
                                                        (rx) => (
                                                            <div
                                                                key={rx.id}
                                                                className="border dark:border-gray-700 rounded-lg p-4"
                                                            >
                                                                <div className="flex justify-between items-start mb-4">
                                                                    <div>
                                                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                                                            {new Date(
                                                                                rx.prescribed_at
                                                                            ).toLocaleDateString()}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            {t(
                                                                                "customers.prescribed_by"
                                                                            )}
                                                                            :{" "}
                                                                            {
                                                                                rx
                                                                                    .prescribed_by
                                                                                    .name
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <span
                                                                        className={classNames(
                                                                            "px-2 py-1 text-xs font-semibold rounded-full",
                                                                            new Date(
                                                                                rx.expires_at
                                                                            ) <
                                                                                new Date()
                                                                                ? "bg-red-100 text-red-800"
                                                                                : "bg-green-100 text-green-800"
                                                                        )}
                                                                    >
                                                                        {new Date(
                                                                            rx.expires_at
                                                                        ) <
                                                                        new Date()
                                                                            ? t(
                                                                                  "common.expired"
                                                                              )
                                                                            : t(
                                                                                  "common.active"
                                                                              )}
                                                                    </span>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                                                                        <p className="text-xs font-bold mb-2">
                                                                            OD
                                                                            (Right)
                                                                        </p>
                                                                        <div className="grid grid-cols-2 text-xs gap-y-1">
                                                                            <span>
                                                                                SPH:{" "}
                                                                                {
                                                                                    rx.od_sphere
                                                                                }
                                                                            </span>
                                                                            <span>
                                                                                CYL:{" "}
                                                                                {rx.od_cylinder ||
                                                                                    "0.00"}
                                                                            </span>
                                                                            <span>
                                                                                AXIS:{" "}
                                                                                {rx.od_axis ||
                                                                                    "-"}
                                                                            </span>
                                                                            <span>
                                                                                ADD:{" "}
                                                                                {rx.od_add ||
                                                                                    "0.00"}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                                                                        <p className="text-xs font-bold mb-2">
                                                                            OS
                                                                            (Left)
                                                                        </p>
                                                                        <div className="grid grid-cols-2 text-xs gap-y-1">
                                                                            <span>
                                                                                SPH:{" "}
                                                                                {
                                                                                    rx.os_sphere
                                                                                }
                                                                            </span>
                                                                            <span>
                                                                                CYL:{" "}
                                                                                {rx.os_cylinder ||
                                                                                    "0.00"}
                                                                            </span>
                                                                            <span>
                                                                                AXIS:{" "}
                                                                                {rx.os_axis ||
                                                                                    "-"}
                                                                            </span>
                                                                            <span>
                                                                                ADD:{" "}
                                                                                {rx.os_add ||
                                                                                    "0.00"}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center py-10 text-gray-500">
                                                    {t("customers.no_rx")}
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
                                                    <PlusIcon className="w-4 h-4 mr-1" />
                                                    {t("customers.add_rx")}
                                                </Link>
                                            </div>
                                            {customer.contact_lens_prescriptions
                                                .length > 0 ? (
                                                <div className="space-y-4">
                                                    {customer.contact_lens_prescriptions.map(
                                                        (rx) => (
                                                            <div
                                                                key={rx.id}
                                                                className="border dark:border-gray-700 rounded-lg p-4"
                                                            >
                                                                {/* Render CL Rx details similar to spectacle rx */}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center py-10 text-gray-500">
                                                    {t("customers.no_rx")}
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
                                                <button className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700">
                                                    <PlusIcon className="w-4 h-4 mr-1" />
                                                    {t(
                                                        "customers.create_invoice"
                                                    )}
                                                </button>
                                            </div>
                                            {customer.invoices.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    {/* Render Invoice table */}
                                                </div>
                                            ) : (
                                                <div className="text-center py-10 text-gray-500">
                                                    {t("customers.no_invoices")}
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
