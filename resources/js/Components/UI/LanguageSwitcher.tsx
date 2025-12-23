import React from "react";
import { useTranslation } from "react-i18next";

const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "es", label: "Español", flag: "🇪🇸" },
];

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (code: string) => {
        i18n.changeLanguage(code);
        localStorage.setItem("language", code);
        document.documentElement.lang = code;
        document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    };

    return (
        <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-bg-base text-text-primary border border-border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-border-focus"
        >
            {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.label}
                </option>
            ))}
        </select>
    );
}
