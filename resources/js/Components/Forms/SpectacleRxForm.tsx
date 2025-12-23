import React from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
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
        <div>
            <InputLabel htmlFor={id} value={label} />
            <TextInput
                id={id}
                type="number"
                step={step}
                min={min}
                max={max}
                className="mt-1 block w-full"
                value={data[id]}
                onChange={(e) => setData(id, e.target.value)}
            />
            <InputError message={errors[id]} className="mt-2" />
        </div>
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
                <button
                    type="button"
                    onClick={copyODtoOS}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    {t("clinical.rx.copy_od_to_os")}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Right Eye (OD) */}
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2 dark:border-gray-700">
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
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2 dark:border-gray-700">
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
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-4">
                <h3 className="font-bold text-lg border-b pb-2 dark:border-gray-700">
                    {t("clinical.rx.additional_details")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <InputLabel
                            htmlFor="pd_type"
                            value={t("clinical.rx.pd_type")}
                        />
                        <select
                            id="pd_type"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                            value={data.pd_type}
                            onChange={(e) => setData("pd_type", e.target.value)}
                        >
                            <option value="single">
                                {t("clinical.rx.pd_single")}
                            </option>
                            <option value="dual">
                                {t("clinical.rx.pd_dual")}
                            </option>
                        </select>
                        <InputError message={errors.pd_type} className="mt-2" />
                    </div>
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
                <div>
                    <InputLabel
                        htmlFor="notes"
                        value={t("customers.fields.notes")}
                    />
                    <textarea
                        id="notes"
                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                        value={data.notes}
                        onChange={(e) => setData("notes", e.target.value)}
                        rows={3}
                    />
                    <InputError message={errors.notes} className="mt-2" />
                </div>
            </div>
        </div>
    );
}
