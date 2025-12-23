import React from "react";
import { useTranslation } from "react-i18next";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

interface LensFormData {
    name: string;
    brand: string;
    type: string;
    index: string;
    coatings: string[];
    material: string;
    cost_price: string | number;
    selling_price: string | number;
    lab_supplier: string;
    lead_time_days: string | number;
    is_active: boolean;
}

interface Props {
    data: LensFormData;
    setData: (key: keyof LensFormData, value: any) => void;
    errors: Partial<Record<keyof LensFormData, string>>;
    processing: boolean;
    onCancel?: () => void;
    submitLabel?: string;
}

export default function LensForm({
    data,
    setData,
    errors,
    processing,
    onCancel,
    submitLabel,
}: Props) {
    const { t } = useTranslation();

    const lensTypes = [
        {
            id: "single_vision",
            name: t("inventory.lenses.types.single_vision"),
        },
        { id: "bifocal", name: t("inventory.lenses.types.bifocal") },
        { id: "progressive", name: t("inventory.lenses.types.progressive") },
        { id: "office", name: t("inventory.lenses.types.office") },
        { id: "sports", name: t("inventory.lenses.types.sports") },
    ];

    const lensIndices = ["1.50", "1.56", "1.60", "1.67", "1.74"];

    const availableCoatings = [
        "HC",
        "HMC",
        "Blue Cut",
        "Photochromic",
        "Anti-Reflective",
        "Super Hydrophobic",
    ];

    const toggleCoating = (coating: string) => {
        const currentCoatings = data.coatings || [];
        if (currentCoatings.includes(coating)) {
            setData(
                "coatings",
                currentCoatings.filter((c: string) => c !== coating)
            );
        } else {
            setData("coatings", [...currentCoatings, coating]);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {t("inventory.lenses.sections.basic_info")}
                    </h3>

                    <div>
                        <InputLabel
                            htmlFor="name"
                            value={t("inventory.lenses.fields.name")}
                        />
                        <TextInput
                            id="name"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="brand"
                                value={t("inventory.lenses.fields.brand")}
                            />
                            <TextInput
                                id="brand"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.brand}
                                onChange={(e) =>
                                    setData("brand", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.brand}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="type"
                                value={t("inventory.lenses.fields.type")}
                            />
                            <select
                                id="type"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                required
                            >
                                <option value="">{t("common.select")}</option>
                                {lensTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.type}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="index"
                                value={t("inventory.lenses.fields.index")}
                            />
                            <select
                                id="index"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                value={data.index}
                                onChange={(e) =>
                                    setData("index", e.target.value)
                                }
                                required
                            >
                                <option value="">{t("common.select")}</option>
                                {lensIndices.map((idx) => (
                                    <option key={idx} value={idx}>
                                        {idx}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.index}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="material"
                                value={t("inventory.lenses.fields.material")}
                            />
                            <TextInput
                                id="material"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.material}
                                onChange={(e) =>
                                    setData("material", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.material}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Coatings & Pricing */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {t("inventory.lenses.sections.specs_pricing")}
                    </h3>

                    <div>
                        <InputLabel
                            value={t("inventory.lenses.fields.coatings")}
                        />
                        <div className="mt-2 grid grid-cols-2 gap-2">
                            {availableCoatings.map((coating) => (
                                <label
                                    key={coating}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        checked={(data.coatings || []).includes(
                                            coating
                                        )}
                                        onChange={() => toggleCoating(coating)}
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {coating}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <InputError
                            message={errors.coatings}
                            className="mt-2"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="cost_price"
                                value={t("inventory.lenses.fields.cost_price")}
                            />
                            <TextInput
                                id="cost_price"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full"
                                value={data.cost_price}
                                onChange={(e) =>
                                    setData("cost_price", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.cost_price}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="selling_price"
                                value={t(
                                    "inventory.lenses.fields.selling_price"
                                )}
                            />
                            <TextInput
                                id="selling_price"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full"
                                value={data.selling_price}
                                onChange={(e) =>
                                    setData("selling_price", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.selling_price}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="lab_supplier"
                                value={t(
                                    "inventory.lenses.fields.lab_supplier"
                                )}
                            />
                            <TextInput
                                id="lab_supplier"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.lab_supplier}
                                onChange={(e) =>
                                    setData("lab_supplier", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.lab_supplier}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="lead_time_days"
                                value={t(
                                    "inventory.lenses.fields.lead_time_days"
                                )}
                            />
                            <TextInput
                                id="lead_time_days"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.lead_time_days}
                                onChange={(e) =>
                                    setData("lead_time_days", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.lead_time_days}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {onCancel && (
                    <SecondaryButton
                        type="button"
                        onClick={onCancel}
                        disabled={processing}
                    >
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
