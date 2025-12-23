import React, { PropsWithChildren, useEffect } from "react";
import { LanguageSwitcher } from "@/Components/UI/LanguageSwitcher";
import { ThemeToggle } from "@/Components/UI/ThemeToggle";
import { usePage } from "@inertiajs/react";
import { Toaster, toast } from "react-hot-toast";

interface GuestLayoutProps {
    title?: string;
    logo?: string;
}

export function GuestLayout({
    children,
    title,
    logo,
}: PropsWithChildren<GuestLayoutProps>) {
    const { branding, flash } = usePage<any>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    useEffect(() => {
        if (branding?.primary_color) {
            document.documentElement.style.setProperty(
                "--interactive-primary",
                branding.primary_color
            );
            document.documentElement.style.setProperty(
                "--color-primary-600",
                branding.primary_color
            );
            document.documentElement.style.setProperty(
                "--border-focus",
                branding.primary_color
            );
        }

        if (branding?.favicon_url) {
            let favicon = document.querySelector('link[rel="icon"]');
            if (!favicon) {
                favicon = document.createElement("link");
                favicon.setAttribute("rel", "icon");
                document.head.appendChild(favicon);
            }
            favicon.setAttribute("href", branding.favicon_url);
        }
    }, [branding]);

    return (
        <div className="min-h-screen flex flex-col bg-bg-subtle">
            <Toaster position="top-right" />
            {/* Header with theme/language toggles */}
            <div className="absolute top-4 end-4 flex items-center gap-3">
                <ThemeToggle />
                <LanguageSwitcher />
            </div>

            {/* Centered content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        {branding?.logo_url ? (
                            <img
                                src={branding.logo_url}
                                alt="Logo"
                                className="h-16 mx-auto"
                            />
                        ) : logo ? (
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
                {branding?.footer_text
                    ? branding.footer_text
                    : `© ${new Date().getFullYear()} Optical Shop Manager`}
            </div>
        </div>
    );
}
