import { useTranslation } from "react-i18next";

interface UseDirectionReturn {
    isRTL: boolean;
    direction: "rtl" | "ltr";
    align: "right" | "left";
}

export function useDirection(): UseDirectionReturn {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === "ar";

    return {
        isRTL,
        direction: isRTL ? "rtl" : "ltr",
        align: isRTL ? "right" : "left",
    };
}
