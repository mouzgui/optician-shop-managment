import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { JobCard } from "@/types";
import { Badge } from "@/Components/UI/Badge";
import { Button } from "@/Components/UI/Button";
import {
    ChevronLeft,
    Clock,
    User,
    FileText,
    Printer,
    Play,
    CheckCircle2,
    Eye,
    Glasses,
    Circle,
    AlertTriangle,
    Calendar,
    Hash,
} from "lucide-react";
import { format } from "date-fns";

interface Props {
    jobCard: JobCard;
}

export default function Show({ jobCard }: Props) {
    const { patch, processing } = useForm({
        status: "",
    });

    // Guard against null/undefined jobCard
    if (!jobCard) {
        return (
            <AuthenticatedLayout>
                <Head title="Job Card Not Found" />
                <div className="flex items-center justify-center min-h-96">
                    <div className="text-center">
                        <AlertTriangle className="w-16 h-16 mx-auto text-amber-500 mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Job Card Not Found
                        </h2>
                        <Link
                            href="/business/lab/job-cards"
                            className="text-blue-600 dark:text-blue-400 mt-2 inline-block"
                        >
                            ← Back to Job Cards
                        </Link>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const updateStatus = (newStatus: string) => {
        patch(
            `/business/lab/job-cards/${jobCard.id}/status?status=${newStatus}`
        );
    };

    const getStatusConfig = (status: string | undefined) => {
        switch (status) {
            case "pending":
                return {
                    variant: "warning" as const,
                    label: "Pending",
                    bgColor: "bg-amber-500",
                    textColor: "text-amber-600 dark:text-amber-400",
                };
            case "in_progress":
                return {
                    variant: "info" as const,
                    label: "In Progress",
                    bgColor: "bg-blue-500",
                    textColor: "text-blue-600 dark:text-blue-400",
                };
            case "quality_check":
                return {
                    variant: "primary" as const,
                    label: "Quality Check",
                    bgColor: "bg-purple-500",
                    textColor: "text-purple-600 dark:text-purple-400",
                };
            case "completed":
                return {
                    variant: "success" as const,
                    label: "Completed",
                    bgColor: "bg-green-500",
                    textColor: "text-green-600 dark:text-green-400",
                };
            case "cancelled":
                return {
                    variant: "danger" as const,
                    label: "Cancelled",
                    bgColor: "bg-red-500",
                    textColor: "text-red-600 dark:text-red-400",
                };
            default:
                return {
                    variant: "secondary" as const,
                    label: status?.replace(/_/g, " ") || "Unknown",
                    bgColor: "bg-gray-500",
                    textColor: "text-gray-600 dark:text-gray-400",
                };
        }
    };

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return "N/A";
        try {
            return format(new Date(dateStr), "PPP");
        } catch {
            return dateStr;
        }
    };

    const formatTime = (dateStr: string | undefined) => {
        if (!dateStr) return "N/A";
        try {
            return format(new Date(dateStr), "HH:mm dd/MM");
        } catch {
            return dateStr;
        }
    };

    const rx = jobCard.prescription_details;
    const frame = jobCard.frame_details;
    const lens = jobCard.lens_details;
    const statusConfig = getStatusConfig(jobCard.status);

    return (
        <AuthenticatedLayout>
            <Head title={`Job Card ${jobCard.job_number || ""}`} />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Navigation */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/business/lab/job-cards"
                        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to Queue
                    </Link>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                            window.open(
                                route(
                                    "business.lab.job-cards.download-pdf",
                                    jobCard.id
                                ),
                                "_blank"
                            )
                        }
                    >
                        <Printer className="w-4 h-4 me-2" />
                        Print Job Card
                    </Button>
                </div>

                {/* Main Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Status Bar */}
                    <div className={`h-2 ${statusConfig.bgColor}`} />

                    {/* Header Section */}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <Hash className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {jobCard.job_number || "N/A"}
                                        </h1>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge
                                                variant={statusConfig.variant}
                                            >
                                                {statusConfig.label}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-3">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        Created {formatDate(jobCard.created_at)}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2">
                                {jobCard.status === "pending" && (
                                    <Button
                                        variant="primary"
                                        onClick={() =>
                                            updateStatus("in_progress")
                                        }
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Play className="w-4 h-4 me-2" />
                                        Start Job
                                    </Button>
                                )}
                                {jobCard.status === "in_progress" && (
                                    <Button
                                        variant="primary"
                                        onClick={() =>
                                            updateStatus("quality_check")
                                        }
                                        disabled={processing}
                                        className="bg-purple-600 hover:bg-purple-700"
                                    >
                                        <Eye className="w-4 h-4 me-2" />
                                        Send to QC
                                    </Button>
                                )}
                                {jobCard.status === "quality_check" && (
                                    <Button
                                        variant="primary"
                                        onClick={() =>
                                            updateStatus("completed")
                                        }
                                        disabled={processing}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle2 className="w-4 h-4 me-2" />
                                        Complete Job
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Prescription Details - Full Width */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Prescription Details
                                </h3>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                                                Eye
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                                                SPH
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                                                CYL
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                                                AXIS
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                                                ADD
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                                                PRISM
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-white dark:bg-gray-800">
                                            <td className="px-4 py-3 font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700">
                                                <span className="flex items-center gap-2">
                                                    <Circle className="w-3 h-3 text-blue-500 fill-blue-500" />
                                                    R (OD)
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 font-mono">
                                                {rx?.right_sphere || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 font-mono">
                                                {rx?.right_cylinder || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 font-mono">
                                                {rx?.right_axis || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 font-mono">
                                                {rx?.right_add || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 font-mono">
                                                {rx?.right_prism || "—"}
                                            </td>
                                        </tr>
                                        <tr className="bg-gray-50 dark:bg-gray-800/50">
                                            <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">
                                                <span className="flex items-center gap-2">
                                                    <Circle className="w-3 h-3 text-green-500 fill-green-500" />
                                                    L (OS)
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-mono">
                                                {rx?.left_sphere || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-mono">
                                                {rx?.left_cylinder || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-mono">
                                                {rx?.left_axis || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-mono">
                                                {rx?.left_add || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-mono">
                                                {rx?.left_prism || "—"}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Frame Details */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                                    <Glasses className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Frame Information
                                </h3>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 space-y-3">
                                {frame ? (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                                                Brand / Model
                                            </span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {frame.brand || "N/A"} -{" "}
                                                {frame.model || "N/A"}
                                            </span>
                                        </div>
                                        <div className="border-t border-gray-200 dark:border-gray-600" />
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                                                Color
                                            </span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {frame.color_name || "N/A"} (
                                                {frame.color_code || "N/A"})
                                            </span>
                                        </div>
                                        <div className="border-t border-gray-200 dark:border-gray-600" />
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                                                Size
                                            </span>
                                            <span className="font-semibold text-gray-900 dark:text-white font-mono">
                                                {frame.size_eye || "?"}-
                                                {frame.size_bridge || "?"}-
                                                {frame.size_temple || "?"}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-4">
                                        <Glasses className="w-8 h-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                                        <p className="text-gray-500 dark:text-gray-400 italic">
                                            Customer's Own Frame
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lens Details */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                                    <Circle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Lens Information
                                </h3>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 space-y-3">
                                {lens ? (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                                                Type
                                            </span>
                                            <span className="font-semibold text-gray-900 dark:text-white capitalize">
                                                {lens.type || "N/A"}
                                            </span>
                                        </div>
                                        <div className="border-t border-gray-200 dark:border-gray-600" />
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                                                Index
                                            </span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {lens.index || "N/A"}
                                            </span>
                                        </div>
                                        <div className="border-t border-gray-200 dark:border-gray-600" />
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                                                Coatings
                                            </span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {Array.isArray(lens.coatings)
                                                    ? lens.coatings.join(", ")
                                                    : lens.coatings || "None"}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-4">
                                        <Circle className="w-8 h-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                                        <p className="text-gray-500 dark:text-gray-400 italic">
                                            No lens details available
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Special Instructions - Full Width */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Special Instructions
                                </h3>
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                                <p className="text-amber-800 dark:text-amber-200">
                                    {jobCard.special_instructions ||
                                        "No special instructions provided."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <User className="w-4 h-4 text-gray-400" />
                                <span>Customer:</span>
                                <strong className="text-gray-900 dark:text-white">
                                    {jobCard.invoice?.customer?.first_name ||
                                        ""}{" "}
                                    {jobCard.invoice?.customer?.last_name ||
                                        "Unknown"}
                                </strong>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span>Invoice:</span>
                                <strong className="text-gray-900 dark:text-white">
                                    {jobCard.invoice?.invoice_number || "N/A"}
                                </strong>
                            </div>
                            {jobCard.started_at && (
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <Play className="w-4 h-4 text-gray-400" />
                                    <span>Started:</span>
                                    <strong className="text-gray-900 dark:text-white">
                                        {formatTime(jobCard.started_at)}
                                    </strong>
                                </div>
                            )}
                            {jobCard.completed_at && (
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span>Completed:</span>
                                    <strong className="text-gray-900 dark:text-white">
                                        {formatTime(jobCard.completed_at)}
                                    </strong>
                                </div>
                            )}
                            {jobCard.completed_at && (
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span>Completed:</span>
                                    <strong className="text-gray-900 dark:text-white">
                                        {formatTime(jobCard.completed_at)}
                                    </strong>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
