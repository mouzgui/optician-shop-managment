import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { JobCard, JobCardStatus } from "@/types";
import { Badge } from "@/Components/UI/Badge";
import { Button } from "@/Components/UI/Button";
import { Card } from "@/Components/UI/Card";
import { Search, Clock, ChevronRight, Filter, Package, CheckCircle, AlertTriangle, Hourglass, Wrench } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { JobCardItem } from "@/Components/Lab/JobCardItem";

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

export default function Index({ jobCards, statuses, stats }: Props) {
    const [filter, setFilter] = useState<string>("all");
    const [search, setSearch] = useState("");

    const filteredJobs = jobCards.filter((job) => {
        const matchesStatus = filter === "all" || job.status === filter;
        const matchesSearch =
            job.job_number.toLowerCase().includes(search.toLowerCase()) ||
            job.invoice?.customer?.first_name
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            job.invoice?.customer?.last_name
                ?.toLowerCase()
                .includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Calculate stats from data if not provided
    const calculatedStats = {
        total: stats?.total || jobCards.length,
        pending: stats?.pending || jobCards.filter(j => j.status === 'pending').length,
        inProgress: stats?.inProgress || jobCards.filter(j => j.status === 'in_progress' || j.status === 'in_lab').length,
        completed: stats?.completed || jobCards.filter(j => j.status === 'completed' || j.status === 'ready_pickup').length,
        urgent: stats?.urgent || jobCards.filter(j => (j as any).is_urgent || (j as any).priority === 'high').length,
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: "Pending",
            in_progress: "In Progress",
            in_lab: "In Lab",
            ready_pickup: "Ready for Pickup",
            completed: "Completed",
            cancelled: "Cancelled",
        };
        return labels[status] || status.replace("_", " ");
    };

    const getStatusCount = (status: string) => {
        return jobCards.filter(j => j.status === status).length;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Lab Job Cards" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">
                            Lab Job Cards
                        </h1>
                        <p className="text-text-muted text-sm mt-1">
                            Manage and track laboratory jobs
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card className="p-4 border-l-4 border-l-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Total Jobs</p>
                                <p className="text-2xl font-bold text-text-primary mt-1">
                                    {calculatedStats.total}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-amber-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Pending</p>
                                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                                    {calculatedStats.pending}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <Hourglass className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">In Progress</p>
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                                    {calculatedStats.inProgress}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Wrench className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Completed</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                                    {calculatedStats.completed}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Urgent</p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                                    {calculatedStats.urgent}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters & Search */}
                <Card className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search by job # or customer name..."
                                className="w-full ps-10 pe-4 py-2 bg-bg-base border border-border-default rounded-lg focus:ring-2 focus:ring-interactive-primary focus:border-transparent outline-none transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Status Filter Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filter === "all"
                                        ? "bg-primary-default text-white"
                                        : "bg-bg-subtle text-text-muted hover:bg-bg-subtle/80 hover:text-text-primary"
                                    }`}
                            >
                                All Jobs
                                <span className={`ms-2 px-2 py-0.5 rounded-full text-xs ${filter === "all" ? "bg-white/20" : "bg-bg-base"
                                    }`}>
                                    {jobCards.length}
                                </span>
                            </button>
                            {statuses.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap capitalize ${filter === status
                                            ? "bg-primary-default text-white"
                                            : "bg-bg-subtle text-text-muted hover:bg-bg-subtle/80 hover:text-text-primary"
                                        }`}
                                >
                                    {getStatusLabel(status)}
                                    <span className={`ms-2 px-2 py-0.5 rounded-full text-xs ${filter === status ? "bg-white/20" : "bg-bg-base"
                                        }`}>
                                        {getStatusCount(status)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Job Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                            <JobCardItem key={job.id} job={job} />
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center">
                            <Card className="p-8 border-dashed">
                                <Package className="w-12 h-12 mx-auto text-text-muted opacity-50" />
                                <p className="text-text-muted mt-3">
                                    No job cards found matching your criteria.
                                </p>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
