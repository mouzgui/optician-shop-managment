import React from 'react';
import { Link } from '@inertiajs/react';
import { JobCard } from '@/types';
import { Badge } from '@/Components/UI/Badge';
import { Clock, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Props {
    job: JobCard;
}

export function JobCardItem({ job }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'in_progress': return 'info';
            case 'quality_check': return 'primary';
            case 'completed': return 'success';
            case 'cancelled': return 'danger';
            default: return 'secondary';
        }
    };

    return (
        <Link
            href={route('business.lab.job-cards.show', job.id)}
            className="block group"
        >
            <div className="bg-white border border-border-main rounded-xl p-5 hover:border-brand-main hover:shadow-lg transition-all h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                            Job Number
                        </span>
                        <h3 className="text-lg font-bold text-text-main group-hover:text-brand-main transition-colors">
                            {job.job_number}
                        </h3>
                    </div>
                    <Badge variant={getStatusColor(job.status)}>
                        {job.status.replace('_', ' ')}
                    </Badge>
                </div>

                <div className="space-y-3 flex-1">
                    <div>
                        <span className="text-xs text-text-muted block">Customer</span>
                        <span className="font-medium text-text-main">
                            {job.invoice?.customer?.first_name} {job.invoice?.customer?.last_name}
                        </span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border-main flex items-center justify-between text-sm">
                    <div className="flex items-center text-text-muted">
                        <Clock className="w-4 h-4 mr-1.5" />
                        <span>
                            {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                        </span>
                    </div>
                    <div className="flex items-center text-brand-main font-medium">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
