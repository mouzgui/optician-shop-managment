import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useTranslation } from 'react-i18next';

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
}

export default function ContactLensRxForm({ data, setData, errors }: Props) {
    const { t } = useTranslation();

    const renderOpticalInput = (id: string, label: string, min: number, max: number, step: number = 0.25) => (
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

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Right Eye (OD) */}
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2 dark:border-gray-700">OD (Right Eye)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {renderOpticalInput('od_sphere', 'SPH', -30, 30)}
                        {renderOpticalInput('od_cylinder', 'CYL', -15, 15)}
                        {renderOpticalInput('od_axis', 'AXIS', 0, 180, 1)}
                        {renderOpticalInput('od_base_curve', 'BC', 7.0, 10.0, 0.1)}
                        {renderOpticalInput('od_diameter', 'DIA', 10.0, 16.0, 0.1)}
                        <div>
                            <InputLabel htmlFor="od_brand" value="Brand" />
                            <TextInput
                                id="od_brand"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.od_brand}
                                onChange={(e) => setData('od_brand', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Left Eye (OS) */}
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2 dark:border-gray-700">OS (Left Eye)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {renderOpticalInput('os_sphere', 'SPH', -30, 30)}
                        {renderOpticalInput('os_cylinder', 'CYL', -15, 15)}
                        {renderOpticalInput('os_axis', 'AXIS', 0, 180, 1)}
                        {renderOpticalInput('os_base_curve', 'BC', 7.0, 10.0, 0.1)}
                        {renderOpticalInput('os_diameter', 'DIA', 10.0, 16.0, 0.1)}
                        <div>
                            <InputLabel htmlFor="os_brand" value="Brand" />
                            <TextInput
                                id="os_brand"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.os_brand}
                                onChange={(e) => setData('os_brand', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-4">
                <h3 className="font-bold text-lg border-b pb-2 dark:border-gray-700">Additional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="replacement_schedule" value="Replacement Schedule" />
                        <select
                            id="replacement_schedule"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                            value={data.replacement_schedule}
                            onChange={(e) => setData('replacement_schedule', e.target.value)}
                        >
                            <option value="">Select Schedule</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="bi_weekly">Bi-Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        <InputError message={errors.replacement_schedule} className="mt-2" />
                    </div>
                </div>
                <div>
                    <InputLabel htmlFor="notes" value="Notes" />
                    <textarea
                        id="notes"
                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        rows={3}
                    />
                    <InputError message={errors.notes} className="mt-2" />
                </div>
            </div>
        </div>
    );
}
