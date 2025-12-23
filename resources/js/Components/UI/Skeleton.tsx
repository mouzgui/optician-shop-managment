import React from "react";

interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({
    className = "",
    variant = "rectangular",
}: SkeletonProps) {
    const baseStyles = "animate-pulse bg-bg-muted";
    
    const variants = {
        text: "h-4 w-full rounded",
        circular: "rounded-full",
        rectangular: "rounded-lg",
    };

    return (
        <div className={`${baseStyles} ${variants[variant]} ${className}`} />
    );
}
