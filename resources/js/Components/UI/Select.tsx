import React, { forwardRef } from "react";

interface Option {
    value: string | number;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: Option[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className = "", ...props }, ref) => {
        return (
            <div className="w-full space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-text-secondary">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`
                        block w-full rounded-lg border border-border-subtle bg-bg-muted text-text-primary 
                        transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                        disabled:opacity-50 disabled:bg-bg-subtle
                        ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                        ${className}
                    `}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);

Select.displayName = "Select";
