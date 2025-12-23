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

export default function SpectacleRxForm({ data, setData, errors }: Props) {
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
                        {renderOpticalInput('od_sphere', 'SPH', -20, 20)}
                        {renderOpticalInput('od_cylinder', 'CYL', -10, 10)}
                        {renderOpticalInput('od_axis', 'AXIS', 0, 180, 1)}
                        {renderOpticalInput('od_add', 'ADD', 0, 4)}
                    </div>
                </div>

                {/* Left Eye (OS) */}
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2 dark:border-gray-700">OS (Left Eye)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {renderOpticalInput('os_sphere', 'SPH', -20, 20)}
                        {renderOpticalInput('os_cylinder', 'CYL', -10, 10)}
                        {renderOpticalInput('os_axis', 'AXIS', 0, 180, 1)}
                        {renderOpticalInput('os_add', 'ADD', 0, 4)}
                    </div>
                </div>
            </div>

            {/* PD & Additional Info */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-4">
                <h3 className="font-bold text-lg border-b pb-2 dark:border-gray-700">Additional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <InputLabel htmlFor="pd_type" value="PD Type" />
                        <select
                            id="pd_type"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                            value={data.pd_type}
                            onChange={(e) => setData('pd_type', e.target.value)}
                        >
                            <option value="single">Single PD</option>
                            <option value="dual">Dual PD</option>
                        </select>
                        <InputError message={errors.pd_type} className="mt-2" />
                    </div>
                    {renderOpticalInput('pd_far', 'PD Far', 40, 80, 0.5)}
                    {renderOpticalInput('pd_near', 'PD Near', 40, 80, 0.5)}
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
