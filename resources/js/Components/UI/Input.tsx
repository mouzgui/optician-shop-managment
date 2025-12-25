import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
    iconEnd?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = "", icon, iconEnd, ...props }, ref) => {
        const baseInputClasses = `
            block w-full px-4 py-3 rounded-xl
            bg-gradient-to-b from-bg-base to-bg-subtle
            border-2 border-border-subtle
            text-text-primary text-sm font-medium
            placeholder:text-text-muted placeholder:font-normal
            shadow-sm
            transition-all duration-200 ease-out
            hover:border-border-default hover:shadow-md
            focus:outline-none focus:border-primary-default focus:ring-4 focus:ring-primary-default/10 focus:shadow-lg focus:shadow-primary-default/5
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-bg-muted disabled:hover:shadow-sm
        `;

        const errorClasses = error
            ? "border-status-error-border focus:border-status-error-border focus:ring-status-error-border/10 focus:shadow-status-error-border/5"
            : "";

        const iconPadding = icon ? "ps-12" : "";
        const iconEndPadding = iconEnd ? "pe-12" : "";

        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-text-primary tracking-wide">
                        {label}
                        {props.required && (
                            <span className="text-status-error-text text-xs">*</span>
                        )}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute start-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-default transition-colors duration-200">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`
                            ${baseInputClasses}
                            ${errorClasses}
                            ${iconPadding}
                            ${iconEndPadding}
                            ${className}
                        `}
                        {...props}
                    />
                    {iconEnd && (
                        <div className="absolute end-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-default transition-colors duration-200">
                            {iconEnd}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-status-error-text">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p className="text-xs text-text-muted ps-1">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
