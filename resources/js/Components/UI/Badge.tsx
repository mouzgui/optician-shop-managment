import React from "react";

interface BadgeProps {
    variant?: "success" | "warning" | "danger" | "info" | "neutral";
    children: React.ReactNode;
    className?: string;
}

export function Badge({
    variant = "neutral",
    children,
    className = "",
}: BadgeProps) {
    const variants = {
        success: "bg-status-success-bg text-status-success-text border border-status-success-border",
        warning: "bg-status-warning-bg text-status-warning-text border border-status-warning-border",
        danger: "bg-status-error-bg text-status-error-text border border-status-error-border",
        info: "bg-status-info-bg text-status-info-text border border-status-info-border",
        neutral: "bg-bg-muted text-text-secondary border border-border-default",
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
        >
            {children}
        </span>
    );
}
