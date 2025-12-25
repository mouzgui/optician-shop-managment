import React, { forwardRef, createContext, useContext } from "react";

// Radio Context
interface RadioContextValue {
    name: string;
    value: string | number;
    onChange: (value: string | number) => void;
    disabled?: boolean;
}

const RadioContext = createContext<RadioContextValue | null>(null);

// RadioGroup Component
interface RadioGroupProps {
    name: string;
    value: string | number;
    onChange: (value: string | number) => void;
    children: React.ReactNode;
    label?: string;
    error?: string;
    helperText?: string;
    disabled?: boolean;
    orientation?: "horizontal" | "vertical";
    className?: string;
}

export function RadioGroup({
    name,
    value,
    onChange,
    children,
    label,
    error,
    helperText,
    disabled = false,
    orientation = "vertical",
    className = "",
}: RadioGroupProps) {
    return (
        <RadioContext.Provider value={{ name, value, onChange, disabled }}>
            <div className={`w-full space-y-3 ${className}`} role="radiogroup">
                {label && (
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-text-primary tracking-wide">
                        {label}
                    </label>
                )}
                <div className={`
                    flex gap-4
                    ${orientation === "vertical" ? "flex-col gap-3" : "flex-wrap"}
                `}>
                    {children}
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
        </RadioContext.Provider>
    );
}

// RadioItem Component
interface RadioItemProps {
    value: string | number;
    label: string;
    description?: string;
    disabled?: boolean;
    className?: string;
}

export const RadioItem = forwardRef<HTMLInputElement, RadioItemProps>(
    ({ value, label, description, disabled: itemDisabled, className = "" }, ref) => {
        const context = useContext(RadioContext);

        if (!context) {
            throw new Error("RadioItem must be used within a RadioGroup");
        }

        const { name, value: selectedValue, onChange, disabled: groupDisabled } = context;
        const isDisabled = groupDisabled || itemDisabled;
        const isSelected = selectedValue === value;

        return (
            <label
                className={`
                    group flex items-start gap-3 cursor-pointer select-none
                    ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                    ${className}
                `}
            >
                <div className="relative flex-shrink-0 mt-0.5">
                    <input
                        ref={ref}
                        type="radio"
                        name={name}
                        value={value}
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => onChange(value)}
                        className="peer sr-only"
                    />
                    <div className={`
                        w-5 h-5 rounded-full border-2 
                        bg-gradient-to-b from-bg-base to-bg-subtle
                        border-border-subtle
                        transition-all duration-200 ease-out
                        group-hover:border-border-default group-hover:shadow-md
                        peer-focus:border-primary-default peer-focus:ring-4 peer-focus:ring-primary-default/10
                        peer-checked:border-primary-default peer-checked:shadow-lg peer-checked:shadow-primary-default/20
                    `} />
                    <div className={`
                        absolute top-1 left-1 w-3 h-3 rounded-full
                        bg-primary-default
                        transition-all duration-200 ease-out
                        ${isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"}
                    `} />
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-text-primary leading-tight">
                        {label}
                    </span>
                    {description && (
                        <span className="text-xs text-text-muted leading-relaxed">
                            {description}
                        </span>
                    )}
                </div>
            </label>
        );
    }
);

RadioItem.displayName = "RadioItem";
