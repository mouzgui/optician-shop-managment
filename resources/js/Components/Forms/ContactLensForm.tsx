import React from "react";
import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";
import { Select } from "@/Components/UI/Select";
import { useTranslation } from "react-i18next";

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
                    <h3 className="text-lg font-medium text-text-primary border-b border-border-default pb-2">
                        {t("inventory.contact_lenses.sections.product_info")}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="brand"
                            label={t("inventory.contact_lenses.fields.brand")}
                            error={errors.brand}
                            type="text"
                            className="mt-1 block w-full"
                            value={data.brand}
                            onChange={(e) => setData("brand", e.target.value)}
                            required
                        />
                        <Input
                            id="product_line"
                            label={t(
                                "inventory.contact_lenses.fields.product_line"
                            )}
                            error={errors.product_line}
                            type="text"
                            className="mt-1 block w-full"
                            value={data.product_line}
                            onChange={(e) =>
                                setData("product_line", e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            id="type"
                            label={t("inventory.contact_lenses.fields.type")}
                            error={errors.type}
                            value={data.type}
                            onChange={(e) => setData("type", e.target.value)}
                            required
                            options={[
                                { value: "", label: t("common.select") },
                                ...clTypes.map((type) => ({
                                    value: type.id,
                                    label: type.name,
                                })),
                            ]}
                        />
                        <Select
                            id="replacement_schedule"
                            label={t(
                                "inventory.contact_lenses.fields.replacement_schedule"
                            )}
                            error={errors.replacement_schedule}
                            value={data.replacement_schedule}
                            onChange={(e) =>
                                setData("replacement_schedule", e.target.value)
                            }
                            required
                            options={[
                                { value: "", label: t("common.select") },
                                ...schedules.map((s) => ({
                                    value: s.id,
                                    label: s.name,
                                })),
                            ]}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="base_curve"
                            label={t("clinical.rx.bc")}
                            error={errors.base_curve}
                            type="number"
                            step="0.1"
                            className="mt-1 block w-full"
                            value={data.base_curve}
                            onChange={(e) =>
                                setData("base_curve", e.target.value)
                            }
                        />
                        <Input
                            id="diameter"
                            label={t("clinical.rx.dia")}
                            error={errors.diameter}
                            type="number"
                            step="0.1"
                            className="mt-1 block w-full"
                            value={data.diameter}
                            onChange={(e) =>
                                setData("diameter", e.target.value)
                            }
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="box_quantity"
                            label={t(
                                "inventory.contact_lenses.fields.box_quantity"
                            )}
                            error={errors.box_quantity}
                            type="number"
                            className="mt-1 block w-full"
                            value={data.box_quantity}
                            onChange={(e) =>
                                setData("box_quantity", e.target.value)
                            }
                            required
                        />
                        <Input
                            id="boxes_in_stock"
                            label={t(
                                "inventory.contact_lenses.fields.boxes_in_stock"
                            )}
                            error={errors.boxes_in_stock}
                            type="number"
                            className="mt-1 block w-full"
                            value={data.boxes_in_stock}
                            onChange={(e) =>
                                setData("boxes_in_stock", e.target.value)
                            }
                            required
                        />
                    </div>

                    <Input
                        id="expiry_date"
                        label={t("inventory.contact_lenses.fields.expiry_date")}
                        error={errors.expiry_date}
                        type="date"
                        className="mt-1 block w-full"
                        value={data.expiry_date}
                        onChange={(e) => setData("expiry_date", e.target.value)}
                    />
                </div>

                {/* RX Params & Pricing */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-text-primary border-b border-border-default pb-2">
                        {t("inventory.contact_lenses.sections.rx_pricing")}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="power"
                            label={t("clinical.rx.sphere")}
                            error={errors.power}
                            type="number"
                            step="0.25"
                            className="mt-1 block w-full"
                            value={data.power}
                            onChange={(e) => setData("power", e.target.value)}
                        />
                        <Input
                            id="cylinder"
                            label={t("clinical.rx.cylinder")}
                            error={errors.cylinder}
                            type="number"
                            step="0.25"
                            className="mt-1 block w-full"
                            value={data.cylinder}
                            onChange={(e) =>
                                setData("cylinder", e.target.value)
                            }
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="axis"
                            label={t("clinical.rx.axis")}
                            error={errors.axis}
                            type="number"
                            className="mt-1 block w-full"
                            value={data.axis}
                            onChange={(e) => setData("axis", e.target.value)}
                        />
                        <Input
                            id="add"
                            label={t("clinical.rx.add")}
                            error={errors.add}
                            type="number"
                            step="0.25"
                            className="mt-1 block w-full"
                            value={data.add}
                            onChange={(e) => setData("add", e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="cost_price_per_box"
                            label={t(
                                "inventory.contact_lenses.fields.cost_price_per_box"
                            )}
                            error={errors.cost_price_per_box}
                            type="number"
                            step="0.01"
                            className="mt-1 block w-full"
                            value={data.cost_price_per_box}
                            onChange={(e) =>
                                setData("cost_price_per_box", e.target.value)
                            }
                        />
                        <Input
                            id="selling_price_per_box"
                            label={t(
                                "inventory.contact_lenses.fields.selling_price_per_box"
                            )}
                            error={errors.selling_price_per_box}
                            type="number"
                            step="0.01"
                            className="mt-1 block w-full"
                            value={data.selling_price_per_box}
                            onChange={(e) =>
                                setData("selling_price_per_box", e.target.value)
                            }
                            required
                        />
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
                                className="rounded bg-bg-base border-border-default text-interactive-primary shadow-sm focus:ring-interactive-primary focus:ring-offset-bg-base"
                            />
                            <span className="ms-2 text-sm text-text-secondary">
                                {t("inventory.contact_lenses.fields.is_active")}
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border-default">
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
