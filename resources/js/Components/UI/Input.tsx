import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = "", icon, ...props }, ref) => {
        return (
            <div className="w-full space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-text-secondary">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`
                            block w-full rounded-lg border border-input-border bg-input-bg text-input-text 
                            placeholder-input-placeholder transition-colors
                            focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus
                            disabled:opacity-50 disabled:bg-bg-muted
                            ${icon ? "ps-10" : ""}
                            ${error ? "border-status-error-border focus:border-status-error-border focus:ring-status-error-border" : ""}
                            ${className}
                        `}
                        {...props}
                    />
                </div>
                {error && <p className="text-xs text-status-error-text">{error}</p>}
                {helperText && !error && <p className="text-xs text-text-muted">{helperText}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";
