import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from "react-i18next";
import { Button } from "@/Components/UI/Button";
import { Badge } from "@/Components/UI/Badge";
import { Card } from "@/Components/UI/Card";
import { DataTable } from "@/Components/UI/DataTable";
import {
    Plus,
    Search,
    User,
    Mail,
    Shield,
    Edit2,
    Users,
    UserCheck,
    UserX,
    Eye,
    FileText,
} from "lucide-react";
import { StatCard } from "@/Components/Charts/StatCard";
import { exportToCSV } from "@/Utils/csvExport";

interface Staff {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    branch?: {
        name: string;
    };
}

interface IndexProps {
    staff: {
        data: Staff[];
        links: any;
    };
    filters: {
        search?: string;
        role?: string;
    };
    stats?: {
        total: number;
        active: number;
        inactive: number;
        byRole: Record<string, number>;
    };
}

export default function Index({ staff, filters, stats }: IndexProps) {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState(filters?.search || "");
    const [activeRole, setActiveRole] = useState(filters?.role || "all");

    const handleSearch = (value: string) => {
        setSearchValue(value);
        setTimeout(() => {
            router.get(
                route("business.staff.index"),
                {
                    search: value,
                    role: activeRole !== "all" ? activeRole : undefined,
                },
                { preserveState: true, replace: true }
            );
        }, 300);
    };

    const handleRoleFilter = (role: string) => {
        setActiveRole(role);
        router.get(
            route("business.staff.index"),
            { search: searchValue, role: role !== "all" ? role : undefined },
            { preserveState: true, replace: true }
        );
    };

    const toggleStatus = (id: number) => {
        router.post(route("business.staff.toggle-status", id));
    };

    const handleExportCSV = () => {
        const headers = [
            t("business.staff.fields.name"),
            t("business.staff.fields.email"),
            t("business.staff.fields.role"),
            t("business.staff.fields.branch"),
            t("business.staff.fields.status"),
        ];

        const data = staff.data.map((member) => [
            member.name,
            member.email,
            getRoleLabel(member.role),
            member.branch?.name || "-",
            member.is_active
                ? t("common.status.active")
                : t("common.status.inactive"),
        ]);

        exportToCSV(data, "staff-list", headers);
    };

    const roleTabs = [
        { key: "all", label: "All Staff" },
        { key: "optometrist", label: "Optometrists" },
        { key: "sales_staff", label: "Sales Staff" },
        { key: "lab_technician", label: "Lab Technicians" },
    ];

    const getRoleLabel = (role: string) => {
        const labels: Record<string, string> = {
            business_owner: "Owner",
            optometrist: "Optometrist",
            sales_staff: "Sales Staff",
            lab_technician: "Lab Tech",
        };
        return labels[role] || role;
    };

    const columns = [
        {
            header: t("business.staff.fields.name"),
            accessor: (member: Staff) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-default/20 to-primary-default/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary-default">
                            {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-text-primary">
                            {member.name}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-text-muted">
                            <Mail className="w-3 h-3" />
                            {member.email}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: t("business.staff.fields.role"),
            accessor: (member: Staff) => (
                <Badge variant="info">{getRoleLabel(member.role)}</Badge>
            ),
        },
        {
            header: t("business.staff.fields.branch"),
            accessor: (member: Staff) => (
                <span className="text-sm text-text-secondary">
                    {member.branch?.name || "-"}
                </span>
            ),
        },
        {
            header: t("business.staff.fields.status"),
            accessor: (member: Staff) => (
                <button
                    onClick={() => toggleStatus(member.id)}
                    className="hover:opacity-80 transition-opacity"
                >
                    <Badge variant={member.is_active ? "success" : "danger"}>
                        {member.is_active
                            ? t("common.status.active")
                            : t("common.status.inactive")}
                    </Badge>
                </button>
            ),
        },
        {
            header: t("common.actions.title"),
            accessor: (member: Staff) => (
                <div className="flex justify-end gap-2">
                    <Link href={route("business.staff.edit", member.id)}>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={t("business.staff.index.title")} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-text-primary tracking-tight">
                            {t("business.staff.index.title")}
                        </h1>
                        <p className="text-text-muted text-sm mt-1">
                            {t("business.staff.index.subtitle")}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={route("business.staff.create")}>
                            <Button className="flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                {t("business.staff.index.create_btn")}
                            </Button>
                        </Link>
                        <Button
                            variant="secondary"
                            onClick={handleExportCSV}
                            className="flex items-center gap-2"
                        >
                            <FileText className="w-4 h-4" />
                            {t("common.actions.export")}
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Staff"
                        value={stats?.total || staff.data.length}
                        icon={Users}
                        color="primary"
                    />
                    <StatCard
                        title="Active"
                        value={
                            stats?.active ||
                            staff.data.filter((s) => s.is_active).length
                        }
                        icon={UserCheck}
                        color="success"
                    />
                    <StatCard
                        title="Inactive"
                        value={
                            stats?.inactive ||
                            staff.data.filter((s) => !s.is_active).length
                        }
                        icon={UserX}
                        color="danger"
                    />
                    <StatCard
                        title="Optometrists"
                        value={
                            stats?.byRole?.optometrist ||
                            staff.data.filter((s) => s.role === "optometrist")
                                .length
                        }
                        icon={Shield}
                        color="info"
                    />
                </div>

                {/* Role Filter Tabs */}
                <Card className="p-2">
                    <div className="flex flex-wrap gap-2">
                        {roleTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleRoleFilter(tab.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    activeRole === tab.key
                                        ? "bg-primary-default text-white"
                                        : "bg-bg-subtle text-text-muted hover:bg-bg-subtle/80 hover:text-text-primary"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Search */}
                <Card className="p-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="text"
                            placeholder={t("common.search")}
                            className="w-full ps-10 pe-4 py-2 bg-bg-base border border-border-default rounded-lg focus:ring-2 focus:ring-interactive-primary focus:border-transparent transition-all"
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </Card>

                {/* Table */}
                <Card className="overflow-hidden border-none shadow-sm">
                    <DataTable
                        columns={columns}
                        data={staff.data}
                        meta={staff.links}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
