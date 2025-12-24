import React from "react";
import { Input } from "@/Components/UI/Input";
import { Button } from "@/Components/UI/Button";
import { Select } from "@/Components/UI/Select";
import { TextArea } from "@/Components/UI/TextArea";
import { useTranslation } from "react-i18next";

import CustomerSearch from "@/Components/Forms/CustomerSearch";

interface Branch {
    id: number;
    name: string;
}

interface CustomerSummary {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
}

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    processing: boolean;
    branches: Branch[];
    potentialFamilyHeads?: CustomerSummary[];
    initialFamilyHead?: CustomerSummary | null;
    onCancel?: () => void;
    submitLabel?: string;
}

export default function CustomerForm({
    data,
    setData,
    errors,
    processing,
    branches,
    potentialFamilyHeads = [],
    initialFamilyHead = null,
    onCancel,
    submitLabel,
}: Props) {
    const { t } = useTranslation();
    const [selectedHead, setSelectedHead] =
        React.useState<CustomerSummary | null>(initialFamilyHead);

    const handleSelectHead = (customer: CustomerSummary) => {
        setData("family_head_id", customer.id);
        setSelectedHead(customer);
    };

    const handleRemoveHead = () => {
        setData("family_head_id", null);
        setSelectedHead(null);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <Input
                    id="first_name"
                    label={t("customers.fields.first_name")}
                    error={errors.first_name}
                    type="text"
                    className="mt-1 block w-full"
                    value={data.first_name}
                    onChange={(e) => setData("first_name", e.target.value)}
                    required
                />

                {/* Last Name */}
                <Input
                    id="last_name"
                    label={t("customers.fields.last_name")}
                    error={errors.last_name}
                    type="text"
                    className="mt-1 block w-full"
                    value={data.last_name}
                    onChange={(e) => setData("last_name", e.target.value)}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <Input
                    id="phone"
                    label={t("customers.fields.phone")}
                    error={errors.phone}
                    type="tel"
                    className="mt-1 block w-full"
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                    required
                />

                {/* Email */}
                <Input
                    id="email"
                    label={t("customers.fields.email")}
                    error={errors.email}
                    type="email"
                    className="mt-1 block w-full"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                />
            </div>

            {/* Address */}
            <TextArea
                id="address"
                label={t("customers.fields.address")}
                error={errors.address}
                value={data.address}
                onChange={(e) => setData("address", e.target.value)}
                rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date of Birth */}
                <Input
                    id="date_of_birth"
                    label={t("customers.fields.date_of_birth")}
                    error={errors.date_of_birth}
                    type="date"
                    className="mt-1 block w-full"
                    value={data.date_of_birth}
                    onChange={(e) => setData("date_of_birth", e.target.value)}
                />

                {/* Branch */}
                <Select
                    id="branch_id"
                    label={t("customers.fields.branch")}
                    error={errors.branch_id}
                    value={data.branch_id}
                    onChange={(e) => setData("branch_id", e.target.value)}
                    required
                    options={[
                        { value: "", label: t("common.select_branch") },
                        ...branches.map((branch) => ({
                            value: branch.id,
                            label: branch.name,
                        })),
                    ]}
                />

                {/* Gender */}
                <Select
                    id="gender"
                    label={t("customers.fields.gender")}
                    error={errors.gender}
                    value={data.gender}
                    onChange={(e) => setData("gender", e.target.value)}
                    options={[
                        { value: "", label: t("common.select") },
                        {
                            value: "male",
                            label: t("customers.genders.male"),
                        },
                        {
                            value: "female",
                            label: t("customers.genders.female"),
                        },
                        {
                            value: "other",
                            label: t("customers.genders.other"),
                        },
                    ]}
                />
            </div>

            {/* Family Head Selection */}
            <div className="space-y-4 border-t border-border-default pt-6">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-text-secondary">
                        {t("customers.fields.family_head")}
                    </label>
                    <CustomerSearch
                        onSelect={handleSelectHead}
                        placeholder={t("customers.search_family_head")}
                        className="w-full"
                    />
                </div>

                {selectedHead && (
                    <div className="mt-2 text-sm text-text-secondary flex items-center justify-between bg-bg-subtle p-2 rounded">
                        <span>
                            {t("customers.selected_head")}:{" "}
                            {selectedHead.first_name} {selectedHead.last_name}
                        </span>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleRemoveHead}
                            className="!py-1 !px-2 text-xs"
                        >
                            {t("common.remove")}
                        </Button>
                    </div>
                )}
                {errors.family_head_id && (
                    <p className="text-xs text-status-error-text">
                        {errors.family_head_id}
                    </p>
                )}
            </div>

            {/* Notes */}
            <TextArea
                id="notes"
                label={t("customers.fields.notes")}
                error={errors.notes}
                value={data.notes}
                onChange={(e) => setData("notes", e.target.value)}
                rows={3}
            />

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 border-t border-border-default pt-6">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={processing}
                >
                    {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={processing}>
                    {submitLabel || t("common.save")}
                </Button>
            </div>
        </div>
    );
}
