import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { JobCard } from "@/types";
import { Card } from "@/Components/UI/Card";
import {
    Search,
    Package,
    CheckCircle,
    AlertTriangle,
    Hourglass,
    Wrench,
    Clipboard,
    FileText,
} from "lucide-react";
import { JobCardItem } from "@/Components/Lab/JobCardItem";
import { StatCard } from "@/Components/Charts/StatCard";
import { exportToCSV } from "@/Utils/csvExport";
import { Button } from "@/Components/UI/Button";

interface Props {
    jobCards: JobCard[];
    statuses: string[];
    stats?: {
        total: number;
        pending: number;
        inProgress: number;
        completed: number;
        urgent: number;
    };
}

export default function Index({ jobCards = [], statuses = [], stats }: Props) {
    const [filter, setFilter] = useState<string>("all");
    const [search, setSearch] = useState("");

    const safeJobCards = jobCards || [];

    const filteredJobs = safeJobCards.filter((job) => {
        if (!job) return false;
        const matchesStatus = filter === "all" || job.status === filter;
        const searchLower = search.toLowerCase();
        const matchesSearch =
            (job.job_number || "").toLowerCase().includes(searchLower) ||
            (job.invoice?.customer?.first_name || "")
                .toLowerCase()
                .includes(searchLower) ||
            (job.invoice?.customer?.last_name || "")
                .toLowerCase()
                .includes(searchLower);
        return matchesStatus && matchesSearch;
    });

    const calculatedStats = {
        total: stats?.total || safeJobCards.length,
        pending:
            stats?.pending ||
            safeJobCards.filter((j) => j?.status === "pending").length,
        inProgress:
            stats?.inProgress ||
            safeJobCards.filter(
                (j) => j?.status === "in_progress" || j?.status === "in_lab"
            ).length,
        completed:
            stats?.completed ||
            safeJobCards.filter(
                (j) => j?.status === "completed" || j?.status === "ready_pickup"
            ).length,
        urgent:
            stats?.urgent ||
            safeJobCards.filter(
                (j) => (j as any)?.is_urgent || (j as any)?.priority === "high"
            ).length,
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: "Pending",
            in_progress: "In Progress",
            quality_check: "Quality Check",
            in_lab: "In Lab",
            ready_pickup: "Ready for Pickup",
            completed: "Completed",
            cancelled: "Cancelled",
        };
        return (
            labels[status] ||
            status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        );
    };

    const getStatusCount = (status: string) => {
        return safeJobCards.filter((j) => j?.status === status).length;
    };

    const handleExportCSV = () => {
        const headers = ["Job Number", "Customer", "Status", "Created At"];

        const data = safeJobCards.map((job) => [
            job.job_number,
            `${job.invoice?.customer?.first_name || ""} ${
                job.invoice?.customer?.last_name || ""
            }`,
            getStatusLabel(job.status || ""),
            job.created_at
                ? new Date(job.created_at).toLocaleDateString()
                : "-",
        ]);

        exportToCSV(data, "lab-job-cards", headers);
    };

    const getStatusButtonStyle = (status: string, isActive: boolean) => {
        if (isActive) {
            const activeStyles: Record<string, string> = {
                pending: "bg-amber-500 text-white",
                in_progress: "bg-blue-500 text-white",
                quality_check: "bg-purple-500 text-white",
                completed: "bg-green-500 text-white",
                cancelled: "bg-red-500 text-white",
            };
            return activeStyles[status] || "bg-blue-600 text-white";
        }
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600";
    };

    return (
        <AuthenticatedLayout>
            <Head title="Lab Job Cards" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <Clipboard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Lab Job Cards
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                                Manage and track laboratory jobs
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={handleExportCSV}
                        className="flex items-center gap-2"
                    >
                        <FileText className="w-4 h-4" />
                        Export CSV
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <StatCard
                        title="Total Jobs"
                        value={calculatedStats.total}
                        icon={Package}
                        color="primary"
                    />
                    <StatCard
                        title="Pending"
                        value={calculatedStats.pending}
                        icon={Hourglass}
                        color="warning"
                    />
                    <StatCard
                        title="In Progress"
                        value={calculatedStats.inProgress}
                        icon={Wrench}
                        color="info"
                    />
                    <StatCard
                        title="Completed"
                        value={calculatedStats.completed}
                        icon={CheckCircle}
                        color="success"
                    />
                    <StatCard
                        title="Urgent"
                        value={calculatedStats.urgent}
                        icon={AlertTriangle}
                        color="danger"
                    />
                </div>

                {/* Filters & Search */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by job # or customer name..."
                                className="w-full ps-10 pe-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Status Filter Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                    filter === "all"
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                }`}
                            >
                                All Jobs
                                <span
                                    className={`ms-2 px-2 py-0.5 rounded-full text-xs ${
                                        filter === "all"
                                            ? "bg-white/20"
                                            : "bg-gray-200 dark:bg-gray-600"
                                    }`}
                                >
                                    {safeJobCards.length}
                                </span>
                            </button>
                            {(statuses || []).map((status: string) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${getStatusButtonStyle(
                                        status,
                                        filter === status
                                    )}`}
                                >
                                    {getStatusLabel(status)}
                                    <span
                                        className={`ms-2 px-2 py-0.5 rounded-full text-xs ${
                                            filter === status
                                                ? "bg-white/20"
                                                : "bg-gray-200 dark:bg-gray-600"
                                        }`}
                                    >
                                        {getStatusCount(status)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Job Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                            <JobCardItem key={job.id} job={job} />
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-10 border-2 border-dashed border-gray-200 dark:border-gray-700">
                                <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                                    <Package className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    No Job Cards Found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                    {search
                                        ? `No job cards matching "${search}" were found.`
                                        : "No job cards found matching your criteria. Try adjusting your filters."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
