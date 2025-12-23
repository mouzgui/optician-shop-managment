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
        success: "bg-green-50 text-green-800 border-green-200",
        warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
        danger: "bg-red-50 text-red-800 border-red-200",
        info: "bg-blue-50 text-blue-800 border-blue-200",
    };

    return (
        <div className={`p-4 rounded-lg border ${variants[variant]} ${className}`}>
            {title && <h4 className="text-sm font-bold mb-1">{title}</h4>}
            <div className="text-sm">{children}</div>
        </div>
    );
}
