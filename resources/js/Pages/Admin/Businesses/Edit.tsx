import React from "react";
import { Head, useForm, Link, router } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";
import { Input } from "@/Components/UI/Input";
import { Select } from "@/Components/UI/Select";
import { Button } from "@/Components/UI/Button";
import { ArrowLeft, User, Mail } from "lucide-react";

interface Business {
    id: number;
    name: string;
    primary_color: string;
    default_language: string;
    currency_code: string;
    tax_rate: number;
    is_active: boolean;
    owner?: {
        name: string;
        email: string;
    };
}

interface EditProps {
    business: Business;
}

export default function Edit({ business }: EditProps) {
    const { t } = useTranslation();

    // Safe translation helper
    const safeT = (key: string, fallback?: string) => {
        try {
            const result = t(key);
            return typeof result === "string" ? result : fallback || key;
        } catch {
            return fallback || key;
        }
    };

    const { data, setData, put, processing, errors } = useForm({
        name: business.name,
        primary_color: business.primary_color || "#3b82f6",
        default_language: business.default_language || "en",
        currency_code: business.currency_code || "USD",
        tax_rate: business.tax_rate || 0,
        is_active: business.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/businesses/${business.id}`);
    };

    return (
        <AuthenticatedLayout>
            <Head title={safeT("admin.businesses.edit.title", "Edit Business")} />

            <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/businesses"
                        className="p-2 rounded-lg hover:bg-bg-subtle text-text-muted hover:text-text-primary transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 icon-flip" />
                    </Link>
                    <h1 className="text-2xl font-bold text-text-primary">
                        {safeT("admin.businesses.edit.title", "Edit Business")}: {business.name}
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

                            <div className="flex items-center gap-3 py-2 px-3 bg-bg-subtle rounded-lg border border-border-subtle w-fit">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData("is_active", e.target.checked)}
                                    className="w-4 h-4 rounded border-border-strong text-primary-default focus:ring-primary-default bg-bg-base transition-all"
                                />
                                <label
                                    htmlFor="is_active"
                                    className="text-sm font-medium text-text-secondary cursor-pointer"
                                >
                                    {safeT("admin.businesses.fields.active_status", "Is Active")}
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-text-primary border-b border-border-subtle pb-2">
                                {safeT("admin.businesses.sections.owner_info", "Owner Information")}
                            </h2>
                            <div className="p-4 bg-bg-subtle rounded-xl border border-border-subtle space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary-default/10 flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary-default" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-text-muted font-medium uppercase tracking-wider">
                                            {safeT("admin.businesses.fields.owner_name", "Owner Name")}
                                        </span>
                                        <span className="text-sm font-semibold text-text-primary">
                                            {business.owner?.name || "N/A"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary-default/10 flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-primary-default" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-text-muted font-medium uppercase tracking-wider">
                                            {safeT("admin.businesses.fields.owner_email", "Owner Email")}
                                        </span>
                                        <span className="text-sm font-semibold text-text-primary">
                                            {business.owner?.email || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-text-muted italic flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-default/40" />
                                {safeT("admin.businesses.edit.owner_note", "Owner details cannot be changed here")}
                            </p>
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
                                {safeT("common.save", "Save")}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
