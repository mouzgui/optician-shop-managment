import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";
import { Input } from "@/Components/UI/Input";
import { Button } from "@/Components/UI/Button";
import { Select } from "@/Components/UI/Select";
import { Card } from "@/Components/UI/Card";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface Staff {
    id: number;
    name: string;
    email: string;
    role: string;
    branch_id: number;
    phone: string;
    is_active: boolean;
}

interface Branch {
    id: number;
    name: string;
}

interface EditProps {
    staff: Staff;
    branches: Branch[];
}

export default function Edit({ staff, branches }: EditProps) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        name: staff.name,
        email: staff.email,
        password: "",
        phone: staff.phone || "",
        role: staff.role,
        branch_id: staff.branch_id,
        is_active: staff.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("business.staff.update", staff.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={t("business.staff.edit.title")} />

            <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link
                        href={route("business.staff.index")}
                        className="p-2 rounded-lg hover:bg-bg-subtle text-text-muted hover:text-text-primary transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 icon-flip" />
                    </Link>
                    <h1 className="text-2xl font-bold text-text-primary">
                        {t("business.staff.edit.title")}: {staff.name}
                    </h1>
                </div>

                <Card className="p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <Input
                            id="name"
                            label={t("business.staff.fields.name")}
                            error={errors.name}
                            placeholder={t("business.staff.fields.name_placeholder")}
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                id="email"
                                label={t("business.staff.fields.email")}
                                error={errors.email}
                                type="email"
                                placeholder={t("business.staff.fields.email_placeholder")}
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                required
                            />
                            <Input
                                id="password"
                                label={t("business.staff.fields.password")}
                                error={errors.password}
                                type="password"
                                placeholder={t("business.staff.fields.password_placeholder")}
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                id="role"
                                label={t("business.staff.fields.role")}
                                error={errors.role}
                                value={data.role}
                                onChange={(e) => setData("role", e.target.value)}
                                options={[
                                    {
                                        value: "optometrist",
                                        label: t("roles.optometrist"),
                                    },
                                    {
                                        value: "receptionist",
                                        label: t("roles.receptionist"),
                                    },
                                    {
                                        value: "sales_agent",
                                        label: t("roles.sales_agent"),
                                    },
                                    {
                                        value: "lab_technician",
                                        label: t("roles.lab_technician"),
                                    },
                                    {
                                        value: "inventory_manager",
                                        label: t("roles.inventory_manager"),
                                    },
                                ]}
                            />
                            <Select
                                id="branch_id"
                                label={t("business.staff.fields.branch")}
                                error={errors.branch_id}
                                value={data.branch_id}
                                onChange={(e) => setData("branch_id", e.target.value)}
                                options={branches.map((branch) => ({
                                    value: branch.id,
                                    label: branch.name,
                                }))}
                            />
                        </div>

                        <Input
                            id="phone"
                            label={t("business.staff.fields.phone")}
                            error={errors.phone}
                            type="tel"
                            placeholder={t("business.staff.fields.phone_placeholder")}
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                        />

                        <div className="flex items-center gap-3 p-4 rounded-lg bg-bg-subtle border border-border-subtle">
                            <input
                                id="is_active"
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData("is_active", e.target.checked)}
                                className="w-4 h-4 rounded border-border-default text-interactive-primary focus:ring-interactive-primary transition-all"
                            />
                            <label
                                htmlFor="is_active"
                                className="text-sm font-medium text-text-primary cursor-pointer select-none"
                            >
                                {t("business.staff.fields.is_active")}
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-border-subtle">
                            <Button
                                type="button"
                                variant="secondary"
                                href={route("business.staff.index")}
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
