import React from "react";
import { Input } from "@/Components/UI/Input";
import { Button } from "@/Components/UI/Button";
import { Select } from "@/Components/UI/Select";
import { TextArea } from "@/Components/UI/TextArea";

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
}

export default function SpectacleRxForm({ data, setData, errors }: Props) {
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
                    Copy OD → OS
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Right Eye (OD) */}
                <div className="bg-bg-subtle p-4 rounded-lg space-y-4">
                    <h3 className="font-bold text-lg text-text-primary border-b border-border-default pb-2">
                        Right Eye (OD)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {renderOpticalInput("od_sphere", "Sphere (SPH)", -20, 20)}
                        {renderOpticalInput("od_cylinder", "Cylinder (CYL)", -10, 10)}
                        {renderOpticalInput("od_axis", "Axis", 0, 180, 1)}
                        {renderOpticalInput("od_add", "Addition (ADD)", 0, 4)}
                    </div>
                </div>

                {/* Left Eye (OS) */}
                <div className="bg-bg-subtle p-4 rounded-lg space-y-4">
                    <h3 className="font-bold text-lg text-text-primary border-b border-border-default pb-2">
                        Left Eye (OS)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {renderOpticalInput("os_sphere", "Sphere (SPH)", -20, 20)}
                        {renderOpticalInput("os_cylinder", "Cylinder (CYL)", -10, 10)}
                        {renderOpticalInput("os_axis", "Axis", 0, 180, 1)}
                        {renderOpticalInput("os_add", "Addition (ADD)", 0, 4)}
                    </div>
                </div>
            </div>

            {/* PD & Additional Info */}
            <div className="bg-bg-subtle p-4 rounded-lg space-y-4">
                <h3 className="font-bold text-lg text-text-primary border-b border-border-default pb-2">
                    Additional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Select
                        id="pd_type"
                        label="PD Type"
                        error={errors.pd_type}
                        value={data.pd_type}
                        onChange={(e) => setData("pd_type", e.target.value)}
                        options={[
                            { value: "single", label: "Single PD" },
                            { value: "dual", label: "Dual PD (OD/OS)" },
                        ]}
                    />
                    {renderOpticalInput("pd_far", "PD Distance", 40, 80, 0.5)}
                    {renderOpticalInput("pd_near", "PD Near", 40, 80, 0.5)}
                </div>
                <Input
                    id="prescribed_at"
                    label="Prescribed Date"
                    error={errors.prescribed_at}
                    type="date"
                    value={data.prescribed_at}
                    onChange={(e) => setData("prescribed_at", e.target.value)}
                />
                <TextArea
                    id="notes"
                    label="Notes"
                    error={errors.notes}
                    value={data.notes}
                    onChange={(e) => setData("notes", e.target.value)}
                    rows={3}
                />
            </div>
        </div>
    );
}
