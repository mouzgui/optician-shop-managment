import React from "react";
import { useTranslation } from "react-i18next";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextAreaInput from "@/Components/TextAreaInput";

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
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {t("inventory.frames.sections.basic_info")}
                    </h3>

                    <div>
                        <InputLabel
                            htmlFor="sku"
                            value={t("inventory.frames.fields.sku")}
                        />
                        <TextInput
                            id="sku"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.sku}
                            onChange={(e) => setData("sku", e.target.value)}
                            required
                        />
                        <InputError message={errors.sku} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="barcode"
                            value={t("inventory.frames.fields.barcode")}
                        />
                        <TextInput
                            id="barcode"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.barcode}
                            onChange={(e) => setData("barcode", e.target.value)}
                        />
                        <InputError message={errors.barcode} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="brand"
                                value={t("inventory.frames.fields.brand")}
                            />
                            <TextInput
                                id="brand"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.brand}
                                onChange={(e) =>
                                    setData("brand", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.brand}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="model"
                                value={t("inventory.frames.fields.model")}
                            />
                            <TextInput
                                id="model"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.model}
                                onChange={(e) =>
                                    setData("model", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.model}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="color_code"
                                value={t("inventory.frames.fields.color_code")}
                            />
                            <TextInput
                                id="color_code"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.color_code}
                                onChange={(e) =>
                                    setData("color_code", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.color_code}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="color_name"
                                value={t("inventory.frames.fields.color_name")}
                            />
                            <TextInput
                                id="color_name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.color_name}
                                onChange={(e) =>
                                    setData("color_name", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.color_name}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Specifications Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {t("inventory.frames.sections.specs")}
                    </h3>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="size_eye"
                                value={t("inventory.frames.fields.size_eye")}
                            />
                            <TextInput
                                id="size_eye"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.size_eye}
                                onChange={(e) =>
                                    setData("size_eye", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.size_eye}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="size_bridge"
                                value={t("inventory.frames.fields.size_bridge")}
                            />
                            <TextInput
                                id="size_bridge"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.size_bridge}
                                onChange={(e) =>
                                    setData("size_bridge", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.size_bridge}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="size_temple"
                                value={t("inventory.frames.fields.size_temple")}
                            />
                            <TextInput
                                id="size_temple"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.size_temple}
                                onChange={(e) =>
                                    setData("size_temple", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.size_temple}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="category"
                                value={t("inventory.frames.fields.category")}
                            />
                            <select
                                id="category"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                value={data.category}
                                onChange={(e) =>
                                    setData("category", e.target.value)
                                }
                                required
                            >
                                <option value="">{t("common.select")}</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.category}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="gender"
                                value={t("inventory.frames.fields.gender")}
                            />
                            <select
                                id="gender"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                value={data.gender}
                                onChange={(e) =>
                                    setData("gender", e.target.value)
                                }
                            >
                                <option value="">{t("common.select")}</option>
                                {genders.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.gender}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="material"
                            value={t("inventory.frames.fields.material")}
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

                {/* Pricing & Stock Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {t("inventory.frames.sections.pricing_stock")}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="cost_price"
                                value={t("inventory.frames.fields.cost_price")}
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
                                    "inventory.frames.fields.selling_price"
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
                                htmlFor="quantity"
                                value={t("inventory.frames.fields.quantity")}
                            />
                            <TextInput
                                id="quantity"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.quantity}
                                onChange={(e) =>
                                    setData("quantity", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.quantity}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="low_stock_threshold"
                                value={t(
                                    "inventory.frames.fields.low_stock_threshold"
                                )}
                            />
                            <TextInput
                                id="low_stock_threshold"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.low_stock_threshold}
                                onChange={(e) =>
                                    setData(
                                        "low_stock_threshold",
                                        e.target.value
                                    )
                                }
                                required
                            />
                            <InputError
                                message={errors.low_stock_threshold}
                                className="mt-2"
                            />
                        </div>
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
                                className="rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
                            />
                            <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                                {t("inventory.frames.fields.is_active")}
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
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
