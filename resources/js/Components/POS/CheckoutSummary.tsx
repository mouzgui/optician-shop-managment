import React from "react";
import { Tag, Banknote, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePage } from "@inertiajs/react";
import { Input } from "@/Components/UI/Input";
import { Button } from "@/Components/UI/Button";

interface CheckoutSummaryProps {
    subtotal: number;
    totalDiscount: number;
    total: number;
    paymentMethod: string;
    setPaymentMethod: (method: string) => void;
    depositAmount: number;
    setDepositAmount: (amount: number) => void;
    onCheckout: () => void;
    disabled: boolean;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
    subtotal,
    totalDiscount,
    total,
    paymentMethod,
    setPaymentMethod,
    depositAmount,
    setDepositAmount,
    onCheckout,
    disabled,
}) => {
    const { t, i18n } = useTranslation();
    const { business } = usePage().props as any;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(
            i18n.language === "ar" ? "ar-SA" : "en-US",
            {
                style: "currency",
                currency: business?.currency_code || "USD",
            }
        ).format(amount);
    };

    return (
        <div className="p-4 bg-bg-base border-t border-border-default space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-text-muted">
                    <span>{t("POS.summary.subtotal")}</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-error">
                    <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        <span>{t("POS.summary.discount")}</span>
                    </div>
                    <span>-{formatCurrency(totalDiscount)}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-text-default pt-2 border-t border-border-subtle">
                    <span>{t("POS.summary.total")}</span>
                    <span>{formatCurrency(total)}</span>
                </div>
            </div>

            <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => setPaymentMethod("cash")}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                            paymentMethod === "cash"
                                ? "bg-status-success-bg border-status-success-border text-status-success-text"
                                : "bg-bg-base border-border-default text-text-muted hover:bg-bg-subtle"
                        }`}
                    >
                        <Banknote className="w-4 h-4" />
                        {t("POS.summary.payment_cash")}
                    </button>
                    <button
                        onClick={() => setPaymentMethod("card")}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                            paymentMethod === "card"
                                ? "bg-primary-subtle border-primary-default text-primary-strong"
                                : "bg-bg-base border-border-default text-text-muted hover:bg-bg-subtle"
                        }`}
                    >
                        <CreditCard className="w-4 h-4" />
                        {t("POS.summary.payment_card")}
                    </button>
                </div>

                <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1">
                        {t("POS.summary.deposit_label")}
                    </label>
                    <div className="relative group">
                        <span className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-default transition-colors z-10">
                            {business?.currency_symbol || "$"}
                        </span>
                        <Input
                            type="number"
                            className="ps-7"
                            placeholder="0.00"
                            value={depositAmount}
                            onChange={(e) =>
                                setDepositAmount(Number(e.target.value))
                            }
                        />
                    </div>
                </div>

                <Button
                    variant="primary"
                    className="w-full py-4 text-lg font-bold"
                    onClick={onCheckout}
                    disabled={disabled}
                >
                    {t("POS.summary.checkout")}
                </Button>
            </div>
        </div>
    );
};

export default CheckoutSummary;
