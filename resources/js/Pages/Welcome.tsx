import React from "react";
import { Head } from "@inertiajs/react";
import { ThemeToggle } from "@/Components/UI/ThemeToggle";
import { useTranslation } from "react-i18next";

export default function Welcome() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = lng;
    };

    return (
        <>
            <Head title={t("welcome.title")} />
            <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-4">
                <div className="mb-8 flex gap-4">
                    <ThemeToggle />
                    <div className="flex gap-2 bg-card-bg p-1 rounded-lg border border-border-default">
                        {["en", "ar", "fr", "es"].map((lng) => (
                            <button
                                key={lng}
                                onClick={() => changeLanguage(lng)}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                    i18n.language === lng
                                        ? "bg-interactive-primary text-text-inverted"
                                        : "text-text-secondary hover:bg-bg-elevated"
                                }`}
                            >
                                {lng.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="bg-card-bg p-8 rounded-lg shadow-md border border-border-default max-w-md w-full text-center">
                    <h1 className="text-3xl font-bold text-interactive-primary mb-4">
                        {t("welcome.title")}
                    </h1>
                    <p className="text-text-secondary">
                        {t("welcome.description")}
                    </p>
                    <div className="mt-6 p-4 bg-status-success-bg text-status-success-text rounded border border-status-success-border">
                        {t("welcome.status")}
                    </div>
                    <button className="mt-4 px-4 py-2 bg-btn-primary text-text-inverted rounded hover:bg-interactive-primary-hover transition-colors">
                        {t("welcome.test_button")}
                    </button>
                </div>
            </div>
        </>
    );
}
