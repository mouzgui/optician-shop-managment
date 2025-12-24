import React, { forwardRef } from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ label, error, helperText, className = "", ...props }, ref) => {
        return (
            <div className="w-full space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-text-secondary">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={`
                        block w-full rounded-lg border border-input-border bg-input-bg text-input-text 
                        placeholder-input-placeholder transition-colors
                        focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus
                        disabled:opacity-50 disabled:bg-bg-muted
                        ${error ? "border-status-error-border focus:border-status-error-border focus:ring-status-error-border" : ""}
                        ${className}
                    `}
                    {...props}
                />
                {error && <p className="text-xs text-status-error-text">{error}</p>}
                {helperText && !error && <p className="text-xs text-text-muted">{helperText}</p>}
            </div>
        );
    }
);

TextArea.displayName = "TextArea";
