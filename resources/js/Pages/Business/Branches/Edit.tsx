import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";
import { Input } from "@/Components/UI/Input";
import { TextArea } from "@/Components/UI/TextArea";
import { Button } from "@/Components/UI/Button";
import { Card } from "@/Components/UI/Card";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface Branch {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    is_headquarters: boolean;
    is_active: boolean;
}

interface EditProps {
    branch: Branch;
}

export default function Edit({ branch }: EditProps) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        name: branch.name,
        address: branch.address || "",
        phone: branch.phone || "",
        email: branch.email || "",
        is_headquarters: branch.is_headquarters,
        is_active: branch.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("business.branches.update", branch.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={t("business.branches.edit.title")} />

            <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link
                        href={route("business.branches.index")}
                        className="p-2 rounded-lg hover:bg-bg-subtle text-text-muted hover:text-text-primary transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 icon-flip" />
                    </Link>
                    <h1 className="text-2xl font-bold text-text-primary">
                        {t("business.branches.edit.title")}
                    </h1>
                </div>

                <Card className="p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <Input
                            id="name"
                            label={t("business.branches.fields.name")}
                            error={errors.name}
                            placeholder={t(
                                "business.branches.fields.name_placeholder"
                            )}
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />

                        <TextArea
                            id="address"
                            label={t("business.branches.fields.address")}
                            error={errors.address}
                            placeholder={t(
                                "business.branches.fields.address_placeholder"
                            )}
                            value={data.address}
                            onChange={(e) => setData("address", e.target.value)}
                            rows={3}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                id="phone"
                                label={t("business.branches.fields.phone")}
                                error={errors.phone}
                                type="tel"
                                placeholder={t(
                                    "business.branches.fields.phone_placeholder"
                                )}
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                            />
                            <Input
                                id="email"
                                label={t("business.branches.fields.email")}
                                error={errors.email}
                                type="email"
                                placeholder={t(
                                    "business.branches.fields.email_placeholder"
                                )}
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 flex items-center gap-3 p-4 rounded-lg bg-bg-subtle border border-border-subtle">
                                <input
                                    id="is_headquarters"
                                    type="checkbox"
                                    checked={data.is_headquarters}
                                    onChange={(e) =>
                                        setData(
                                            "is_headquarters",
                                            e.target.checked
                                        )
                                    }
                                    className="w-4 h-4 rounded border-border-default text-interactive-primary focus:ring-interactive-primary transition-all"
                                />
                                <label
                                    htmlFor="is_headquarters"
                                    className="text-sm font-medium text-text-primary cursor-pointer select-none"
                                >
                                    {t("business.branches.fields.is_hq")}
                                </label>
                            </div>
                            <div className="flex-1 flex items-center gap-3 p-4 rounded-lg bg-bg-subtle border border-border-subtle">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData("is_active", e.target.checked)
                                    }
                                    className="w-4 h-4 rounded border-border-default text-interactive-primary focus:ring-interactive-primary transition-all"
                                />
                                <label
                                    htmlFor="is_active"
                                    className="text-sm font-medium text-text-primary cursor-pointer select-none"
                                >
                                    {t("business.branches.fields.is_active")}
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-border-subtle">
                            <Button
                                type="button"
                                variant="secondary"
                                href={route("business.branches.index")}
                            >
                                {t("common.cancel")}
                            </Button>
                            <Button type="submit" isLoading={processing}>
                                {t("common.save")}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
