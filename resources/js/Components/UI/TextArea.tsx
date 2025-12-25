import React, { forwardRef } from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    showCharCount?: boolean;
    maxLength?: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ label, error, helperText, showCharCount, maxLength, className = "", value, ...props }, ref) => {
        const baseTextAreaClasses = `
            block w-full px-4 py-3 rounded-xl resize-none
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
            ? "border-status-error-border focus:border-status-error-border focus:ring-status-error-border/10"
            : "";

        const charCount = typeof value === 'string' ? value.length : 0;

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
                    <textarea
                        ref={ref}
                        value={value}
                        maxLength={maxLength}
                        className={`
                            ${baseTextAreaClasses}
                            ${errorClasses}
                            ${className}
                        `}
                        {...props}
                    />
                    {showCharCount && maxLength && (
                        <div className="absolute bottom-3 end-3 text-xs text-text-muted bg-bg-base/80 backdrop-blur-sm px-2 py-0.5 rounded-md">
                            <span className={charCount > maxLength * 0.9 ? "text-status-warning-text" : ""}>
                                {charCount}
                            </span>
                            /{maxLength}
                        </div>
                    )}
                </div>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        {error && (
                            <p className="flex items-center gap-1.5 text-xs font-medium text-status-error-text">
                                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </p>
                        )}
                        {helperText && !error && (
                            <p className="text-xs text-text-muted ps-1">{helperText}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }
);

TextArea.displayName = "TextArea";
