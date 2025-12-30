import React from 'react';
import { Link } from '@inertiajs/react';
import { JobCard } from '@/types';
import { Badge } from '@/Components/UI/Badge';
import { Clock, ChevronRight, User, FileText, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Props {
    job: JobCard;
}

export function JobCardItem({ job }: Props) {
    // Guard against null/undefined job
    if (!job) {
        return null;
    }

    const getStatusConfig = (status: string | undefined) => {
        switch (status) {
            case 'pending':
                return {
                    variant: 'warning' as const,
                    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
                    borderColor: 'border-amber-200 dark:border-amber-800',
                    iconColor: 'text-amber-500'
                };
            case 'in_progress':
                return {
                    variant: 'info' as const,
                    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                    borderColor: 'border-blue-200 dark:border-blue-800',
                    iconColor: 'text-blue-500'
                };
            case 'quality_check':
                return {
                    variant: 'primary' as const,
                    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
                    borderColor: 'border-purple-200 dark:border-purple-800',
                    iconColor: 'text-purple-500'
                };
            case 'completed':
                return {
                    variant: 'success' as const,
                    bgColor: 'bg-green-50 dark:bg-green-900/20',
                    borderColor: 'border-green-200 dark:border-green-800',
                    iconColor: 'text-green-500'
                };
            case 'cancelled':
                return {
                    variant: 'danger' as const,
                    bgColor: 'bg-red-50 dark:bg-red-900/20',
                    borderColor: 'border-red-200 dark:border-red-800',
                    iconColor: 'text-red-500'
                };
            default:
                return {
                    variant: 'secondary' as const,
                    bgColor: 'bg-gray-50 dark:bg-gray-800/50',
                    borderColor: 'border-gray-200 dark:border-gray-700',
                    iconColor: 'text-gray-500'
                };
        }
    };

    const formatStatus = (status: string | undefined) => {
        if (!status) return 'Unknown';
        return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return 'Recently';
        try {
            return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
        } catch {
            return 'Recently';
        }
    };

    const statusConfig = getStatusConfig(job.status);
    const isUrgent = (job as any).is_urgent || (job as any).priority === 'high';

    return (
        <Link
            href={route("business.lab.job-cards.show", job.id)}
            className="block group"
        >
            <div className={`
                relative overflow-hidden rounded-xl border-2 transition-all duration-300
                bg-white dark:bg-gray-800/50 
                ${statusConfig.borderColor}
                hover:shadow-xl hover:scale-[1.02] hover:border-blue-400 dark:hover:border-blue-500
            `}>
                {/* Urgent indicator */}
                {isUrgent && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-bl-lg flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        URGENT
                    </div>
                )}

                {/* Status color bar */}
                <div className={`h-1 ${statusConfig.bgColor.replace('bg-', 'bg-').replace('-50', '-400').replace('-900/20', '-500')}`} />

                <div className="p-5">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <FileText className={`w-4 h-4 ${statusConfig.iconColor}`} />
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Job Number
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {job.job_number || 'N/A'}
                            </h3>
                        </div>
                        <Badge variant={statusConfig.variant}>
                            {formatStatus(job.status)}
                        </Badge>
                    </div>

                    {/* Customer info */}
                    <div className={`rounded-lg p-3 mb-4 ${statusConfig.bgColor}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Customer</span>
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {job.invoice?.customer?.first_name || ''} {job.invoice?.customer?.last_name || 'Unknown Customer'}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(job.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                            View Details
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
