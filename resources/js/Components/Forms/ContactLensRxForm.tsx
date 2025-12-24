import React from "react";
import { Input } from "@/Components/UI/Input";
import { Button } from "@/Components/UI/Button";
import { Select } from "@/Components/UI/Select";
import { TextArea } from "@/Components/UI/TextArea";
import { useTranslation } from "react-i18next";

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
}

export default function ContactLensRxForm({ data, setData, errors }: Props) {
    const { t } = useTranslation();

    const renderOpticalInput = (
        id: string,
        label: string,
        min: number,
        max: number,
        step: number = 0.25
    ) => (
        <Input
            id={id}
            label={label}
            error={errors[id]}
            type="number"
            step={step}
            min={min}
            max={max}
            className="mt-1 block w-full"
            value={data[id]}
            onChange={(e) => setData(id, e.target.value)}
        />
    );

    const copyODtoOS = () => {
        setData("os_sphere", data.od_sphere);
        setData("os_cylinder", data.od_cylinder);
        setData("os_axis", data.od_axis);
        setData("os_base_curve", data.od_base_curve);
        setData("os_diameter", data.od_diameter);
        setData("os_brand", data.od_brand);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={copyODtoOS}
                >
                    {t("clinical.rx.copy_od_to_os")}
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Right Eye (OD) */}
                <div className="bg-bg-subtle p-4 rounded-lg space-y-4">
                    <h3 className="font-bold text-lg text-text-primary border-b border-border-default pb-2">
                        {t("clinical.rx.od")}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {renderOpticalInput(
                            "od_sphere",
                            t("clinical.rx.sphere"),
                            -30,
                            30
                        )}
                        {renderOpticalInput(
                            "od_cylinder",
                            t("clinical.rx.cylinder"),
                            -15,
                            15
                        )}
                        {renderOpticalInput(
                            "od_axis",
                            t("clinical.rx.axis"),
                            0,
                            180,
                            1
                        )}
                        {renderOpticalInput(
                            "od_base_curve",
                            t("clinical.rx.bc"),
                            7.0,
                            10.0,
                            0.1
                        )}
                        {renderOpticalInput(
                            "od_diameter",
                            t("clinical.rx.dia"),
                            10.0,
                            16.0,
                            0.1
                        )}
                        <Input
                            id="od_brand"
                            label={t("clinical.rx.brand")}
                            error={errors.od_brand}
                            type="text"
                            className="mt-1 block w-full"
                            value={data.od_brand}
                            onChange={(e) =>
                                setData("od_brand", e.target.value)
                            }
                        />
                    </div>
                </div>

                {/* Left Eye (OS) */}
                <div className="bg-bg-subtle p-4 rounded-lg space-y-4">
                    <h3 className="font-bold text-lg text-text-primary border-b border-border-default pb-2">
                        {t("clinical.rx.os")}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {renderOpticalInput(
                            "os_sphere",
                            t("clinical.rx.sphere"),
                            -30,
                            30
                        )}
                        {renderOpticalInput(
                            "os_cylinder",
                            t("clinical.rx.cylinder"),
                            -15,
                            15
                        )}
                        {renderOpticalInput(
                            "os_axis",
                            t("clinical.rx.axis"),
                            0,
                            180,
                            1
                        )}
                        {renderOpticalInput(
                            "os_base_curve",
                            t("clinical.rx.bc"),
                            7.0,
                            10.0,
                            0.1
                        )}
                        {renderOpticalInput(
                            "os_diameter",
                            t("clinical.rx.dia"),
                            10.0,
                            16.0,
                            0.1
                        )}
                        <Input
                            id="os_brand"
                            label={t("clinical.rx.brand")}
                            error={errors.os_brand}
                            type="text"
                            className="mt-1 block w-full"
                            value={data.os_brand}
                            onChange={(e) =>
                                setData("os_brand", e.target.value)
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="bg-bg-subtle p-4 rounded-lg space-y-4">
                <h3 className="font-bold text-lg text-text-primary border-b border-border-default pb-2">
                    {t("clinical.rx.additional_details")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                        id="replacement_schedule"
                        label={t("clinical.rx.replacement_schedule")}
                        error={errors.replacement_schedule}
                        value={data.replacement_schedule}
                        onChange={(e) =>
                            setData("replacement_schedule", e.target.value)
                        }
                        options={[
                            { value: "", label: t("common.select") },
                            { value: "daily", label: t("clinical.rx.daily") },
                            { value: "weekly", label: t("clinical.rx.weekly") },
                            {
                                value: "bi_weekly",
                                label: t("clinical.rx.bi_weekly"),
                            },
                            {
                                value: "monthly",
                                label: t("clinical.rx.monthly"),
                            },
                            { value: "yearly", label: t("clinical.rx.yearly") },
                        ]}
                    />
                </div>
                <TextArea
                    id="notes"
                    label={t("customers.fields.notes")}
                    error={errors.notes}
                    value={data.notes}
                    onChange={(e) => setData("notes", e.target.value)}
                    rows={3}
                />
            </div>
        </div>
    );
}
