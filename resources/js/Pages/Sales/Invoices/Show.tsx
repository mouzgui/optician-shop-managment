import React, { useState } from "react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage, useForm } from "@inertiajs/react";
import { Badge } from "@/Components/UI/Badge";
import { Card } from "@/Components/UI/Card";
import { Button } from "@/Components/UI/Button";
import { DataTable } from "@/Components/UI/DataTable";
import { Modal } from "@/Components/UI/Modal";
import { Input } from "@/Components/UI/Input";
import { Select } from "@/Components/UI/Select";
import {
    Printer,
    ArrowLeft,
    CreditCard,
    History,
    User,
    MapPin,
    Package,
    Eye,
    DollarSign,
    Banknote,
    X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { enUS, arSA } from "date-fns/locale";

interface Props {
    invoice: any;
}

export default function Show({ invoice }: Props) {
    const { t, i18n } = useTranslation();
    const { business } = usePage().props as any;
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        amount: invoice.balance_due,
        payment_method: "cash",
        reference: "",
        received_at: new Date().toISOString().split("T")[0],
    });

    const handleAddPayment = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("business.sales.invoices.add-payment", invoice.id), {
            onSuccess: () => {
                setIsPaymentModalOpen(false);
                reset();
            },
        });
    };

    const safeT = (key: string, fallback?: string) => {
        try {
            const result = t(key);
            return typeof result === "string" ? result : fallback || key;
        } catch {
            return fallback || key;
        }
    };

    const locales: Record<string, any> = {
        en: enUS,
        ar: arSA,
    };

    const currentLocale = locales[i18n.language] || enUS;

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: business?.currency_code || "AED",
        }).format(typeof amount === "string" ? parseFloat(amount) : amount);
    };

    const statusMap: Record<string, { label: string; variant: any }> = {
        pending: {
            label: safeT("invoices.status.pending", "Pending"),
            variant: "warning",
        },
        partial: {
            label: safeT("invoices.status.partial", "Partial"),
            variant: "info",
        },
        paid: {
            label: safeT("invoices.status.paid", "Paid"),
            variant: "success",
        },
        overdue: {
            label: safeT("invoices.status.overdue", "Overdue"),
            variant: "danger",
        },
        deposit_paid: {
            label: safeT("invoices.status.partial", "Partial"),
            variant: "info",
        },
        completed: {
            label: safeT("invoices.status.paid", "Paid"),
            variant: "success",
        },
        cancelled: {
            label: safeT("common.status.inactive", "Cancelled"),
            variant: "danger",
        },
    };

    const status = statusMap[invoice.status] || {
        label: invoice.status,
        variant: "default",
    };

    const itemColumns = [
        {
            header: safeT("invoices.show.items", "Items"),
            accessor: (item: any) => (
                <div className="flex flex-col">
                    <span className="font-medium text-text-primary">
                        {item.description}
                    </span>
                    <span className="text-xs text-text-muted uppercase mt-0.5">
                        {item.item_type}
                    </span>
                </div>
            ),
        },
        {
            header: safeT("common.qty", "Qty"),
            className: "text-center",
            accessor: (item: any) => (
                <span className="text-text-primary">{item.quantity}</span>
            ),
        },
        {
            header: safeT("common.price", "Price"),
            className: "text-end",
            accessor: (item: any) => (
                <span className="text-text-primary">
                    {formatCurrency(item.unit_price)}
                </span>
            ),
        },
        {
            header: safeT("invoices.show.discount", "Discount"),
            className: "text-end",
            accessor: (item: any) => (
                <span className="text-interactive-error">
                    -{formatCurrency(item.discount)}
                </span>
            ),
        },
        {
            header: safeT("common.total", "Total"),
            className: "text-end",
            accessor: (item: any) => (
                <span className="font-bold text-text-primary">
                    {formatCurrency(item.total)}
                </span>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head
                title={`${safeT("invoices.show.title", "Invoice")} - ${
                    invoice.invoice_number
                }`}
            />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/business/sales/invoices"
                            className="p-2 rounded-lg hover:bg-bg-subtle text-text-muted hover:text-text-primary transition-all"
                        >
                            <ArrowLeft className="w-5 h-5 icon-flip" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="font-semibold text-xl text-text-primary leading-tight">
                                    {invoice.invoice_number}
                                </h2>
                                <Badge variant={status.variant}>
                                    {status.label}
                                </Badge>
                            </div>
                            <p className="text-sm text-text-muted mt-1">
                                {format(new Date(invoice.created_at), "PPP", {
                                    locale: currentLocale,
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            className="gap-2"
                            onClick={() =>
                                window.open(
                                    route(
                                        "business.sales.invoices.download-pdf",
                                        invoice.id
                                    ),
                                    "_blank"
                                )
                            }
                        >
                            <Printer className="w-4 h-4" />
                            {safeT("common.print", "Print")}
                        </Button>
                        <Button
                            variant="primary"
                            className="gap-2"
                            onClick={() => setIsPaymentModalOpen(true)}
                            disabled={parseFloat(invoice.balance_due) <= 0}
                        >
                            <CreditCard className="w-4 h-4" />
                            {safeT("POS.add_payment", "Add Payment")}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Items and History */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Items Table */}
                        <div className="space-y-4">
                            <Card className="p-0 overflow-hidden">
                                <div className="px-6 py-4 border-b border-border-subtle bg-bg-subtle/50">
                                    <h3 className="font-bold text-text-primary flex items-center gap-2">
                                        <Package className="w-5 h-5 text-interactive-primary" />
                                        {safeT("invoices.show.items", "Items")}
                                    </h3>
                                </div>
                                <DataTable
                                    columns={itemColumns}
                                    data={invoice.items}
                                    keyField="id"
                                />
                            </Card>

                            {/* Summary Section */}
                            <div className="flex justify-end">
                                <Card className="w-full md:w-80 p-6 space-y-3 bg-bg-subtle/50">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-muted">
                                            {safeT(
                                                "invoices.show.subtotal",
                                                "Subtotal"
                                            )}
                                        </span>
                                        <span className="font-medium text-text-primary">
                                            {formatCurrency(invoice.subtotal)}
                                        </span>
                                    </div>
                                    {parseFloat(invoice.discount_amount) >
                                        0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-interactive-error">
                                                {safeT(
                                                    "invoices.show.discount",
                                                    "Discount"
                                                )}
                                            </span>
                                            <span className="font-medium text-interactive-error">
                                                -
                                                {formatCurrency(
                                                    invoice.discount_amount
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    <div className="pt-3 border-t border-border-subtle flex justify-between items-baseline">
                                        <span className="font-bold text-text-primary">
                                            {safeT(
                                                "invoices.show.grand_total",
                                                "Grand Total"
                                            )}
                                        </span>
                                        <span className="text-xl font-black text-interactive-primary">
                                            {formatCurrency(invoice.total)}
                                        </span>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Payments History */}
                        <Card className="p-0 overflow-hidden">
                            <div className="px-6 py-4 border-b border-border-subtle bg-bg-subtle/50">
                                <h3 className="font-bold text-text-primary flex items-center gap-2">
                                    <History className="w-5 h-5 text-interactive-primary" />
                                    {safeT(
                                        "invoices.show.payments",
                                        "Payments"
                                    )}
                                </h3>
                            </div>
                            <div className="p-6">
                                {invoice.payments.length === 0 ? (
                                    <div className="text-center py-10 bg-bg-subtle/30 rounded-xl border-2 border-dashed border-border-subtle">
                                        <p className="text-text-muted italic">
                                            {t(
                                                "common.no_payments",
                                                "No payments recorded yet."
                                            )}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {invoice.payments.map(
                                            (payment: any) => (
                                                <div
                                                    key={payment.id}
                                                    className="flex items-center justify-between p-4 bg-bg-subtle/50 rounded-xl border border-border-subtle hover:border-interactive-primary/30 transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2.5 bg-bg-base rounded-xl shadow-sm border border-border-subtle">
                                                            <DollarSign className="w-5 h-5 text-interactive-success" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-text-primary text-lg">
                                                                {formatCurrency(
                                                                    payment.amount
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-text-muted flex items-center gap-2 mt-0.5">
                                                                <span className="uppercase font-bold text-interactive-primary/70">
                                                                    {
                                                                        payment.payment_method
                                                                    }
                                                                </span>
                                                                <span className="opacity-50">
                                                                    •
                                                                </span>
                                                                <span>
                                                                    {format(
                                                                        new Date(
                                                                            payment.received_at
                                                                        ),
                                                                        "Pp",
                                                                        {
                                                                            locale: currentLocale,
                                                                        }
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-end">
                                                        <div className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1 opacity-60">
                                                            {safeT(
                                                                "reports.revenue.fields.received_by",
                                                                "Received By"
                                                            )}
                                                        </div>
                                                        <div className="text-sm font-semibold text-text-primary bg-bg-base px-3 py-1 rounded-lg border border-border-subtle shadow-sm">
                                                            {
                                                                payment
                                                                    .received_by
                                                                    ?.name
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Customer & Summary */}
                    <div className="space-y-8">
                        {/* Customer Info */}
                        <Card className="p-6">
                            <h3 className="font-bold text-text-primary mb-5 flex items-center gap-2 border-b border-border-subtle pb-3">
                                <User className="w-5 h-5 text-interactive-primary" />
                                {safeT("invoices.fields.customer", "Customer")}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1 opacity-60">
                                        {safeT("customers.fields.name", "Name")}
                                    </div>
                                    <div className="font-bold text-text-primary text-lg">
                                        {invoice.customer.first_name}{" "}
                                        {invoice.customer.last_name}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1 opacity-60">
                                        {safeT(
                                            "customers.fields.phone",
                                            "Phone"
                                        )}
                                    </div>
                                    <div className="text-text-primary font-medium">
                                        {invoice.customer.phone || "N/A"}
                                    </div>
                                </div>
                                <Link
                                    href={`/business/customers/${invoice.customer.id}`}
                                    className="inline-flex items-center gap-2 text-interactive-primary font-bold text-sm hover:ms-1 transition-all mt-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    {safeT(
                                        "customers.profile_details",
                                        "View Profile"
                                    )}
                                    <span className="icon-flip">→</span>
                                </Link>
                            </div>
                        </Card>

                        {/* Financial Summary */}
                        <Card className="bg-interactive-primary p-7 text-white shadow-xl shadow-interactive-primary/20 border-none relative overflow-hidden">
                            <div className="absolute top-0 end-0 p-4 opacity-10">
                                <DollarSign className="w-24 h-24 -me-8 -mt-8" />
                            </div>
                            <h3 className="font-bold text-white/60 mb-6 flex items-center gap-2 border-b border-white/10 pb-3 uppercase text-[10px] tracking-[0.2em]">
                                {safeT("reports.revenue.summary", "Summary")}
                            </h3>
                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/70 font-medium">
                                        {safeT(
                                            "invoices.fields.total",
                                            "Total"
                                        )}
                                    </span>
                                    <span className="text-2xl font-black">
                                        {formatCurrency(invoice.total)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/70 font-medium">
                                        {safeT(
                                            "invoices.fields.amount_paid",
                                            "Amount Paid"
                                        )}
                                    </span>
                                    <span className="text-xl font-bold">
                                        {formatCurrency(invoice.amount_paid)}
                                    </span>
                                </div>
                                <div className="pt-5 border-t border-white/10 flex justify-between items-center">
                                    <span className="font-bold text-lg">
                                        {safeT(
                                            "invoices.fields.balance_due",
                                            "Balance Due"
                                        )}
                                    </span>
                                    <span
                                        className={`text-3xl font-black px-4 py-1 rounded-xl ${
                                            parseFloat(invoice.balance_due) > 0
                                                ? "bg-white/10 text-white"
                                                : "bg-interactive-success/20 text-white"
                                        }`}
                                    >
                                        {formatCurrency(invoice.balance_due)}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* Location Info */}
                        <Card className="p-6 border-none shadow-sm ring-1 ring-border-subtle bg-bg-subtle/50">
                            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2 border-b border-border-subtle pb-3 text-sm">
                                <MapPin className="w-4 h-4 text-interactive-primary" />
                                {safeT("business.branches.hq", "Branch")}
                            </h3>
                            <div className="text-sm font-bold text-text-primary bg-bg-base px-3 py-2 rounded-lg border border-border-subtle shadow-sm inline-block">
                                {invoice.branch.name}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                title={safeT("POS.add_payment", "Add Payment")}
            >
                <form onSubmit={handleAddPayment} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">
                            {safeT("reports.revenue.fields.amount", "Amount")}
                        </label>
                        <Input
                            type="number"
                            step="0.01"
                            value={data.amount}
                            onChange={(e) => setData("amount", e.target.value)}
                            max={invoice.balance_due}
                            required
                        />
                        {errors.amount && (
                            <p className="text-sm text-error">
                                {errors.amount}
                            </p>
                        )}
                        <p className="text-xs text-text-muted">
                            {safeT(
                                "invoices.fields.balance_due",
                                "Balance Due"
                            )}
                            : {formatCurrency(invoice.balance_due)}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">
                            {safeT(
                                "reports.revenue.fields.payment_method",
                                "Payment Method"
                            )}
                        </label>
                        <Select
                            value={data.payment_method}
                            onChange={(e) =>
                                setData("payment_method", e.target.value)
                            }
                            options={[
                                { label: "Cash", value: "cash" },
                                { label: "Card", value: "card" },
                                {
                                    label: "Bank Transfer",
                                    value: "bank_transfer",
                                },
                            ]}
                        />
                        {errors.payment_method && (
                            <p className="text-sm text-error">
                                {errors.payment_method}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">
                            {safeT("POS.payment.reference_label", "Reference")}
                        </label>
                        <Input
                            type="text"
                            value={data.reference}
                            onChange={(e) =>
                                setData("reference", e.target.value)
                            }
                            placeholder="Optional reference number"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsPaymentModalOpen(false)}
                        >
                            {safeT("common.cancel", "Cancel")}
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={processing}
                        >
                            {processing
                                ? safeT("common.processing", "Processing...")
                                : safeT("POS.add_payment", "Add Payment")}
                        </Button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
