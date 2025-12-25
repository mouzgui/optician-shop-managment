import React, { useState } from "react";
import { Head, useForm, Link, router } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";
import { Input } from "@/Components/UI/Input";
import { Select } from "@/Components/UI/Select";
import { Button } from "@/Components/UI/Button";
import { ArrowLeft } from "lucide-react";

export default function Create() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        owner_name: "",
        owner_email: "",
        owner_password: "",
        primary_color: "#3b82f6",
        default_language: "en",
        currency_code: "USD",
        tax_rate: 0,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/businesses");
    };

    // Safe translation helper with fallback
    const safeT = (key: string, fallback?: string) => {
        try {
            const result = t(key);
            return typeof result === "string" ? result : fallback || key;
        } catch {
            return fallback || key;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={safeT("admin.businesses.create.title", "Create New Business")} />

            <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/businesses"
                        className="p-2 rounded-lg hover:bg-bg-subtle text-text-muted hover:text-text-primary transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 icon-flip" />
                    </Link>
                    <h1 className="text-2xl font-bold text-text-primary">
                        {safeT("admin.businesses.create.title", "Create New Business")}
                    </h1>
                </div>

                <div className="bg-card-bg rounded-xl border border-card-border shadow-theme-md overflow-hidden p-6">
                    <form onSubmit={submit} className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-text-primary border-b border-border-subtle pb-2">
                                {safeT("admin.businesses.sections.business_info", "Business Information")}
                            </h2>

                            <Input
                                id="name"
                                label={safeT("admin.businesses.fields.name", "Business Name")}
                                error={errors.name}
                                type="text"
                                placeholder={safeT("admin.businesses.fields.name_placeholder", "e.g., Vision Pro Optical")}
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    id="primary_color"
                                    label={safeT("admin.businesses.fields.primary_color", "Primary Color")}
                                    error={errors.primary_color}
                                    type="color"
                                    value={data.primary_color}
                                    onChange={(e) => setData("primary_color", e.target.value)}
                                    className="h-10"
                                />
                                <Select
                                    id="default_language"
                                    label={safeT("admin.businesses.fields.default_language", "Language")}
                                    error={errors.default_language}
                                    value={data.default_language}
                                    onChange={(e) => setData("default_language", e.target.value)}
                                    options={[
                                        { value: "en", label: "English" },
                                        { value: "ar", label: "Arabic" },
                                        { value: "fr", label: "French" },
                                        { value: "es", label: "Spanish" },
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-text-primary border-b border-border-subtle pb-2">
                                {safeT("admin.businesses.sections.owner_info", "Owner Information")}
                            </h2>

                            <Input
                                id="owner_name"
                                label={safeT("admin.businesses.fields.owner_name", "Owner Name")}
                                error={errors.owner_name}
                                type="text"
                                placeholder={safeT("admin.businesses.fields.owner_name_placeholder", "Full Name")}
                                value={data.owner_name}
                                onChange={(e) => setData("owner_name", e.target.value)}
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    id="owner_email"
                                    label={safeT("admin.businesses.fields.owner_email", "Owner Email")}
                                    error={errors.owner_email}
                                    type="email"
                                    placeholder={safeT("admin.businesses.fields.owner_email_placeholder", "email@example.com")}
                                    value={data.owner_email}
                                    onChange={(e) => setData("owner_email", e.target.value)}
                                    required
                                />
                                <Input
                                    id="owner_password"
                                    label={safeT("admin.businesses.fields.owner_password", "Owner Password")}
                                    error={errors.owner_password}
                                    type="password"
                                    placeholder={safeT("admin.businesses.fields.owner_password_placeholder", "Minimum 8 characters")}
                                    value={data.owner_password}
                                    onChange={(e) => setData("owner_password", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-border-subtle">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => router.get("/admin/businesses")}
                            >
                                {safeT("common.cancel", "Cancel")}
                            </Button>
                            <Button type="submit" isLoading={processing}>
                                {safeT("common.create", "Create")}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

