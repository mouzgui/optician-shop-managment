import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { JobCard, JobCardStatus } from "@/types";
import { Badge } from "@/Components/UI/Badge";
import { Button } from "@/Components/UI/Button";
import { Search, Clock, ChevronRight, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { JobCardItem } from "@/Components/Lab/JobCardItem";

interface Props {
    jobCards: JobCard[];
    statuses: string[];
}

export default function Index({ jobCards, statuses }: Props) {
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

    return (
        <AuthenticatedLayout>
            <Head title="Lab Job Cards" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-main">
                            Lab Job Cards
                        </h1>
                        <p className="text-text-muted">
                            Manage and track laboratory jobs
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search by job # or customer name..."
                            className="w-full ps-10 pe-4 py-2 bg-white border border-border-main rounded-lg focus:ring-2 focus:ring-brand-main focus:border-brand-main outline-none transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                        <Button
                            variant={filter === "all" ? "primary" : "secondary"}
                            size="sm"
                            onClick={() => setFilter("all")}
                            className="whitespace-nowrap"
                        >
                            All Jobs
                        </Button>
                        {statuses.map((status) => (
                            <Button
                                key={status}
                                variant={
                                    filter === status ? "primary" : "secondary"
                                }
                                size="sm"
                                onClick={() => setFilter(status)}
                                className="whitespace-nowrap capitalize"
                            >
                                {status.replace("_", " ")}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                            <JobCardItem key={job.id} job={job} />
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center bg-white border border-dashed border-border-main rounded-xl">
                            <p className="text-text-muted">
                                No job cards found matching your criteria.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
