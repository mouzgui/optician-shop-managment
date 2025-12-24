import React, { useState } from "react";
import { X, CreditCard, Banknote, Tag, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePage } from "@inertiajs/react";
import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (paymentData: any) => void;
    total: number;
    subtotal: number;
    totalDiscount: number;
    initialDeposit: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    total,
    subtotal,
    totalDiscount,
    initialDeposit,
}) => {
    const { t, i18n } = useTranslation();
    const { business } = usePage().props as any;
    const amountToPay = initialDeposit > 0 ? initialDeposit : total;

    const [paymentMethod, setPaymentMethod] = useState<
        "cash" | "card" | "split"
    >("cash");
    const [cashAmount, setCashAmount] = useState<number>(amountToPay);
    const [cardAmount, setCardAmount] = useState<number>(0);
    const [reference, setReference] = useState("");

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(
            i18n.language === "ar" ? "ar-SA" : "en-US",
            {
                style: "currency",
                currency: business?.currency_code || "USD",
            }
        ).format(amount);
    };

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm({
            payment_method: paymentMethod,
            amount:
                paymentMethod === "split"
                    ? cashAmount + cardAmount
                    : amountToPay,
            cash_amount:
                paymentMethod === "split"
                    ? cashAmount
                    : paymentMethod === "cash"
                    ? amountToPay
                    : 0,
            card_amount:
                paymentMethod === "split"
                    ? cardAmount
                    : paymentMethod === "card"
                    ? amountToPay
                    : 0,
            reference,
        });
    };

    const isSplitValid =
        paymentMethod === "split"
            ? Math.abs(cashAmount + cardAmount - amountToPay) < 0.01
            : true;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-bg-base rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-border-default animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between bg-bg-subtle">
                    <h2 className="text-xl font-black text-text-default">
                        {t("POS.payment.title")}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-bg-base rounded-full transition-colors text-text-muted hover:text-text-primary"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Summary */}
                    <div className="bg-primary-subtle rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-sm text-primary-strong">
                            <span>{t("POS.payment.amount_due")}</span>
                            <span className="font-bold">
                                {formatCurrency(total)}
                            </span>
                        </div>
                        {initialDeposit > 0 && (
                            <>
                                <div className="flex justify-between text-sm text-primary-default">
                                    <span>
                                        {t("POS.payment.initial_deposit")}
                                    </span>
                                    <span className="font-bold">
                                        {formatCurrency(initialDeposit)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-text-muted pt-1 border-t border-primary-default/10">
                                    <span>
                                        {t("invoices.fields.balance_due")}
                                    </span>
                                    <span>
                                        {formatCurrency(total - initialDeposit)}
                                    </span>
                                </div>
                            </>
                        )}
                        <div className="flex justify-between text-lg font-black text-primary-strong pt-2 border-t border-primary-default/20">
                            <span>{t("POS.payment.final_total")}</span>
                            <span>{formatCurrency(amountToPay)}</span>
                        </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                            {t("POS.payment.method_label")}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setPaymentMethod("cash")}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    paymentMethod === "cash"
                                        ? "border-status-success-border bg-status-success-bg text-status-success-text ring-1 ring-status-success-border"
                                        : "border-border-default hover:border-border-strong bg-bg-base"
                                }`}
                            >
                                <Banknote className="w-6 h-6" />
                                <span className="text-xs font-bold">
                                    {t("POS.payment.method_cash")}
                                </span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod("card")}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    paymentMethod === "card"
                                        ? "border-primary-default bg-primary-subtle text-primary-strong ring-1 ring-primary-default"
                                        : "border-border-default hover:border-border-strong bg-bg-base"
                                }`}
                            >
                                <CreditCard className="w-6 h-6" />
                                <span className="text-xs font-bold">
                                    {t("POS.payment.method_card")}
                                </span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod("split")}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    paymentMethod === "split"
                                        ? "border-status-info-border bg-status-info-bg text-status-info-text ring-1 ring-status-info-border"
                                        : "border-border-default hover:border-border-strong bg-bg-base"
                                }`}
                            >
                                <div className="flex gap-1">
                                    <Banknote className="w-4 h-4" />
                                    <CreditCard className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold">
                                    {t("POS.payment.method_split")}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Conditional Inputs */}
                    {paymentMethod === "split" && (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-text-muted uppercase">
                                    {t("POS.payment.cash_amount")}
                                </label>
                                <div className="relative group">
                                    <span className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-default transition-colors z-10">
                                        {business?.currency_symbol || "$"}
                                    </span>
                                    <Input
                                        type="number"
                                        value={cashAmount}
                                        onChange={(e) =>
                                            setCashAmount(
                                                Number(e.target.value)
                                            )
                                        }
                                        className="ps-7"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-text-muted uppercase">
                                    {t("POS.payment.card_amount")}
                                </label>
                                <div className="relative group">
                                    <span className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-default transition-colors z-10">
                                        {business?.currency_symbol || "$"}
                                    </span>
                                    <Input
                                        type="number"
                                        value={cardAmount}
                                        onChange={(e) =>
                                            setCardAmount(
                                                Number(e.target.value)
                                            )
                                        }
                                        className="ps-7"
                                    />
                                </div>
                            </div>
                            {!isSplitValid && (
                                <div className="col-span-2 flex items-center gap-2 text-error text-xs font-medium">
                                    <AlertCircle className="w-4 h-4" />
                                    {t("POS.payment.split_error", {
                                        total: formatCurrency(total),
                                        current: formatCurrency(
                                            cashAmount + cardAmount
                                        ),
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted uppercase">
                            {t("POS.payment.reference_label")}
                        </label>
                        <Input
                            type="text"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder={t("POS.payment.reference_placeholder")}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-bg-subtle border-t border-border-subtle">
                    <Button
                        variant="primary"
                        className="w-full py-4 text-lg font-bold"
                        onClick={handleConfirm}
                        disabled={!isSplitValid}
                    >
                        {t("POS.payment.confirm_button")}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
