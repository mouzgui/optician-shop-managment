import React from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
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
                <div>
                    <InputLabel
                        htmlFor="first_name"
                        value={t("customers.fields.first_name")}
                    />
                    <TextInput
                        id="first_name"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.first_name}
                        onChange={(e) => setData("first_name", e.target.value)}
                        required
                    />
                    <InputError message={errors.first_name} className="mt-2" />
                </div>

                {/* Last Name */}
                <div>
                    <InputLabel
                        htmlFor="last_name"
                        value={t("customers.fields.last_name")}
                    />
                    <TextInput
                        id="last_name"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.last_name}
                        onChange={(e) => setData("last_name", e.target.value)}
                        required
                    />
                    <InputError message={errors.last_name} className="mt-2" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div>
                    <InputLabel
                        htmlFor="phone"
                        value={t("customers.fields.phone")}
                    />
                    <TextInput
                        id="phone"
                        type="tel"
                        className="mt-1 block w-full"
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                        required
                    />
                    <InputError message={errors.phone} className="mt-2" />
                </div>

                {/* Email */}
                <div>
                    <InputLabel
                        htmlFor="email"
                        value={t("customers.fields.email")}
                    />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
            </div>

            {/* Address */}
            <div>
                <InputLabel
                    htmlFor="address"
                    value={t("customers.fields.address")}
                />
                <textarea
                    id="address"
                    className="mt-1 block w-full border-border-default bg-bg-base text-text-primary placeholder-text-muted focus:border-border-focus focus:ring-1 focus:ring-border-focus rounded-md shadow-sm transition-colors"
                    value={data.address}
                    onChange={(e) => setData("address", e.target.value)}
                    rows={3}
                />
                <InputError message={errors.address} className="mt-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date of Birth */}
                <div>
                    <InputLabel
                        htmlFor="date_of_birth"
                        value={t("customers.fields.date_of_birth")}
                    />
                    <TextInput
                        id="date_of_birth"
                        type="date"
                        className="mt-1 block w-full"
                        value={data.date_of_birth}
                        onChange={(e) =>
                            setData("date_of_birth", e.target.value)
                        }
                    />
                    <InputError
                        message={errors.date_of_birth}
                        className="mt-2"
                    />
                </div>

                {/* Branch */}
                <div>
                    <InputLabel
                        htmlFor="branch_id"
                        value={t("customers.fields.branch")}
                    />
                    <select
                        id="branch_id"
                        className="mt-1 block w-full border-border-default bg-bg-base text-text-primary focus:border-border-focus focus:ring-1 focus:ring-border-focus rounded-md shadow-sm transition-colors"
                        value={data.branch_id}
                        onChange={(e) => setData("branch_id", e.target.value)}
                    >
                        <option value="">{t("customers.select_branch")}</option>
                        {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                                {branch.name}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.branch_id} className="mt-2" />
                </div>
            </div>

            {/* Family Head */}
            <div>
                <InputLabel
                    htmlFor="family_head_id"
                    value={t("customers.fields.family_head")}
                />
                <div className="mt-1">
                    <CustomerSearch
                        onSelect={handleSelectHead}
                        placeholder={t("customers.search_family_head")}
                        className="w-full"
                    />
                </div>
                <InputError message={errors.family_head_id} className="mt-2" />
                {data.family_head_id && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-2 rounded">
                        <span>
                            {t("customers.selected_head")}:{" "}
                            {selectedHead
                                ? `${selectedHead.first_name} ${selectedHead.last_name}`
                                : potentialFamilyHeads.find(
                                      (h) => h.id === data.family_head_id
                                  )
                                ? `${
                                      potentialFamilyHeads.find(
                                          (h) => h.id === data.family_head_id
                                      )?.first_name
                                  } ${
                                      potentialFamilyHeads.find(
                                          (h) => h.id === data.family_head_id
                                      )?.last_name
                                  }`
                                : t("common.loading")}
                        </span>
                        <button
                            type="button"
                            onClick={handleRemoveHead}
                            className="text-red-600 hover:text-red-800 text-xs font-medium"
                        >
                            {t("common.remove")}
                        </button>
                    </div>
                )}
            </div>

            {/* Notes */}
            <div>
                <InputLabel
                    htmlFor="notes"
                    value={t("customers.fields.notes")}
                />
                <textarea
                    id="notes"
                    className="mt-1 block w-full border-border-default bg-bg-base text-text-primary placeholder-text-muted focus:border-border-focus focus:ring-1 focus:ring-border-focus rounded-md shadow-sm transition-colors"
                    value={data.notes}
                    onChange={(e) => setData("notes", e.target.value)}
                    rows={3}
                />
                <InputError message={errors.notes} className="mt-2" />
            </div>

            <div className="flex items-center justify-end gap-4">
                {onCancel && (
                    <SecondaryButton onClick={onCancel} disabled={processing}>
                        {t("common.cancel")}
                    </SecondaryButton>
                )}
                <PrimaryButton disabled={processing}>
                    {submitLabel || t("common.save")}
                </PrimaryButton>
            </div>
        </div>
    );
}
