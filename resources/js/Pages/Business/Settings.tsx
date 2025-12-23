import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";
import { Card } from "@/Components/UI/Card";
import { Input } from "@/Components/UI/Input";
import { Button } from "@/Components/UI/Button";

interface Business {
    name: string;
    email: string;
    phone: string;
    address: string;
    tax_number: string;
    registration_number: string;
    logo_url: string;
    favicon_url: string;
    primary_color: string;
    footer_text: string;
}

interface SettingsProps {
    business: Business;
}

export default function Settings({ business }: SettingsProps) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        name: business.name,
        email: business.email || "",
        phone: business.phone || "",
        address: business.address || "",
        tax_number: business.tax_number || "",
        registration_number: business.registration_number || "",
        primary_color: business.primary_color || "#3b82f6",
        footer_text: business.footer_text || "",
        logo: null as File | null,
        favicon: null as File | null,
        _method: "PATCH",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("business.settings.update"), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={t("business.settings.title")} />

            <div className="max-w-4xl mx-auto space-y-6 pb-12">
                <h1 className="text-2xl font-bold text-text-primary">
                    {t("business.settings.title")}
                </h1>

                <form onSubmit={submit} className="space-y-6">
                    {/* General Settings */}
                    <Card title={t("business.settings.sections.general")}>
                        <div className="space-y-4">
                            <Input
                                label={t("business.settings.fields.name")}
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                error={errors.name}
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label={t("business.settings.fields.email")}
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    error={errors.email}
                                />
                                <Input
                                    label={t("business.settings.fields.phone")}
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    error={errors.phone}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-text-secondary">
                                    {t("business.settings.fields.address")}
                                </label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-border-default bg-bg-base text-text-primary shadow-sm focus:border-border-focus focus:ring-1 focus:ring-border-focus transition-colors"
                                    rows={3}
                                />
                                {errors.address && (
                                    <p className="mt-1 text-xs text-status-error-text">
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label={t(
                                        "business.settings.fields.tax_number"
                                    )}
                                    value={data.tax_number}
                                    onChange={(e) =>
                                        setData("tax_number", e.target.value)
                                    }
                                    error={errors.tax_number}
                                />
                                <Input
                                    label={t(
                                        "business.settings.fields.registration_number"
                                    )}
                                    value={data.registration_number}
                                    onChange={(e) =>
                                        setData(
                                            "registration_number",
                                            e.target.value
                                        )
                                    }
                                    error={errors.registration_number}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Branding Settings */}
                    <Card title={t("business.settings.sections.branding")}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        {t("business.settings.fields.logo")}
                                    </label>
                                    {business.logo_url && (
                                        <div className="mb-4 p-2 border border-border-default rounded-lg bg-bg-muted w-fit">
                                            <img
                                                src={business.logo_url}
                                                alt="Logo"
                                                className="h-16 object-contain"
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        onChange={(e) =>
                                            setData(
                                                "logo",
                                                e.target.files
                                                    ? e.target.files[0]
                                                    : null
                                            )
                                        }
                                        className="block w-full text-sm text-text-secondary file:me-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-bg-muted file:text-text-primary hover:file:bg-bg-subtle"
                                        accept="image/*"
                                    />
                                    {errors.logo && (
                                        <p className="mt-1 text-xs text-status-error-text">
                                            {errors.logo}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        {t("business.settings.fields.favicon")}
                                    </label>
                                    {business.favicon_url && (
                                        <div className="mb-4 p-2 border border-border-default rounded-lg bg-bg-muted w-fit">
                                            <img
                                                src={business.favicon_url}
                                                alt="Favicon"
                                                className="h-8 w-8 object-contain"
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        onChange={(e) =>
                                            setData(
                                                "favicon",
                                                e.target.files
                                                    ? e.target.files[0]
                                                    : null
                                            )
                                        }
                                        className="block w-full text-sm text-text-secondary file:me-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-bg-muted file:text-text-primary hover:file:bg-bg-subtle"
                                        accept="image/png,image/x-icon"
                                    />
                                    {errors.favicon && (
                                        <p className="mt-1 text-xs text-status-error-text">
                                            {errors.favicon}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        {t(
                                            "business.settings.fields.primary_color"
                                        )}
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="color"
                                            value={data.primary_color}
                                            onChange={(e) =>
                                                setData(
                                                    "primary_color",
                                                    e.target.value
                                                )
                                            }
                                            className="h-10 w-20 p-1 rounded border border-border-default bg-bg-base"
                                        />
                                        <Input
                                            value={data.primary_color}
                                            onChange={(e) =>
                                                setData(
                                                    "primary_color",
                                                    e.target.value
                                                )
                                            }
                                            error={errors.primary_color}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-text-secondary">
                                        {t(
                                            "business.settings.fields.footer_text"
                                        )}
                                    </label>
                                    <textarea
                                        value={data.footer_text}
                                        onChange={(e) =>
                                            setData(
                                                "footer_text",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-border-default bg-bg-base text-text-primary shadow-sm focus:border-border-focus focus:ring-1 focus:ring-border-focus transition-colors"
                                        rows={3}
                                        placeholder={t(
                                            "business.settings.placeholders.footer_text"
                                        )}
                                    />
                                    {errors.footer_text && (
                                        <p className="mt-1 text-xs text-status-error-text">
                                            {errors.footer_text}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" isLoading={processing} size="lg">
                            {t("business.settings.submit_btn")}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
