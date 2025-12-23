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

export default function ContactLensRxForm({ data, setData, errors }: Props) {
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
        setData("os_base_curve", data.od_base_curve);
        setData("os_diameter", data.od_diameter);
        setData("os_brand", data.od_brand);
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
                        <div>
                            <InputLabel
                                htmlFor="od_brand"
                                value={t("clinical.rx.brand")}
                            />
                            <TextInput
                                id="od_brand"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.od_brand}
                                onChange={(e) =>
                                    setData("od_brand", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.od_brand}
                                className="mt-2"
                            />
                        </div>
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
                        <div>
                            <InputLabel
                                htmlFor="os_brand"
                                value={t("clinical.rx.brand")}
                            />
                            <TextInput
                                id="os_brand"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.os_brand}
                                onChange={(e) =>
                                    setData("os_brand", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.os_brand}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-4">
                <h3 className="font-bold text-lg border-b pb-2 dark:border-gray-700">
                    {t("clinical.rx.additional_details")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel
                            htmlFor="replacement_schedule"
                            value={t("clinical.rx.replacement_schedule")}
                        />
                        <select
                            id="replacement_schedule"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                            value={data.replacement_schedule}
                            onChange={(e) =>
                                setData("replacement_schedule", e.target.value)
                            }
                        >
                            <option value="">{t("common.select")}</option>
                            <option value="daily">
                                {t("clinical.rx.daily")}
                            </option>
                            <option value="weekly">
                                {t("clinical.rx.weekly")}
                            </option>
                            <option value="bi_weekly">
                                {t("clinical.rx.bi_weekly")}
                            </option>
                            <option value="monthly">
                                {t("clinical.rx.monthly")}
                            </option>
                            <option value="yearly">
                                {t("clinical.rx.yearly")}
                            </option>
                        </select>
                        <InputError
                            message={errors.replacement_schedule}
                            className="mt-2"
                        />
                    </div>
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
