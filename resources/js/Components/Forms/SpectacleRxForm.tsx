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

export default function SpectacleRxForm({ data, setData, errors }: Props) {
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
        setData("os_add", data.od_add);
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
                            -20,
                            20
                        )}
                        {renderOpticalInput(
                            "od_cylinder",
                            t("clinical.rx.cylinder"),
                            -10,
                            10
                        )}
                        {renderOpticalInput(
                            "od_axis",
                            t("clinical.rx.axis"),
                            0,
                            180,
                            1
                        )}
                        {renderOpticalInput(
                            "od_add",
                            t("clinical.rx.add"),
                            0,
                            4
                        )}
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
                            -20,
                            20
                        )}
                        {renderOpticalInput(
                            "os_cylinder",
                            t("clinical.rx.cylinder"),
                            -10,
                            10
                        )}
                        {renderOpticalInput(
                            "os_axis",
                            t("clinical.rx.axis"),
                            0,
                            180,
                            1
                        )}
                        {renderOpticalInput(
                            "os_add",
                            t("clinical.rx.add"),
                            0,
                            4
                        )}
                    </div>
                </div>
            </div>

            {/* PD & Additional Info */}
            <div className="bg-bg-subtle p-4 rounded-lg space-y-4">
                <h3 className="font-bold text-lg text-text-primary border-b border-border-default pb-2">
                    {t("clinical.rx.additional_details")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Select
                        id="pd_type"
                        label={t("clinical.rx.pd_type")}
                        error={errors.pd_type}
                        value={data.pd_type}
                        onChange={(e) => setData("pd_type", e.target.value)}
                        options={[
                            {
                                value: "single",
                                label: t("clinical.rx.pd_single"),
                            },
                            { value: "dual", label: t("clinical.rx.pd_dual") },
                        ]}
                    />
                    {renderOpticalInput(
                        "pd_far",
                        t("clinical.rx.pd_far"),
                        40,
                        80,
                        0.5
                    )}
                    {renderOpticalInput(
                        "pd_near",
                        t("clinical.rx.pd_near"),
                        40,
                        80,
                        0.5
                    )}
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
