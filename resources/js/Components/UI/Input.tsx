import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = "", ...props }, ref) => {
        return (
            <div className="w-full space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-text-secondary">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
                        block w-full rounded-lg border border-border-subtle bg-bg-muted text-text-primary 
                        placeholder-text-muted transition-colors
                        focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                        disabled:opacity-50 disabled:bg-bg-subtle
                        ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                        ${className}
                    `}
                    {...props}
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
                {helperText && !error && <p className="text-xs text-text-muted">{helperText}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";
