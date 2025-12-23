import React from "react";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
    const { t } = useTranslation();

    return (
        <header className="h-16 bg-bg-base border-b border-border-default flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <button className="lg:hidden text-text-secondary">
                    {/* Hamburger Menu Icon */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h2 className="text-lg font-semibold text-text-primary lg:hidden">
                    OptiManager
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />
                <LanguageSwitcher />
                <div className="h-8 w-px bg-border-default mx-2" />
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-interactive-primary flex items-center justify-center text-text-inverted font-bold">
                        JD
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-text-primary line-height-tight">John Doe</p>
                        <p className="text-xs text-text-muted">Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
