import React from "react";

interface CardProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

export function Card({
    title,
    description,
    children,
    footer,
    className = "",
}: CardProps) {
    return (
        <div className={`bg-card-bg rounded-xl border border-card-border shadow-theme-md overflow-hidden ${className}`}>
            {(title || description) && (
                <div className="px-6 py-4 border-b border-card-border">
                    {title && <h3 className="text-lg font-bold text-text-primary">{title}</h3>}
                    {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
                </div>
            )}
            <div className="px-6 py-4">{children}</div>
            {footer && <div className="px-6 py-4 bg-bg-subtle border-t border-card-border">{footer}</div>}
        </div>
    );
}
