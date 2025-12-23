import React, { PropsWithChildren, useEffect } from "react";
import { Sidebar } from "@/Components/UI/Sidebar";
import { Header } from "@/Components/UI/Header";
import { usePage } from "@inertiajs/react";
import { Toaster, toast } from "react-hot-toast";

export function AuthenticatedLayout({ children }: PropsWithChildren) {
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
                "--color-primary-600",
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
        <div className="flex min-h-screen bg-bg-subtle">
            <Toaster position="top-right" />
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto">{children}</main>
                {branding?.footer_text && (
                    <footer className="p-4 text-center text-sm text-text-muted border-t border-border-subtle bg-bg-primary">
                        {branding.footer_text}
                    </footer>
                )}
            </div>
        </div>
    );
}
