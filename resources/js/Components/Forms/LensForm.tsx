import React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/Components/UI/Input";
import { Select } from "@/Components/UI/Select";
import { Button } from "@/Components/UI/Button";

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
                    <h3 className="text-lg font-medium text-text-primary">
                        {t("inventory.lenses.sections.basic_info")}
                    </h3>

                    <Input
                        id="name"
                        label={t("inventory.lenses.fields.name")}
                        error={errors.name}
                        type="text"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="brand"
                            label={t("inventory.lenses.fields.brand")}
                            error={errors.brand}
                            type="text"
                            className="mt-1 block w-full"
                            value={data.brand}
                            onChange={(e) => setData("brand", e.target.value)}
                        />
                        <Select
                            id="type"
                            label={t("inventory.lenses.fields.type")}
                            error={errors.type}
                            value={data.type}
                            onChange={(e) => setData("type", e.target.value)}
                            required
                            options={[
                                { value: "", label: t("common.select") },
                                ...lensTypes.map((type) => ({
                                    value: type.id,
                                    label: type.name,
                                })),
                            ]}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            id="index"
                            label={t("inventory.lenses.fields.index")}
                            error={errors.index}
                            value={data.index}
                            onChange={(e) => setData("index", e.target.value)}
                            required
                            options={[
                                { value: "", label: t("common.select") },
                                ...lensIndices.map((idx) => ({
                                    value: idx,
                                    label: idx,
                                })),
                            ]}
                        />
                        <Input
                            id="material"
                            label={t("inventory.lenses.fields.material")}
                            error={errors.material}
                            type="text"
                            className="mt-1 block w-full"
                            value={data.material}
                            onChange={(e) =>
                                setData("material", e.target.value)
                            }
                        />
                    </div>
                </div>

                {/* Coatings & Pricing */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-text-primary">
                        {t("inventory.lenses.sections.specs_pricing")}
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary">
                            {t("inventory.lenses.fields.coatings")}
                        </label>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                            {availableCoatings.map((coating) => (
                                <label
                                    key={coating}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="checkbox"
                                        className="rounded bg-bg-base border-border-default text-interactive-primary shadow-sm focus:ring-interactive-primary focus:ring-offset-bg-base"
                                        checked={(data.coatings || []).includes(
                                            coating
                                        )}
                                        onChange={() => toggleCoating(coating)}
                                    />
                                    <span className="text-sm text-text-secondary">
                                        {coating}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {errors.coatings && (
                            <p className="text-xs text-status-error-text mt-2">
                                {errors.coatings}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="cost_price"
                            label={t("inventory.lenses.fields.cost_price")}
                            error={errors.cost_price}
                            type="number"
                            step="0.01"
                            className="mt-1 block w-full"
                            value={data.cost_price}
                            onChange={(e) =>
                                setData("cost_price", e.target.value)
                            }
                        />
                        <Input
                            id="selling_price"
                            label={t("inventory.lenses.fields.selling_price")}
                            error={errors.selling_price}
                            type="number"
                            step="0.01"
                            className="mt-1 block w-full"
                            value={data.selling_price}
                            onChange={(e) =>
                                setData("selling_price", e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="lab_supplier"
                            label={t("inventory.lenses.fields.lab_supplier")}
                            error={errors.lab_supplier}
                            type="text"
                            className="mt-1 block w-full"
                            value={data.lab_supplier}
                            onChange={(e) =>
                                setData("lab_supplier", e.target.value)
                            }
                        />
                        <Input
                            id="lead_time_days"
                            label={t("inventory.lenses.fields.lead_time_days")}
                            error={errors.lead_time_days}
                            type="number"
                            className="mt-1 block w-full"
                            value={data.lead_time_days}
                            onChange={(e) =>
                                setData("lead_time_days", e.target.value)
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-border-default">
                {onCancel && (
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={onCancel}
                        disabled={processing}
                    >
                        {t("common.cancel")}
                    </Button>
                )}
                <Button type="submit" disabled={processing}>
                    {submitLabel || t("common.save")}
                </Button>
            </div>
        </div>
    );
}
