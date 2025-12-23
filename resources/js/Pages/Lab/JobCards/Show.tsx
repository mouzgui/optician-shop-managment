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
    AlertCircle,
    Eye,
} from "lucide-react";
import { format } from "date-fns";

interface Props {
    jobCard: JobCard;
}

export default function Show({ jobCard }: Props) {
    const { patch, processing } = useForm({
        status: "",
    });

    const updateStatus = (newStatus: string) => {
        patch(
            route("business.lab.job-cards.update-status", {
                job_card: jobCard.id,
                status: newStatus,
            })
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "warning";
            case "in_progress":
                return "info";
            case "quality_check":
                return "primary";
            case "completed":
                return "success";
            case "cancelled":
                return "danger";
            default:
                return "secondary";
        }
    };

    const rx = jobCard.prescription_details;
    const frame = jobCard.frame_details;
    const lens = jobCard.lens_details;

    return (
        <AuthenticatedLayout>
            <Head title={`Job Card ${jobCard.job_number}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <Link
                        href={route("business.lab.job-cards.index")}
                        className="flex items-center text-text-muted hover:text-brand-main transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Queue
                    </Link>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                                window.open(
                                    route(
                                        "business.lab.job-cards.print",
                                        jobCard.id
                                    ),
                                    "_blank"
                                )
                            }
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            Print Job Card
                        </Button>
                    </div>
                </div>

                <div className="bg-white border border-border-main rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-border-main flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-text-main">
                                    {jobCard.job_number}
                                </h1>
                                <Badge variant={getStatusColor(jobCard.status)}>
                                    {jobCard.status.replace("_", " ")}
                                </Badge>
                            </div>
                            <p className="text-text-muted flex items-center">
                                <Clock className="w-4 h-4 mr-1.5" />
                                Created on{" "}
                                {format(new Date(jobCard.created_at), "PPP")}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {jobCard.status === "pending" && (
                                <Button
                                    variant="primary"
                                    onClick={() => updateStatus("in_progress")}
                                    disabled={processing}
                                >
                                    <Play className="w-4 h-4 mr-2" />
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
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Send to QC
                                </Button>
                            )}
                            {jobCard.status === "quality_check" && (
                                <Button
                                    variant="success"
                                    onClick={() => updateStatus("completed")}
                                    disabled={processing}
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Complete Job
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Prescription Details */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-bold text-text-main mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-brand-main" />
                                Prescription Details
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-bg-subtle text-left">
                                            <th className="p-3 border border-border-main font-bold">
                                                EYE
                                            </th>
                                            <th className="p-3 border border-border-main font-bold">
                                                SPH
                                            </th>
                                            <th className="p-3 border border-border-main font-bold">
                                                CYL
                                            </th>
                                            <th className="p-3 border border-border-main font-bold">
                                                AXIS
                                            </th>
                                            <th className="p-3 border border-border-main font-bold">
                                                ADD
                                            </th>
                                            <th className="p-3 border border-border-main font-bold">
                                                PRISM
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="p-3 border border-border-main font-bold">
                                                R (OD)
                                            </td>
                                            <td className="p-3 border border-border-main">
                                                {rx?.right_sphere || "-"}
                                            </td>
                                            <td className="p-3 border border-border-main">
                                                {rx?.right_cylinder || "-"}
                                            </td>
                                            <td className="p-3 border border-border-main">
                                                {rx?.right_axis || "-"}
                                            </td>
                                            <td className="p-3 border border-border-main">
                                                {rx?.right_add || "-"}
                                            </td>
                                            <td className="p-3 border border-border-main">
                                                {rx?.right_prism || "-"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 border border-border-main font-bold">
                                                L (OS)
                                            </td>
                                            <td className="p-3 border border-border-main">
                                                {rx?.left_sphere || "-"}
                                            </td>
                                            <td className="p-3 border border-border-main">
                                                {rx?.left_cylinder || "-"}
                                            </td>
                                            <td className="p-3 border border-border-main">
                                                {rx?.left_axis || "-"}
                                            </td>
                                            <td className="p-3 border border-border-main">
                                                {rx?.left_add || "-"}
                                            </td>
                                            <td className="p-3 border border-border-main">
                                                {rx?.left_prism || "-"}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Frame Details */}
                        <div>
                            <h3 className="text-lg font-bold text-text-main mb-4">
                                Frame Information
                            </h3>
                            <div className="bg-bg-subtle p-4 rounded-lg space-y-3">
                                {frame ? (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">
                                                Brand / Model
                                            </span>
                                            <span className="font-medium">
                                                {frame.brand} - {frame.model}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">
                                                Color
                                            </span>
                                            <span className="font-medium">
                                                {frame.color_name} (
                                                {frame.color_code})
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">
                                                Size
                                            </span>
                                            <span className="font-medium">
                                                {frame.size_eye}-
                                                {frame.size_bridge}-
                                                {frame.size_temple}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-text-muted italic">
                                        Customer's Own Frame
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Lens Details */}
                        <div>
                            <h3 className="text-lg font-bold text-text-main mb-4">
                                Lens Information
                            </h3>
                            <div className="bg-bg-subtle p-4 rounded-lg space-y-3">
                                {lens ? (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">
                                                Type
                                            </span>
                                            <span className="font-medium capitalize">
                                                {lens.type}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">
                                                Index
                                            </span>
                                            <span className="font-medium">
                                                {lens.index}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">
                                                Coatings
                                            </span>
                                            <span className="font-medium">
                                                {Array.isArray(lens.coatings)
                                                    ? lens.coatings.join(", ")
                                                    : lens.coatings || "None"}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-text-muted italic">
                                        No lens details available
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Special Instructions */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-bold text-text-main mb-2">
                                Special Instructions
                            </h3>
                            <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg text-orange-800">
                                {jobCard.special_instructions ||
                                    "No special instructions provided."}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-bg-subtle border-t border-border-main flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2 text-text-muted">
                            <User className="w-4 h-4" />
                            <span>
                                Customer:{" "}
                                <strong>
                                    {jobCard.invoice?.customer?.first_name}{" "}
                                    {jobCard.invoice?.customer?.last_name}
                                </strong>
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-text-muted">
                            <AlertCircle className="w-4 h-4" />
                            <span>
                                Invoice:{" "}
                                <strong>
                                    {jobCard.invoice?.invoice_number}
                                </strong>
                            </span>
                        </div>
                        {jobCard.started_at && (
                            <div className="flex items-center gap-2 text-text-muted">
                                <Play className="w-4 h-4" />
                                <span>
                                    Started:{" "}
                                    <strong>
                                        {format(
                                            new Date(jobCard.started_at),
                                            "HH:mm dd/MM"
                                        )}
                                    </strong>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
