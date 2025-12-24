import React from "react";
import { Head, Link } from "@inertiajs/react";
import { ThemeToggle } from "@/Components/UI/ThemeToggle";
import { useTranslation } from "react-i18next";
import {
    Eye,
    Users,
    ShoppingCart,
    FileText,
    BarChart3,
    Settings,
    ArrowRight,
    CheckCircle,
    Glasses,
    Building2,
    Shield,
    Globe,
    LogIn,
} from "lucide-react";

interface WelcomeProps {
    auth?: {
        user?: {
            name: string;
            role: string;
        } | null;
    };
    dashboardUrl?: string | null;
}

export default function Welcome({ auth, dashboardUrl }: WelcomeProps) {
    const { t, i18n } = useTranslation();
    const isLoggedIn = !!auth?.user;

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = lng;
    };

    const features = [
        {
            icon: <Users className="w-8 h-8" />,
            titleKey: "home.features.customer_management.title",
            descKey: "home.features.customer_management.description",
        },
        {
            icon: <Eye className="w-8 h-8" />,
            titleKey: "home.features.prescription_tracking.title",
            descKey: "home.features.prescription_tracking.description",
        },
        {
            icon: <ShoppingCart className="w-8 h-8" />,
            titleKey: "home.features.pos.title",
            descKey: "home.features.pos.description",
        },
        {
            icon: <FileText className="w-8 h-8" />,
            titleKey: "home.features.invoicing.title",
            descKey: "home.features.invoicing.description",
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            titleKey: "home.features.reports.title",
            descKey: "home.features.reports.description",
        },
        {
            icon: <Settings className="w-8 h-8" />,
            titleKey: "home.features.lab.title",
            descKey: "home.features.lab.description",
        },
    ];

    const benefits = [
        "home.benefits.multi_branch",
        "home.benefits.role_access",
        "home.benefits.white_label",
        "home.benefits.multi_language",
        "home.benefits.themes",
        "home.benefits.responsive",
    ];

    const stats = [
        { value: "500+", labelKey: "home.stats.shops" },
        { value: "50K+", labelKey: "home.stats.prescriptions" },
        { value: "99.9%", labelKey: "home.stats.uptime" },
        { value: "24/7", labelKey: "home.stats.support" },
    ];

    return (
        <>
            <Head title={t("welcome.title")} />
            <div className="min-h-screen bg-bg-base">
                {/* Navigation */}
                <nav className="fixed top-0 inset-x-0 z-50 bg-bg-base/80 backdrop-blur-lg border-b border-border-default">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                                    <Glasses className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-text-primary">
                                    Opticina
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <ThemeToggle />
                                <div className="hidden sm:flex gap-1 bg-bg-elevated p-1 rounded-lg border border-border-default">
                                    {["en", "ar", "fr", "es"].map((lng) => (
                                        <button
                                            key={lng}
                                            onClick={() => changeLanguage(lng)}
                                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${i18n.language === lng
                                                ? "bg-interactive-primary text-white"
                                                : "text-text-secondary hover:bg-bg-subtle"
                                                }`}
                                        >
                                            {lng.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                {isLoggedIn ? (
                                    <Link
                                        href={dashboardUrl || "/business/dashboard"}
                                        className="px-4 py-2 bg-interactive-primary text-white rounded-lg font-medium hover:bg-interactive-primary-hover transition-all hover:scale-105"
                                    >
                                        {t("home.nav.dashboard")}
                                    </Link>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 bg-interactive-primary text-white rounded-lg font-medium hover:bg-interactive-primary-hover transition-all hover:scale-105"
                                    >
                                        {t("home.nav.sign_in")}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-interactive-primary/10 text-interactive-primary rounded-full text-sm font-medium mb-6">
                            <Shield className="w-4 h-4" />
                            {t("home.hero.badge")}
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
                            {t("home.hero.title_1")}
                            <span className="block bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                                {t("home.hero.title_2")}
                            </span>
                            {t("home.hero.title_3")}
                        </h1>

                        <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
                            {t("home.hero.description")}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={isLoggedIn ? (dashboardUrl || "/business/dashboard") : "/login"}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-interactive-primary text-white rounded-xl font-semibold text-lg hover:bg-interactive-primary-hover transition-all hover:scale-105 shadow-lg shadow-interactive-primary/25"
                            >
                                {isLoggedIn ? t("home.nav.dashboard") : t("home.hero.cta_primary")}
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <a
                                href="#features"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-bg-elevated text-text-primary rounded-xl font-semibold text-lg border border-border-default hover:bg-bg-subtle transition-all"
                            >
                                {t("home.hero.cta_secondary")}
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
                            {stats.map((stat) => (
                                <div key={stat.labelKey} className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-interactive-primary">
                                        {stat.value}
                                    </div>
                                    <div className="text-text-muted text-sm mt-1">
                                        {t(stat.labelKey)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 px-4 bg-bg-elevated">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                                {t("home.features.title")}
                            </h2>
                            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                                {t("home.features.subtitle")}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="p-6 bg-bg-base rounded-2xl border border-border-default hover:border-interactive-primary/50 transition-all hover:shadow-lg group"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-interactive-primary/10 text-interactive-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                                        {t(feature.titleKey)}
                                    </h3>
                                    <p className="text-text-secondary">
                                        {t(feature.descKey)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-6">
                                    {t("home.benefits.title")}
                                    <span className="text-interactive-primary"> {t("home.benefits.title_highlight")}</span>
                                </h2>
                                <p className="text-text-secondary text-lg mb-8">
                                    {t("home.benefits.subtitle")}
                                </p>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {benefits.map((benefitKey) => (
                                        <div
                                            key={benefitKey}
                                            className="flex items-center gap-3"
                                        >
                                            <CheckCircle className="w-5 h-5 text-status-success-text flex-shrink-0" />
                                            <span className="text-text-primary">
                                                {t(benefitKey)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 blur-3xl rounded-full" />
                                <div className="relative bg-bg-elevated rounded-2xl border border-border-default p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                                            <Building2 className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-text-primary">
                                                {t("home.benefits.multi_tenant")}
                                            </div>
                                            <div className="text-sm text-text-muted">
                                                {t("home.benefits.multi_tenant_desc")}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                                            <Globe className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-text-primary">
                                                {t("home.benefits.rtl")}
                                            </div>
                                            <div className="text-sm text-text-muted">
                                                {t("home.benefits.rtl_desc")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4">
                    <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            {t("home.cta.title")}
                        </h2>
                        <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                            {t("home.cta.subtitle")}
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all hover:scale-105"
                        >
                            {t("home.cta.button")}
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 px-4 border-t border-border-default">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Glasses className="w-5 h-5 text-interactive-primary" />
                            <span className="font-semibold text-text-primary">Opticina</span>
                        </div>
                        <div className="text-text-muted text-sm">
                            {t("home.footer.copyright")}
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
