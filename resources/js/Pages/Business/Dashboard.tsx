import React from "react";
import { Head, Link } from "@inertiajs/react";
import { AuthenticatedLayout } from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";
import { Card } from "@/Components/UI/Card";
import { Badge } from "@/Components/UI/Badge";
import { Button } from "@/Components/UI/Button";
import {
    TrendingUp,
    Clock,
    Users,
    DollarSign,
    AlertTriangle,
    Eye,
    Plus,
    FileText,
    Package,
    BarChart3,
    UserPlus,
} from "lucide-react";

interface Invoice {
    id: number;
    invoice_number: string;
    customer: {
        first_name: string;
        last_name: string;
    };
    total: string;
    balance_due: string;
    status: string;
    created_at: string;
}

interface DashboardProps {
    stats: {
        todaySales: number;
        pendingPickups: number;
        customersCount: number;
        totalRevenue?: number;
        outstandingBalance?: number;
        lowStockItems?: number;
        inLabOrders?: number;
    };
    recentInvoices: Invoice[];
}

export default function Dashboard({ stats, recentInvoices }: DashboardProps) {
    const { t } = useTranslation();

    const getStatusVariant = (status: string): "info" | "warning" | "success" | "danger" | "neutral" => {
        const variants: Record<string, "info" | "warning" | "success" | "danger" | "neutral"> = {
            deposit_paid: "info",
            in_lab: "warning",
            ready_pickup: "warning",
            completed: "success",
            cancelled: "danger",
        };
        return variants[status] || "neutral";
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            deposit_paid: "Deposit Paid",
            in_lab: "In Lab",
            ready_pickup: "Ready",
            completed: "Completed",
            cancelled: "Cancelled",
        };
        return labels[status] || status;
    };

    const formatCurrency = (value: number | string) => {
        const num = typeof value === "string" ? parseFloat(value) : value;
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
        }).format(num || 0);
    };

    return (
        <AuthenticatedLayout>
            <Head title={t("business.dashboard.title")} />

            <div className="space-y-6">
                {/* Header with Quick Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">
                            {t("business.dashboard.welcome")}
                        </h1>
                        <p className="text-text-muted text-sm mt-1">
                            Here's what's happening today
                        </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Link href="/business/customers/create">
                            <Button variant="secondary" className="flex items-center gap-2">
                                <UserPlus className="w-4 h-4" />
                                New Customer
                            </Button>
                        </Link>
                        <Link href="/business/sales/pos">
                            <Button className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                New Sale
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid - Primary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-5 transition-all hover:shadow-md group border-l-4 border-l-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Today's Sales</p>
                                <p className="text-2xl font-bold text-text-primary mt-1">
                                    {stats.todaySales}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 transition-all hover:shadow-md group border-l-4 border-l-amber-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Pending Pickup</p>
                                <p className="text-2xl font-bold text-text-primary mt-1">
                                    {stats.pendingPickups}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 transition-all hover:shadow-md group border-l-4 border-l-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Total Customers</p>
                                <p className="text-2xl font-bold text-text-primary mt-1">
                                    {stats.customersCount}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 transition-all hover:shadow-md group border-l-4 border-l-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">In Lab</p>
                                <p className="text-2xl font-bold text-text-primary mt-1">
                                    {stats.inLabOrders || 0}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-text-muted">Total Revenue</p>
                                <p className="text-xl font-bold text-text-primary">
                                    {formatCurrency(stats.totalRevenue || 0)}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-text-muted">Outstanding Balance</p>
                                <p className="text-xl font-bold text-red-600 dark:text-red-400">
                                    {formatCurrency(stats.outstandingBalance || 0)}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-text-muted">Low Stock Items</p>
                                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                                    {stats.lowStockItems || 0}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Recent Invoices Table */}
                <Card className="overflow-hidden">
                    <div className="p-4 border-b border-border-default flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Recent Invoices
                        </h3>
                        <Link href="/business/sales/invoices">
                            <Button variant="secondary" size="sm">
                                View All
                            </Button>
                        </Link>
                    </div>

                    {recentInvoices.length === 0 ? (
                        <div className="p-8 text-center">
                            <FileText className="w-12 h-12 mx-auto text-text-muted opacity-50" />
                            <p className="text-text-muted text-sm mt-2">
                                No invoices yet. Create your first sale!
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border-default">
                                <thead className="bg-bg-subtle">
                                    <tr>
                                        <th className="px-4 py-3 text-start text-xs font-medium text-text-muted uppercase tracking-wider">
                                            Invoice
                                        </th>
                                        <th className="px-4 py-3 text-start text-xs font-medium text-text-muted uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-4 py-3 text-start text-xs font-medium text-text-muted uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-4 py-3 text-start text-xs font-medium text-text-muted uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-4 py-3 text-start text-xs font-medium text-text-muted uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-end text-xs font-medium text-text-muted uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-default">
                                    {recentInvoices.slice(0, 5).map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-bg-subtle/50 transition-colors">
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm font-medium text-text-primary">
                                                    {invoice.invoice_number}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm text-text-secondary">
                                                    {invoice.customer?.first_name} {invoice.customer?.last_name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm text-text-muted">
                                                    {new Date(invoice.created_at).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm font-semibold text-text-primary">
                                                    {formatCurrency(invoice.total)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <Badge variant={getStatusVariant(invoice.status)}>
                                                    {getStatusLabel(invoice.status)}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-end">
                                                <Link href={`/business/sales/invoices/${invoice.id}`}>
                                                    <Button variant="secondary" size="sm">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                {/* Quick Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/business/customers" className="block">
                        <Card className="p-4 hover:shadow-md transition-all hover:border-interactive-primary cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-text-muted group-hover:text-interactive-primary transition-colors" />
                                <span className="text-sm font-medium text-text-primary">Customers</span>
                            </div>
                        </Card>
                    </Link>
                    <Link href="/business/inventory/frames" className="block">
                        <Card className="p-4 hover:shadow-md transition-all hover:border-interactive-primary cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <Package className="w-5 h-5 text-text-muted group-hover:text-interactive-primary transition-colors" />
                                <span className="text-sm font-medium text-text-primary">Inventory</span>
                            </div>
                        </Card>
                    </Link>
                    <Link href="/business/lab/job-cards" className="block">
                        <Card className="p-4 hover:shadow-md transition-all hover:border-interactive-primary cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-text-muted group-hover:text-interactive-primary transition-colors" />
                                <span className="text-sm font-medium text-text-primary">Lab Jobs</span>
                            </div>
                        </Card>
                    </Link>
                    <Link href="/business/reports" className="block">
                        <Card className="p-4 hover:shadow-md transition-all hover:border-interactive-primary cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="w-5 h-5 text-text-muted group-hover:text-interactive-primary transition-colors" />
                                <span className="text-sm font-medium text-text-primary">Reports</span>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
