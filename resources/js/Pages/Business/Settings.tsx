import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";
import { Card } from "@/Components/UI/Card";
import { Input } from "@/Components/UI/Input";
import { TextArea } from "@/Components/UI/TextArea";
import { Button } from "@/Components/UI/Button";
import {
    Settings as SettingsIcon,
    Palette,
    Building2,
    Upload,
    Globe,
    Mail,
    Phone,
    MapPin,
    Hash,
} from "lucide-react";

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
                    <Card
                        title={t("business.settings.sections.general")}
                        icon={
                            <Building2 className="w-5 h-5 text-primary-default" />
                        }
                    >
                        <div className="space-y-4">
                            <Input
                                label={t("business.settings.fields.name")}
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                error={errors.name}
                                icon={<Building2 className="w-4 h-4" />}
                                placeholder={t(
                                    "business.settings.placeholders.name"
                                )}
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
                                    icon={<Mail className="w-4 h-4" />}
                                    placeholder={t(
                                        "business.settings.placeholders.email"
                                    )}
                                />
                                <Input
                                    label={t("business.settings.fields.phone")}
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    error={errors.phone}
                                    icon={<Phone className="w-4 h-4" />}
                                    placeholder={t(
                                        "business.settings.placeholders.phone"
                                    )}
                                />
                            </div>

                            <TextArea
                                label={t("business.settings.fields.address")}
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                                error={errors.address}
                                rows={3}
                                placeholder={t(
                                    "business.settings.placeholders.address"
                                )}
                            />

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
                                    icon={<Hash className="w-4 h-4" />}
                                    placeholder={t(
                                        "business.settings.placeholders.tax_number"
                                    )}
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
                                    icon={<Hash className="w-4 h-4" />}
                                    placeholder={t(
                                        "business.settings.placeholders.registration_number"
                                    )}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Branding Settings */}
                    <Card
                        title={t("business.settings.sections.branding")}
                        icon={
                            <Palette className="w-5 h-5 text-primary-default" />
                        }
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-text-secondary">
                                        {t("business.settings.fields.logo")}
                                    </label>
                                    <div className="flex items-start gap-4">
                                        {business.logo_url && (
                                            <div className="shrink-0 p-2 border border-border-default rounded-lg bg-bg-muted">
                                                <img
                                                    src={business.logo_url}
                                                    alt="Logo"
                                                    className="h-12 w-auto object-contain"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    onChange={(e) =>
                                                        setData(
                                                            "logo",
                                                            e.target.files
                                                                ? e.target
                                                                      .files[0]
                                                                : null
                                                        )
                                                    }
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    accept="image/*"
                                                />
                                                <div className="flex items-center gap-2 px-4 py-2 border border-border-default rounded-lg bg-bg-base text-text-secondary hover:bg-bg-subtle transition-colors">
                                                    <Upload className="w-4 h-4" />
                                                    <span className="text-sm truncate">
                                                        {data.logo
                                                            ? data.logo.name
                                                            : t(
                                                                  "common.upload_image"
                                                              )}
                                                    </span>
                                                </div>
                                            </div>
                                            {errors.logo && (
                                                <p className="mt-1 text-xs text-status-error-text">
                                                    {errors.logo}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-text-secondary">
                                        {t("business.settings.fields.favicon")}
                                    </label>
                                    <div className="flex items-start gap-4">
                                        {business.favicon_url && (
                                            <div className="shrink-0 p-2 border border-border-default rounded-lg bg-bg-muted">
                                                <img
                                                    src={business.favicon_url}
                                                    alt="Favicon"
                                                    className="h-8 w-8 object-contain"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    onChange={(e) =>
                                                        setData(
                                                            "favicon",
                                                            e.target.files
                                                                ? e.target
                                                                      .files[0]
                                                                : null
                                                        )
                                                    }
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    accept="image/png,image/x-icon"
                                                />
                                                <div className="flex items-center gap-2 px-4 py-2 border border-border-default rounded-lg bg-bg-base text-text-secondary hover:bg-bg-subtle transition-colors">
                                                    <Upload className="w-4 h-4" />
                                                    <span className="text-sm truncate">
                                                        {data.favicon
                                                            ? data.favicon.name
                                                            : t(
                                                                  "common.upload_icon"
                                                              )}
                                                    </span>
                                                </div>
                                            </div>
                                            {errors.favicon && (
                                                <p className="mt-1 text-xs text-status-error-text">
                                                    {errors.favicon}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-text-secondary">
                                        {t(
                                            "business.settings.fields.primary_color"
                                        )}
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-12 h-10 shrink-0 overflow-hidden rounded-lg border border-border-default">
                                            <input
                                                type="color"
                                                value={data.primary_color}
                                                onChange={(e) =>
                                                    setData(
                                                        "primary_color",
                                                        e.target.value
                                                    )
                                                }
                                                className="absolute -inset-2 w-[calc(100%+1rem)] h-[calc(100%+1rem)] cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                value={data.primary_color}
                                                onChange={(e) =>
                                                    setData(
                                                        "primary_color",
                                                        e.target.value
                                                    )
                                                }
                                                error={errors.primary_color}
                                                placeholder="#000000"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <TextArea
                                    label={t(
                                        "business.settings.fields.footer_text"
                                    )}
                                    value={data.footer_text}
                                    onChange={(e) =>
                                        setData("footer_text", e.target.value)
                                    }
                                    error={errors.footer_text}
                                    rows={3}
                                    placeholder={t(
                                        "business.settings.placeholders.footer_text"
                                    )}
                                />
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
