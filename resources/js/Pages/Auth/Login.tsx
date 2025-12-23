import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { GuestLayout } from "@/Layouts/GuestLayout";
import { useTranslation } from "react-i18next";

export default function Login() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/login", {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout title={t("auth.login_title")}>
            <Head title={t("auth.login")} />

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-text-secondary mb-1"
                    >
                        {t("auth.email")}
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="w-full px-4 py-2 bg-input-bg border border-input-border rounded-lg text-input-text placeholder-input-placeholder focus:outline-none focus:ring-2 focus:ring-input-border-focus focus:border-transparent transition-all"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-status-error-text">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-text-secondary"
                        >
                            {t("auth.password")}
                        </label>
                        <a
                            href="/forgot-password"
                            className="text-xs text-text-link hover:text-text-link-hover font-medium"
                        >
                            {t("auth.forgot_password")}
                        </a>
                    </div>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="w-full px-4 py-2 bg-input-bg border border-input-border rounded-lg text-input-text placeholder-input-placeholder focus:outline-none focus:ring-2 focus:ring-input-border-focus focus:border-transparent transition-all"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-status-error-text">
                            {errors.password}
                        </p>
                    )}
                </div>

                <div className="flex items-center">
                    <input
                        id="remember"
                        type="checkbox"
                        name="remember"
                        checked={data.remember}
                        className="h-4 w-4 text-interactive-primary focus:ring-border-focus border-border rounded transition-all"
                        onChange={(e) => setData("remember", e.target.checked)}
                    />
                    <label
                        htmlFor="remember"
                        className="ms-2 block text-sm text-text-secondary"
                    >
                        {t("auth.remember_me")}
                    </label>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-interactive-primary hover:bg-interactive-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {processing ? t("auth.logging_in") : t("auth.login_btn")}
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center text-sm text-text-muted">
                {t("auth.no_account")}{" "}
                <a
                    href="/register"
                    className="text-text-link hover:text-text-link-hover font-medium"
                >
                    {t("auth.register_link")}
                </a>
            </div>
        </GuestLayout>
    );
}
