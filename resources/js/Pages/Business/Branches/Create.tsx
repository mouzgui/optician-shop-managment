import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";
import { Input } from "@/Components/UI/Input";
import { TextArea } from "@/Components/UI/TextArea";
import { Button } from "@/Components/UI/Button";
import { Card } from "@/Components/UI/Card";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Create() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        address: "",
        phone: "",
        email: "",
        is_headquarters: false,
        is_active: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("business.branches.store"));
    };

    return (
        <AuthenticatedLayout>
            <Head title={t("business.branches.create.title")} />

            <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link
                        href={route("business.branches.index")}
                        className="p-2 rounded-lg hover:bg-bg-subtle text-text-muted hover:text-text-primary transition-all"
                    >
                        <ArrowLeftIcon className="w-5 h-5 icon-flip" />
                    </Link>
                    <h1 className="text-2xl font-bold text-text-primary">
                        {t("business.branches.create.title")}
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

                        <div className="flex items-center gap-3 p-4 rounded-lg bg-bg-subtle border border-border-subtle">
                            <input
                                id="is_headquarters"
                                type="checkbox"
                                checked={data.is_headquarters}
                                onChange={(e) =>
                                    setData("is_headquarters", e.target.checked)
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

                        <div className="flex justify-end gap-3 pt-6 border-t border-border-subtle">
                            <Button
                                type="button"
                                variant="secondary"
                                href={route("business.branches.index")}
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
