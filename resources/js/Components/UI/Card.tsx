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
        <div className={`bg-bg-primary rounded-xl border border-border-subtle shadow-sm overflow-hidden ${className}`}>
            {(title || description) && (
                <div className="px-6 py-4 border-b border-border-subtle">
                    {title && <h3 className="text-lg font-bold text-text-primary">{title}</h3>}
                    {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
                </div>
            )}
            <div className="px-6 py-4">{children}</div>
            {footer && <div className="px-6 py-4 bg-bg-muted/50 border-t border-border-subtle">{footer}</div>}
        </div>
    );
}
