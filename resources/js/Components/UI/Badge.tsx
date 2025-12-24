import React from "react";

interface BadgeProps {
    variant?: "success" | "warning" | "danger" | "info" | "neutral" | "primary" | "secondary";
    children: React.ReactNode;
    className?: string;
    size?: "sm" | "md";
}

export function Badge({
    variant = "neutral",
    children,
    className = "",
    size = "sm",
}: BadgeProps) {
    const variants = {
        success: "bg-status-success-bg text-status-success-text border border-status-success-border",
        warning: "bg-status-warning-bg text-status-warning-text border border-status-warning-border",
        danger: "bg-status-error-bg text-status-error-text border border-status-error-border",
        info: "bg-status-info-bg text-status-info-text border border-status-info-border",
        neutral: "bg-bg-muted text-text-secondary border border-border-default",
        primary: "bg-btn-primary/10 text-btn-primary border border-btn-primary/20",
        secondary: "bg-bg-subtle text-text-primary border border-border-default",
    };

    const sizes = {
        sm: "px-2.5 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </span>
    );
}
