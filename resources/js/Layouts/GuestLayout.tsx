import React, { PropsWithChildren } from "react";
import { LanguageSwitcher } from "@/Components/UI/LanguageSwitcher";
import { ThemeToggle } from "@/Components/UI/ThemeToggle";

interface GuestLayoutProps {
    title?: string;
    logo?: string;
}

export function GuestLayout({
    children,
    title,
    logo,
}: PropsWithChildren<GuestLayoutProps>) {
    return (
        <div className="min-h-screen flex flex-col bg-bg-subtle">
            {/* Header with theme/language toggles */}
            <div className="absolute top-4 right-4 flex items-center gap-3">
                <ThemeToggle />
                <LanguageSwitcher />
            </div>

            {/* Centered content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        {logo ? (
                            <img
                                src={logo}
                                alt="Logo"
                                className="h-16 mx-auto"
                            />
                        ) : (
                            <div className="text-3xl font-bold text-text-primary">
                                👓 OptiManager
                            </div>
                        )}
                    </div>

                    {/* Card */}
                    <div className="bg-bg-base rounded-xl shadow-theme-lg border border-border-default p-8">
                        {title && (
                            <h1 className="text-2xl font-semibold text-text-primary text-center mb-6">
                                {title}
                            </h1>
                        )}
                        {children}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-4 text-text-muted text-sm">
                © {new Date().getFullYear()} Optical Shop Manager
            </div>
        </div>
    );
}
