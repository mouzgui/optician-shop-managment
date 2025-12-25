import React from "react";

interface CardProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
    header?: React.ReactNode;
    variant?: "default" | "elevated" | "bordered" | "gradient";
    padding?: "none" | "sm" | "md" | "lg";
    hover?: boolean;
}

export function Card({
    title,
    description,
    children,
    footer,
    className = "",
    icon,
    header,
    variant = "default",
    padding = "md",
    hover = false,
}: CardProps) {
    const variantClasses = {
        default: "bg-card-bg border border-card-border shadow-theme-md",
        elevated: "bg-card-bg border border-card-border shadow-xl shadow-black/5",
        bordered: "bg-transparent border-2 border-border-default",
        gradient: "bg-gradient-to-br from-card-bg via-card-bg to-bg-subtle border border-card-border shadow-theme-md",
    };

    const paddingClasses = {
        none: "",
        sm: "p-3",
        md: "p-6",
        lg: "p-8",
    };

    const hoverClass = hover
        ? "transition-all duration-300 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-0.5 hover:border-primary-default/30"
        : "";

    const hasHeader = header || title || description || icon;
    const contentPadding = padding === "none" ? "" : `px-${padding === "sm" ? "3" : padding === "lg" ? "8" : "6"} py-${padding === "sm" ? "3" : padding === "lg" ? "6" : "4"}`;

    return (
        <div className={`rounded-xl overflow-hidden ${variantClasses[variant]} ${hoverClass} ${className}`}>
            {header && (
                <div className="px-6 py-4 border-b border-card-border bg-bg-subtle/30">
                    {header}
                </div>
            )}
            {(title || description || icon) && !header && (
                <div className="px-6 py-4 border-b border-card-border bg-bg-subtle/30 flex items-center gap-3">
                    {icon && (
                        <div className="flex-shrink-0 p-2 rounded-lg bg-primary-default/10 text-primary-default">
                            {icon}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        {title && <h3 className="text-lg font-bold text-text-primary truncate">{title}</h3>}
                        {description && <p className="text-sm text-text-muted mt-0.5 truncate">{description}</p>}
                    </div>
                </div>
            )}
            <div className={hasHeader ? contentPadding : paddingClasses[padding]}>
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 bg-bg-subtle/50 border-t border-card-border">
                    {footer}
                </div>
            )}
        </div>
    );
}
