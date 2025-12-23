import React from "react";

interface AlertProps {
    variant?: "success" | "warning" | "danger" | "info";
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function Alert({
    variant = "info",
    title,
    children,
    className = "",
}: AlertProps) {
    const variants = {
        success: "bg-status-success-bg text-status-success-text border-status-success-border",
        warning: "bg-status-warning-bg text-status-warning-text border-status-warning-border",
        danger: "bg-status-error-bg text-status-error-text border-status-error-border",
        info: "bg-status-info-bg text-status-info-text border-status-info-border",
    };

    return (
        <div className={`p-4 rounded-lg border ${variants[variant]} ${className}`}>
            {title && <h4 className="text-sm font-bold mb-1">{title}</h4>}
            <div className="text-sm">{children}</div>
        </div>
    );
}
