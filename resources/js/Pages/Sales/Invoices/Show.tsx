import React from "react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Badge } from "@/Components/UI/Badge";
import { Card } from "@/Components/UI/Card";
import { Button } from "@/Components/UI/Button";
import { DataTable } from "@/Components/UI/DataTable";
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
        pending: { label: t("invoices.status.pending"), variant: "warning" },
        partial: { label: t("invoices.status.partial"), variant: "info" },
        paid: { label: t("invoices.status.paid"), variant: "success" },
        overdue: { label: t("invoices.status.overdue"), variant: "danger" },
        deposit_paid: { label: t("invoices.status.partial"), variant: "info" },
        completed: { label: t("invoices.status.paid"), variant: "success" },
        cancelled: { label: t("common.status.inactive"), variant: "danger" },
    };

    const status = statusMap[invoice.status] || {
        label: invoice.status,
        variant: "default",
    };

    const itemColumns = [
        {
            header: t("invoices.show.items"),
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
            header: t("common.qty"),
            className: "text-center",
            accessor: (item: any) => (
                <span className="text-text-primary">{item.quantity}</span>
            ),
        },
        {
            header: t("common.price"),
            className: "text-right",
            accessor: (item: any) => (
                <span className="text-text-primary">
                    {formatCurrency(item.unit_price)}
                </span>
            ),
        },
        {
            header: t("invoices.show.discount"),
            className: "text-right",
            accessor: (item: any) => (
                <span className="text-interactive-error">
                    -{formatCurrency(item.discount)}
                </span>
            ),
        },
        {
            header: t("common.total"),
            className: "text-right",
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
                title={`${t("invoices.show.title")} - ${
                    invoice.invoice_number
                }`}
            />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("business.sales.invoices.index")}
                            className="p-2 hover:bg-bg-secondary rounded-lg transition-colors text-text-muted"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-text-primary">
                                    {invoice.invoice_number}
                                </h1>
                                <Badge variant={status.variant}>
                                    {status.label}
                                </Badge>
                            </div>
                            <p className="text-text-muted">
                                {format(new Date(invoice.created_at), "PPP", {
                                    locale: currentLocale,
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="gap-2">
                            <Printer className="w-4 h-4" />
                            {t("common.print")}
                        </Button>
                        <Button variant="primary" className="gap-2">
                            <CreditCard className="w-4 h-4" />
                            {t("POS.add_payment")}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Items and History */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Items Table */}
                        <div className="space-y-4">
                            <Card className="p-0 overflow-hidden border-none shadow-sm ring-1 ring-border-default">
                                <div className="px-6 py-4 border-b border-border-default bg-bg-secondary/30">
                                    <h3 className="font-bold text-text-primary flex items-center gap-2">
                                        <Package className="w-5 h-5 text-interactive-primary" />
                                        {t("invoices.show.items")}
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
                                <Card className="w-full md:w-80 p-6 space-y-3 bg-bg-secondary/20">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-muted">
                                            {t("invoices.show.subtotal")}
                                        </span>
                                        <span className="font-medium text-text-primary">
                                            {formatCurrency(invoice.subtotal)}
                                        </span>
                                    </div>
                                    {parseFloat(invoice.discount_amount) >
                                        0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-interactive-error">
                                                {t("invoices.show.discount")}
                                            </span>
                                            <span className="font-medium text-interactive-error">
                                                -
                                                {formatCurrency(
                                                    invoice.discount_amount
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    <div className="pt-3 border-t border-border-default flex justify-between items-baseline">
                                        <span className="font-bold text-text-primary">
                                            {t("invoices.show.grand_total")}
                                        </span>
                                        <span className="text-xl font-black text-interactive-primary">
                                            {formatCurrency(invoice.total)}
                                        </span>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Payments History */}
                        <Card className="p-0 overflow-hidden border-none shadow-sm ring-1 ring-border-default">
                            <div className="px-6 py-4 border-b border-border-default bg-bg-secondary/30">
                                <h3 className="font-bold text-text-primary flex items-center gap-2">
                                    <History className="w-5 h-5 text-interactive-primary" />
                                    {t("invoices.show.payments")}
                                </h3>
                            </div>
                            <div className="p-6">
                                {invoice.payments.length === 0 ? (
                                    <div className="text-center py-10 bg-bg-secondary/20 rounded-xl border-2 border-dashed border-border-default">
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
                                                    className="flex items-center justify-between p-4 bg-bg-secondary/30 rounded-xl border border-border-default hover:border-interactive-primary/30 transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-border-default">
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
                                                    <div className="text-right">
                                                        <div className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1 opacity-60">
                                                            {t(
                                                                "reports.revenue.fields.received_by"
                                                            )}
                                                        </div>
                                                        <div className="text-sm font-semibold text-text-primary bg-white px-3 py-1 rounded-lg border border-border-default shadow-sm">
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
                        <Card className="p-6 border-none shadow-sm ring-1 ring-border-default">
                            <h3 className="font-bold text-text-primary mb-5 flex items-center gap-2 border-b border-border-default pb-3">
                                <User className="w-5 h-5 text-interactive-primary" />
                                {t("invoices.fields.customer")}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1 opacity-60">
                                        {t("customers.fields.name")}
                                    </div>
                                    <div className="font-bold text-text-primary text-lg">
                                        {invoice.customer.first_name}{" "}
                                        {invoice.customer.last_name}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1 opacity-60">
                                        {t("customers.fields.phone")}
                                    </div>
                                    <div className="text-text-primary font-medium">
                                        {invoice.customer.phone || "N/A"}
                                    </div>
                                </div>
                                <Link
                                    href={route(
                                        "business.customers.show",
                                        invoice.customer.id
                                    )}
                                    className="inline-flex items-center gap-2 text-interactive-primary font-bold text-sm hover:translate-x-1 transition-transform mt-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    {t("customers.profile_details")} →
                                </Link>
                            </div>
                        </Card>

                        {/* Financial Summary */}
                        <Card className="bg-interactive-primary p-7 text-white shadow-xl shadow-interactive-primary/20 border-none relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <DollarSign className="w-24 h-24 -mr-8 -mt-8" />
                            </div>
                            <h3 className="font-bold text-white/60 mb-6 flex items-center gap-2 border-b border-white/10 pb-3 uppercase text-[10px] tracking-[0.2em]">
                                {t("reports.revenue.summary")}
                            </h3>
                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/70 font-medium">
                                        {t("invoices.fields.total")}
                                    </span>
                                    <span className="text-2xl font-black">
                                        {formatCurrency(invoice.total)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/70 font-medium">
                                        {t("invoices.fields.amount_paid")}
                                    </span>
                                    <span className="text-xl font-bold">
                                        {formatCurrency(invoice.amount_paid)}
                                    </span>
                                </div>
                                <div className="pt-5 border-t border-white/10 flex justify-between items-center">
                                    <span className="font-bold text-lg">
                                        {t("invoices.fields.balance_due")}
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
                        <Card className="p-6 border-none shadow-sm ring-1 ring-border-default bg-bg-secondary/20">
                            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2 border-b border-border-default pb-3 text-sm">
                                <MapPin className="w-4 h-4 text-interactive-primary" />
                                {t("business.branches.hq")}
                            </h3>
                            <div className="text-sm font-bold text-text-primary bg-white px-3 py-2 rounded-lg border border-border-default shadow-sm inline-block">
                                {invoice.branch.name}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
