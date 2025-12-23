import React from "react";
import { Eye, Activity, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { enUS, arSA } from "date-fns/locale";

interface Prescription {
    id: number;
    type: "spectacle" | "contact_lens";
    date: string;
    doctor?: string;
    notes?: string;
}

interface PrescriptionSelectorProps {
    prescriptions: Prescription[];
    selectedPrescriptionId: number | null;
    onSelect: (
        id: number | null,
        type: "spectacle" | "contact_lens" | null
    ) => void;
}

const PrescriptionSelector: React.FC<PrescriptionSelectorProps> = ({
    prescriptions,
    selectedPrescriptionId,
    onSelect,
}) => {
    const { t, i18n } = useTranslation();
    const locales: Record<string, any> = { en: enUS, ar: arSA };
    const currentLocale = locales[i18n.language] || enUS;

    if (prescriptions.length === 0) return null;

    return (
        <div className="p-4 border-b border-border-default bg-bg-base">
            <h3 className="text-xs font-bold text-text-muted uppercase mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {t("POS.prescriptions.title")}
            </h3>
            <div className="space-y-2">
                {prescriptions.map((rx) => (
                    <button
                        key={`${rx.type}-${rx.id}`}
                        onClick={() => onSelect(rx.id, rx.type)}
                        className={`w-full text-start p-3 rounded-lg border transition-all ${
                            selectedPrescriptionId === rx.id
                                ? "border-primary-600 bg-primary-50 ring-1 ring-primary-600"
                                : "border-border-default hover:border-border-strong bg-bg-subtle"
                        }`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    rx.type === "spectacle"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-purple-100 text-purple-700"
                                }`}
                            >
                                {rx.type === "spectacle"
                                    ? t("POS.prescriptions.type_spectacle")
                                    : t("POS.prescriptions.type_contact_lens")}
                            </span>
                            <span className="text-[10px] text-text-muted flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(rx.date), "PP", {
                                    locale: currentLocale,
                                })}
                            </span>
                        </div>
                        {rx.doctor && (
                            <p className="text-xs font-bold text-text-default">
                                {t("POS.prescriptions.doctor_prefix")}{" "}
                                {rx.doctor}
                            </p>
                        )}
                        {rx.notes && (
                            <p className="text-xs text-text-muted line-clamp-1">
                                {rx.notes}
                            </p>
                        )}
                    </button>
                ))}

                {selectedPrescriptionId && (
                    <button
                        onClick={() => onSelect(null, null)}
                        className="w-full py-2 text-xs text-text-muted hover:text-error transition-colors"
                    >
                        {t("POS.prescriptions.clear")}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PrescriptionSelector;
