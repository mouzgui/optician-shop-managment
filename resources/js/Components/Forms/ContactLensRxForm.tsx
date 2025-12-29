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

export default function ContactLensRxForm({ data, setData, errors }: Props) {
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
                        {renderOpticalInput("od_sphere", "Sphere (SPH)", -30, 30)}
                        {renderOpticalInput("od_cylinder", "Cylinder (CYL)", -15, 15)}
                        {renderOpticalInput("od_axis", "Axis", 0, 180, 1)}
                        {renderOpticalInput("od_base_curve", "Base Curve (BC)", 7.0, 10.0, 0.1)}
                        {renderOpticalInput("od_diameter", "Diameter (DIA)", 10.0, 16.0, 0.1)}
                        <Input
                            id="od_brand"
                            label="Brand"
                            error={errors.od_brand}
                            type="text"
                            className="mt-1 block w-full"
                            value={data.od_brand}
                            onChange={(e) => setData("od_brand", e.target.value)}
                        />
                    </div>
                </div>

                {/* Left Eye (OS) */}
                <div className="bg-bg-subtle p-4 rounded-lg space-y-4">
                    <h3 className="font-bold text-lg text-text-primary border-b border-border-default pb-2">
                        Left Eye (OS)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {renderOpticalInput("os_sphere", "Sphere (SPH)", -30, 30)}
                        {renderOpticalInput("os_cylinder", "Cylinder (CYL)", -15, 15)}
                        {renderOpticalInput("os_axis", "Axis", 0, 180, 1)}
                        {renderOpticalInput("os_base_curve", "Base Curve (BC)", 7.0, 10.0, 0.1)}
                        {renderOpticalInput("os_diameter", "Diameter (DIA)", 10.0, 16.0, 0.1)}
                        <Input
                            id="os_brand"
                            label="Brand"
                            error={errors.os_brand}
                            type="text"
                            className="mt-1 block w-full"
                            value={data.os_brand}
                            onChange={(e) => setData("os_brand", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="bg-bg-subtle p-4 rounded-lg space-y-4">
                <h3 className="font-bold text-lg text-text-primary border-b border-border-default pb-2">
                    Additional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                        id="replacement_schedule"
                        label="Replacement Schedule"
                        error={errors.replacement_schedule}
                        value={data.replacement_schedule}
                        onChange={(e) => setData("replacement_schedule", e.target.value)}
                        options={[
                            { value: "", label: "Select schedule..." },
                            { value: "daily", label: "Daily" },
                            { value: "weekly", label: "Weekly" },
                            { value: "biweekly", label: "Bi-Weekly (2 weeks)" },
                            { value: "monthly", label: "Monthly" },
                            { value: "yearly", label: "Yearly" },
                        ]}
                    />
                    <Input
                        id="prescribed_at"
                        label="Prescribed Date"
                        error={errors.prescribed_at}
                        type="date"
                        value={data.prescribed_at}
                        onChange={(e) => setData("prescribed_at", e.target.value)}
                    />
                </div>
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
