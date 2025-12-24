import React from "react";
import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";
import { Select } from "@/Components/UI/Select";
import { useTranslation } from "react-i18next";

interface FrameFormData {
    sku: string;
    barcode: string;
    brand: string;
    model: string;
    color_code: string;
    color_name: string;
    size_eye: string | number;
    size_bridge: string | number;
    size_temple: string | number;
    category: string;
    material: string;
    gender: string;
    cost_price: string | number;
    selling_price: string | number;
    quantity: string | number;
    low_stock_threshold: string | number;
    is_active: boolean;
}

interface Props {
    data: FrameFormData;
    setData: (key: keyof FrameFormData, value: any) => void;
    errors: Partial<Record<keyof FrameFormData, string>>;
    processing: boolean;
    onCancel?: () => void;
    submitLabel?: string;
}

export default function FrameForm({
    data,
    setData,
    errors,
    processing,
    onCancel,
    submitLabel,
}: Props) {
    const { t } = useTranslation();

    const categories = [
        { id: "optical", name: t("inventory.frames.categories.optical") },
        { id: "sunglasses", name: t("inventory.frames.categories.sunglasses") },
        { id: "sports", name: t("inventory.frames.categories.sports") },
        { id: "kids", name: t("inventory.frames.categories.kids") },
    ];

    const genders = [
        { id: "male", name: t("common.gender.male") },
        { id: "female", name: t("common.gender.female") },
        { id: "unisex", name: t("common.gender.unisex") },
        { id: "kids", name: t("common.gender.kids") },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-text-primary">
                        {t("inventory.frames.sections.basic_info")}
                    </h3>

                    <Input
                        id="sku"
                        label={t("inventory.frames.fields.sku")}
                        error={errors.sku}
                        type="text"
                        className="mt-1 block w-full"
                        value={data.sku}
                        onChange={(e) => setData("sku", e.target.value)}
                        required
                    />

                    <Input
                        id="barcode"
                        label={t("inventory.frames.fields.barcode")}
                        error={errors.barcode}
                        type="text"
                        className="mt-1 block w-full"
                        value={data.barcode}
                        onChange={(e) => setData("barcode", e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="brand"
                            label={t("inventory.frames.fields.brand")}
                            error={errors.brand}
                            type="text"
                            className="mt-1 block w-full"
                            value={data.brand}
                            onChange={(e) => setData("brand", e.target.value)}
                            required
                        />
                        <Input
                            id="model"
                            label={t("inventory.frames.fields.model")}
                            error={errors.model}
                            type="text"
                            className="mt-1 block w-full"
                            value={data.model}
                            onChange={(e) => setData("model", e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="color_code"
                            label={t("inventory.frames.fields.color_code")}
                            error={errors.color_code}
                            type="text"
                            className="mt-1 block w-full"
                            value={data.color_code}
                            onChange={(e) =>
                                setData("color_code", e.target.value)
                            }
                        />
                        <Input
                            id="color_name"
                            label={t("inventory.frames.fields.color_name")}
                            error={errors.color_name}
                            type="text"
                            className="mt-1 block w-full"
                            value={data.color_name}
                            onChange={(e) =>
                                setData("color_name", e.target.value)
                            }
                        />
                    </div>
                </div>

                {/* Specifications Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-text-primary">
                        {t("inventory.frames.sections.specs")}
                    </h3>

                    <div className="grid grid-cols-3 gap-4">
                        <Input
                            id="size_eye"
                            label={t("inventory.frames.fields.size_eye")}
                            error={errors.size_eye}
                            type="number"
                            className="mt-1 block w-full"
                            value={data.size_eye}
                            onChange={(e) =>
                                setData("size_eye", e.target.value)
                            }
                        />
                        <Input
                            id="size_bridge"
                            label={t("inventory.frames.fields.size_bridge")}
                            error={errors.size_bridge}
                            type="number"
                            className="mt-1 block w-full"
                            value={data.size_bridge}
                            onChange={(e) =>
                                setData("size_bridge", e.target.value)
                            }
                        />
                        <Input
                            id="size_temple"
                            label={t("inventory.frames.fields.size_temple")}
                            error={errors.size_temple}
                            type="number"
                            className="mt-1 block w-full"
                            value={data.size_temple}
                            onChange={(e) =>
                                setData("size_temple", e.target.value)
                            }
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                            id="category"
                            label={t("inventory.frames.fields.category")}
                            error={errors.category}
                            value={data.category}
                            onChange={(e) =>
                                setData("category", e.target.value)
                            }
                            required
                            options={[
                                { value: "", label: t("common.select") },
                                ...categories.map((cat) => ({
                                    value: cat.id,
                                    label: cat.name,
                                })),
                            ]}
                        />

                        <Input
                            id="material"
                            label={t("inventory.frames.fields.material")}
                            error={errors.material}
                            type="text"
                            className="mt-1 block w-full"
                            value={data.material}
                            onChange={(e) =>
                                setData("material", e.target.value)
                            }
                        />

                        <Select
                            id="gender"
                            label={t("inventory.frames.fields.gender")}
                            error={errors.gender}
                            value={data.gender}
                            onChange={(e) => setData("gender", e.target.value)}
                            options={[
                                { value: "", label: t("common.select") },
                                ...genders.map((g) => ({
                                    value: g.id,
                                    label: g.name,
                                })),
                            ]}
                        />
                    </div>
                </div>

                {/* Pricing & Stock Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-text-primary">
                        {t("inventory.frames.sections.pricing_stock")}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="cost_price"
                            label={t("inventory.frames.fields.cost_price")}
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
                            label={t("inventory.frames.fields.selling_price")}
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
                            id="quantity"
                            label={t("inventory.frames.fields.quantity")}
                            error={errors.quantity}
                            type="number"
                            className="mt-1 block w-full"
                            value={data.quantity}
                            onChange={(e) =>
                                setData("quantity", e.target.value)
                            }
                            required
                        />
                        <Input
                            id="low_stock_threshold"
                            label={t(
                                "inventory.frames.fields.low_stock_threshold"
                            )}
                            error={errors.low_stock_threshold}
                            type="number"
                            className="mt-1 block w-full"
                            value={data.low_stock_threshold}
                            onChange={(e) =>
                                setData("low_stock_threshold", e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="flex items-center mt-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={data.is_active}
                                onChange={(e) =>
                                    setData("is_active", e.target.checked)
                                }
                                className="rounded bg-bg-base border-border-default text-interactive-primary shadow-sm focus:ring-interactive-primary focus:ring-offset-bg-base"
                            />
                            <span className="ms-2 text-sm text-text-secondary">
                                {t("inventory.frames.fields.is_active")}
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-border-default">
                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={processing}
                    >
                        {t("common.cancel")}
                    </Button>
                )}
                <Button variant="primary" disabled={processing} type="submit">
                    {submitLabel || t("common.save")}
                </Button>
            </div>
        </div>
    );
}
