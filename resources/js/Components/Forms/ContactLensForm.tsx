import React from "react";
import { useTranslation } from "react-i18next";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

interface ContactLensFormData {
    brand: string;
    product_line: string;
    type: string;
    replacement_schedule: string;
    power: string | number;
    cylinder: string | number;
    axis: string | number;
    add: string | number;
    base_curve: string | number;
    diameter: string | number;
    box_quantity: string | number;
    boxes_in_stock: string | number;
    cost_price_per_box: string | number;
    selling_price_per_box: string | number;
    expiry_date: string;
    is_active: boolean;
}

interface Props {
    data: ContactLensFormData;
    setData: (key: keyof ContactLensFormData, value: any) => void;
    errors: Partial<Record<keyof ContactLensFormData, string>>;
    processing: boolean;
    onCancel?: () => void;
    submitLabel?: string;
}

export default function ContactLensForm({
    data,
    setData,
    errors,
    processing,
    onCancel,
    submitLabel,
}: Props) {
    const { t } = useTranslation();

    const clTypes = [
        { id: "spherical", name: t("clinical.rx.types.spherical") },
        { id: "toric", name: t("clinical.rx.types.toric") },
        { id: "multifocal", name: t("clinical.rx.types.multifocal") },
        { id: "color", name: t("clinical.rx.types.color") },
    ];

    const schedules = [
        { id: "daily", name: t("clinical.rx.replacement_schedule.daily") },
        { id: "weekly", name: t("clinical.rx.replacement_schedule.weekly") },
        {
            id: "bi_weekly",
            name: t("clinical.rx.replacement_schedule.bi_weekly"),
        },
        { id: "monthly", name: t("clinical.rx.replacement_schedule.monthly") },
        { id: "yearly", name: t("clinical.rx.replacement_schedule.yearly") },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b pb-2">
                        {t("inventory.contact_lenses.sections.product_info")}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="brand"
                                value={t(
                                    "inventory.contact_lenses.fields.brand"
                                )}
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
                                htmlFor="product_line"
                                value={t(
                                    "inventory.contact_lenses.fields.product_line"
                                )}
                            />
                            <TextInput
                                id="product_line"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.product_line}
                                onChange={(e) =>
                                    setData("product_line", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.product_line}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="type"
                                value={t(
                                    "inventory.contact_lenses.fields.type"
                                )}
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
                                {clTypes.map((type) => (
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
                        <div>
                            <InputLabel
                                htmlFor="replacement_schedule"
                                value={t(
                                    "inventory.contact_lenses.fields.replacement_schedule"
                                )}
                            />
                            <select
                                id="replacement_schedule"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                value={data.replacement_schedule}
                                onChange={(e) =>
                                    setData(
                                        "replacement_schedule",
                                        e.target.value
                                    )
                                }
                                required
                            >
                                <option value="">{t("common.select")}</option>
                                {schedules.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.replacement_schedule}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="base_curve"
                                value={t("clinical.rx.bc")}
                            />
                            <TextInput
                                id="base_curve"
                                type="number"
                                step="0.1"
                                className="mt-1 block w-full"
                                value={data.base_curve}
                                onChange={(e) =>
                                    setData("base_curve", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.base_curve}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="diameter"
                                value={t("clinical.rx.dia")}
                            />
                            <TextInput
                                id="diameter"
                                type="number"
                                step="0.1"
                                className="mt-1 block w-full"
                                value={data.diameter}
                                onChange={(e) =>
                                    setData("diameter", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.diameter}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="box_quantity"
                                value={t(
                                    "inventory.contact_lenses.fields.box_quantity"
                                )}
                            />
                            <TextInput
                                id="box_quantity"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.box_quantity}
                                onChange={(e) =>
                                    setData("box_quantity", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.box_quantity}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="boxes_in_stock"
                                value={t(
                                    "inventory.contact_lenses.fields.boxes_in_stock"
                                )}
                            />
                            <TextInput
                                id="boxes_in_stock"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.boxes_in_stock}
                                onChange={(e) =>
                                    setData("boxes_in_stock", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.boxes_in_stock}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="expiry_date"
                            value={t(
                                "inventory.contact_lenses.fields.expiry_date"
                            )}
                        />
                        <TextInput
                            id="expiry_date"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.expiry_date}
                            onChange={(e) =>
                                setData("expiry_date", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.expiry_date}
                            className="mt-2"
                        />
                    </div>
                </div>

                {/* RX Params & Pricing */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b pb-2">
                        {t("inventory.contact_lenses.sections.rx_pricing")}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="power"
                                value={t("clinical.rx.sphere")}
                            />
                            <TextInput
                                id="power"
                                type="number"
                                step="0.25"
                                className="mt-1 block w-full"
                                value={data.power}
                                onChange={(e) =>
                                    setData("power", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.power}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="cylinder"
                                value={t("clinical.rx.cylinder")}
                            />
                            <TextInput
                                id="cylinder"
                                type="number"
                                step="0.25"
                                className="mt-1 block w-full"
                                value={data.cylinder}
                                onChange={(e) =>
                                    setData("cylinder", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.cylinder}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="axis"
                                value={t("clinical.rx.axis")}
                            />
                            <TextInput
                                id="axis"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.axis}
                                onChange={(e) =>
                                    setData("axis", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.axis}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="add"
                                value={t("clinical.rx.add")}
                            />
                            <TextInput
                                id="add"
                                type="number"
                                step="0.25"
                                className="mt-1 block w-full"
                                value={data.add}
                                onChange={(e) => setData("add", e.target.value)}
                            />
                            <InputError message={errors.add} className="mt-2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="cost_price_per_box"
                                value={t(
                                    "inventory.contact_lenses.fields.cost_price_per_box"
                                )}
                            />
                            <TextInput
                                id="cost_price_per_box"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full"
                                value={data.cost_price_per_box}
                                onChange={(e) =>
                                    setData(
                                        "cost_price_per_box",
                                        e.target.value
                                    )
                                }
                            />
                            <InputError
                                message={errors.cost_price_per_box}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="selling_price_per_box"
                                value={t(
                                    "inventory.contact_lenses.fields.selling_price_per_box"
                                )}
                            />
                            <TextInput
                                id="selling_price_per_box"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full"
                                value={data.selling_price_per_box}
                                onChange={(e) =>
                                    setData(
                                        "selling_price_per_box",
                                        e.target.value
                                    )
                                }
                                required
                            />
                            <InputError
                                message={errors.selling_price_per_box}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
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
                                {t("inventory.contact_lenses.fields.is_active")}
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
