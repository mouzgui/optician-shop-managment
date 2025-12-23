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
                        block w-full rounded-lg border border-input-border bg-input-bg text-input-text 
                        transition-colors focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus
                        disabled:opacity-50 disabled:bg-bg-muted
                        ${error ? "border-status-error-border focus:border-status-error-border focus:ring-status-error-border" : ""}
                        ${className}
                    `}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value} className="bg-bg-base">
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="text-xs text-status-error-text">{error}</p>}
            </div>
        );
    }
);

Select.displayName = "Select";
