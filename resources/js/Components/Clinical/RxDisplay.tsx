import React from "react";
import { useTranslation } from "react-i18next";
import {
    PrinterIcon,
    CalendarIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface PrescriptionBase {
    id: number;
    prescribed_at: string;
    expires_at: string;
    notes: string | null;
    prescribed_by?: {
        name: string;
    };
}

interface SpectacleRx extends PrescriptionBase {
    od_sphere: string | number;
    od_cylinder: string | number | null;
    od_axis: number | null;
    od_add: string | number | null;
    os_sphere: string | number;
    os_cylinder: string | number | null;
    os_axis: number | null;
    os_add: string | number | null;
    pd_far: string | number | null;
    pd_near: string | number | null;
    pd_type: "single" | "dual";
}

interface ContactLensRx extends PrescriptionBase {
    od_sphere: string | number;
    od_cylinder: string | number | null;
    od_axis: number | null;
    od_base_curve: string | number | null;
    od_diameter: string | number | null;
    os_sphere: string | number;
    os_cylinder: string | number | null;
    os_axis: number | null;
    os_base_curve: string | number | null;
    os_diameter: string | number | null;
    replacement_schedule: string | null;
}

interface Props {
    rx: SpectacleRx | ContactLensRx;
    type: "spectacle" | "contact_lens";
}

export default function RxDisplay({ rx, type }: Props) {
    const { t } = useTranslation();
    const isExpired = new Date(rx.expires_at) < new Date();
    const isExpiringSoon =
        !isExpired &&
        new Date(rx.expires_at) <
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const formatValue = (val: string | number | null) => {
        if (val === null || val === undefined || val === "") return "-";
        if (typeof val === "number") {
            return val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2);
        }
        const num = parseFloat(val);
        if (isNaN(num)) return val;
        return num > 0 ? `+${num.toFixed(2)}` : num.toFixed(2);
    };

    const formatAxis = (val: number | null) => {
        if (val === null || val === undefined) return "-";
        return `${val}°`;
    };

    const handlePrint = () => {
        const routeName =
            type === "spectacle"
                ? "business.spectacle-rx.download"
                : "business.contact-lens-rx.download";
        const paramName = type === "spectacle" ? "spectacle_rx" : "contact_lens_rx";
        
        window.open(route(routeName, { [paramName]: rx.id }), "_blank");
    };

    return (
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm overflow-hidden print:shadow-none print:border-none">
            {/* Header */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700 flex justify-between items-center print:bg-white">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {new Date(rx.prescribed_at).toLocaleDateString()}
                    </span>
                    {isExpired && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Expired
                        </span>
                    )}
                    {isExpiringSoon && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            <ExclamationTriangleIcon className="w-3 h-3 me-1" />
                            Expiring Soon
                        </span>
                    )}
                </div>
                <button
                    onClick={handlePrint}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 print:hidden"
                    title="Print"
                >
                    <PrinterIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Grid */}
            <div className="p-4">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="text-gray-500 dark:text-gray-400 uppercase text-xs">
                            <th className="pb-2 text-start w-12"></th>
                            <th className="pb-2 text-center">SPH</th>
                            <th className="pb-2 text-center">CYL</th>
                            <th className="pb-2 text-center">AXIS</th>
                            {type === "spectacle" ? (
                                <th className="pb-2 text-center">ADD</th>
                            ) : (
                                <>
                                    <th className="pb-2 text-center">BC</th>
                                    <th className="pb-2 text-center">DIA</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        <tr>
                            <td className="py-3 font-bold text-gray-700 dark:text-gray-300">
                                OD
                            </td>
                            <td className="py-3 text-center font-mono text-lg">
                                {formatValue(rx.od_sphere)}
                            </td>
                            <td className="py-3 text-center font-mono text-lg">
                                {formatValue(rx.od_cylinder)}
                            </td>
                            <td className="py-3 text-center font-mono text-lg">
                                {formatAxis(rx.od_axis)}
                            </td>
                            {type === "spectacle" ? (
                                <td className="py-3 text-center font-mono text-lg">
                                    {formatValue((rx as SpectacleRx).od_add)}
                                </td>
                            ) : (
                                <>
                                    <td className="py-3 text-center font-mono text-lg">
                                        {(rx as ContactLensRx).od_base_curve ||
                                            "-"}
                                    </td>
                                    <td className="py-3 text-center font-mono text-lg">
                                        {(rx as ContactLensRx).od_diameter ||
                                            "-"}
                                    </td>
                                </>
                            )}
                        </tr>
                        <tr>
                            <td className="py-3 font-bold text-gray-700 dark:text-gray-300">
                                OS
                            </td>
                            <td className="py-3 text-center font-mono text-lg">
                                {formatValue(rx.os_sphere)}
                            </td>
                            <td className="py-3 text-center font-mono text-lg">
                                {formatValue(rx.os_cylinder)}
                            </td>
                            <td className="py-3 text-center font-mono text-lg">
                                {formatAxis(rx.os_axis)}
                            </td>
                            {type === "spectacle" ? (
                                <td className="py-3 text-center font-mono text-lg">
                                    {formatValue((rx as SpectacleRx).os_add)}
                                </td>
                            ) : (
                                <>
                                    <td className="py-3 text-center font-mono text-lg">
                                        {(rx as ContactLensRx).os_base_curve ||
                                            "-"}
                                    </td>
                                    <td className="py-3 text-center font-mono text-lg">
                                        {(rx as ContactLensRx).os_diameter ||
                                            "-"}
                                    </td>
                                </>
                            )}
                        </tr>
                    </tbody>
                </table>

                {/* Additional Details */}
                <div className="mt-4 pt-4 border-t dark:border-gray-700 grid grid-cols-2 gap-4 text-xs">
                    {type === "spectacle" && (
                        <div>
                            <span className="text-gray-500 dark:text-gray-400 block uppercase mb-1">
                                PD (
                                {(rx as SpectacleRx).pd_type})
                            </span>
                            <span className="font-medium dark:text-gray-200">
                                Far: {(rx as SpectacleRx).pd_far || "-"} / Near:{" "}
                                {(rx as SpectacleRx).pd_near || "-"}
                            </span>
                        </div>
                    )}
                    {type === "contact_lens" &&
                        (rx as ContactLensRx).replacement_schedule && (
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 block uppercase mb-1">
                                    Replacement
                                </span>
                                <span className="font-medium dark:text-gray-200">
                                    {(rx as ContactLensRx).replacement_schedule}
                                </span>
                            </div>
                        )}
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block uppercase mb-1">
                            Expires
                        </span>
                        <span
                            className={`font-medium ${isExpired
                                    ? "text-red-600"
                                    : "dark:text-gray-200"
                                }`}
                        >
                            {new Date(rx.expires_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {rx.notes && (
                    <div className="mt-4 text-xs">
                        <span className="text-gray-500 dark:text-gray-400 block uppercase mb-1">
                            Notes
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 italic">
                            {rx.notes}
                        </p>
                    </div>
                )}

                {rx.prescribed_by && (
                    <div className="mt-4 text-xs text-end text-gray-500">
                        Prescribed by:{" "}
                        {rx.prescribed_by.name}
                    </div>
                )}
            </div>
        </div>
    );
}
