import React, { PropsWithChildren } from "react";
import { Sidebar } from "@/Components/UI/Sidebar";
import { Header } from "@/Components/UI/Header";

export function AuthenticatedLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen bg-bg-subtle">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
