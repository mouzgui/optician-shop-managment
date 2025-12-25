import React, { forwardRef } from "react";
import { Check } from "lucide-react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    description?: string;
    error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, description, error, className = "", id, ...props }, ref) => {
        const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className="w-full">
                <label
                    htmlFor={checkboxId}
                    className={`
                        group flex items-start gap-3 cursor-pointer select-none
                        ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                >
                    <div className="relative flex-shrink-0 mt-0.5">
                        <input
                            ref={ref}
                            type="checkbox"
                            id={checkboxId}
                            className="peer sr-only"
                            {...props}
                        />
                        <div className={`
                            w-5 h-5 rounded-md border-2 
                            bg-gradient-to-b from-bg-base to-bg-subtle
                            border-border-subtle
                            transition-all duration-200 ease-out
                            group-hover:border-border-default group-hover:shadow-md
                            peer-focus:border-primary-default peer-focus:ring-4 peer-focus:ring-primary-default/10
                            peer-checked:bg-primary-default peer-checked:border-primary-default
                            peer-checked:shadow-lg peer-checked:shadow-primary-default/20
                            ${error ? "border-status-error-border" : ""}
                        `}>
                            <Check className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150 absolute top-0.5 left-0.5" />
                        </div>
                        <Check className={`
                            w-3.5 h-3.5 text-white absolute top-[3px] left-[3px]
                            opacity-0 scale-50
                            peer-checked:opacity-100 peer-checked:scale-100
                            transition-all duration-200 ease-out
                        `} strokeWidth={3} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        {label && (
                            <span className="text-sm font-medium text-text-primary leading-tight">
                                {label}
                            </span>
                        )}
                        {description && (
                            <span className="text-xs text-text-muted leading-relaxed">
                                {description}
                            </span>
                        )}
                    </div>
                </label>
                {error && (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-status-error-text mt-2 ms-8">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";
