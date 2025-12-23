import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/Components/UI/Badge';

interface Props {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export function StatCard({ title, value, icon: Icon, description, trend, color = 'primary' }: Props) {
    const colorClasses = {
        primary: 'bg-brand-subtle text-brand-main',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        danger: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
    };

    return (
        <div className="bg-white border border-border-main rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <Badge variant={trend.isPositive ? 'success' : 'danger'}>
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </Badge>
                )}
            </div>
            <div>
                <h3 className="text-sm font-medium text-text-muted mb-1">{title}</h3>
                <div className="text-2xl font-bold text-text-main">{value}</div>
                {description && (
                    <p className="text-xs text-text-muted mt-2">{description}</p>
                )}
            </div>
        </div>
    );
}
