import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";
import { Input } from "@/Components/UI/Input";
import { Select } from "@/Components/UI/Select";
import { Button } from "@/Components/UI/Button";
import { Card } from "@/Components/UI/Card";
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
        post(route("admin.businesses.store"));
    };

    return (
        <AuthenticatedLayout>
            <Head title={t("admin.businesses.create.title")} />

            <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link
                        href={route("admin.businesses.index")}
                        className="p-2 rounded-lg hover:bg-bg-subtle text-text-muted hover:text-text-primary transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 icon-flip" />
                    </Link>
                    <h1 className="text-2xl font-bold text-text-primary">
                        {t("admin.businesses.create.title")}
                    </h1>
                </div>

                <Card className="p-6">
                    <form onSubmit={submit} className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-text-primary border-b border-border-subtle pb-2">
                                {t("admin.businesses.sections.business_info")}
                            </h2>

                            <Input
                                id="name"
                                label={t("admin.businesses.fields.name")}
                                error={errors.name}
                                type="text"
                                placeholder={t(
                                    "admin.businesses.fields.name_placeholder"
                                )}
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    id="primary_color"
                                    label={t(
                                        "admin.businesses.fields.primary_color"
                                    )}
                                    error={errors.primary_color}
                                    type="color"
                                    value={data.primary_color}
                                    onChange={(e) =>
                                        setData("primary_color", e.target.value)
                                    }
                                    className="h-10"
                                />
                                <Select
                                    id="default_language"
                                    label={t(
                                        "admin.businesses.fields.default_language"
                                    )}
                                    error={errors.default_language}
                                    value={data.default_language}
                                    onChange={(e) =>
                                        setData(
                                            "default_language",
                                            e.target.value
                                        )
                                    }
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
                                {t("admin.businesses.sections.owner_info")}
                            </h2>

                            <Input
                                id="owner_name"
                                label={t("admin.businesses.fields.owner_name")}
                                error={errors.owner_name}
                                type="text"
                                placeholder={t(
                                    "admin.businesses.fields.owner_name_placeholder"
                                )}
                                value={data.owner_name}
                                onChange={(e) =>
                                    setData("owner_name", e.target.value)
                                }
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    id="owner_email"
                                    label={t(
                                        "admin.businesses.fields.owner_email"
                                    )}
                                    error={errors.owner_email}
                                    type="email"
                                    placeholder={t(
                                        "admin.businesses.fields.owner_email_placeholder"
                                    )}
                                    value={data.owner_email}
                                    onChange={(e) =>
                                        setData("owner_email", e.target.value)
                                    }
                                    required
                                />
                                <Input
                                    id="owner_password"
                                    label={t(
                                        "admin.businesses.fields.owner_password"
                                    )}
                                    error={errors.owner_password}
                                    type="password"
                                    placeholder={t(
                                        "admin.businesses.fields.owner_password_placeholder"
                                    )}
                                    value={data.owner_password}
                                    onChange={(e) =>
                                        setData(
                                            "owner_password",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-border-subtle">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() =>
                                    router.get(route("admin.businesses.index"))
                                }
                            >
                                {t("common.cancel")}
                            </Button>
                            <Button type="submit" isLoading={processing}>
                                {t("common.create")}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
