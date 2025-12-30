import React from "react";
import { Link } from "@inertiajs/react";
import { Skeleton } from "./Skeleton";

// Export Column interface for use in pages with proper typing
export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyField: keyof T;
    isLoading?: boolean;
    emptyMessage?: string;
    meta?: {
        current_page: number;
        from: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export function DataTable<T>({
    columns,
    data,
    keyField,
    isLoading = false,
    emptyMessage = "No data found",
    meta,
}: DataTableProps<T>) {
    return (
        <div className="bg-bg-primary rounded-xl border border-border-default shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border-default">
                    <thead className="bg-bg-muted">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={`px-6 py-3 text-start text-xs font-medium text-text-secondary uppercase tracking-wider ${
                                        column.className || ""
                                    }`}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                    {columns.map((_, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className="px-6 py-4"
                                        >
                                            <Skeleton className="h-4 w-3/4" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-10 text-center text-text-muted"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr
                                    key={String(item[keyField])}
                                    className="hover:bg-bg-muted/50 transition-colors"
                                >
                                    {columns.map((column, index) => (
                                        <td
                                            key={index}
                                            className={`px-6 py-4 whitespace-nowrap text-sm text-text-primary ${
                                                column.className || ""
                                            }`}
                                        >
                                            {typeof column.accessor ===
                                            "function"
                                                ? column.accessor(item)
                                                : (item[
                                                      column.accessor
                                                  ] as React.ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {meta && meta.links && meta.links.length > 3 && (
                <div className="px-6 py-4 bg-bg-muted/50 border-t border-border-default flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                        {meta.links[0].url ? (
                            <Link
                                href={meta.links[0].url as string}
                                className="relative inline-flex items-center px-4 py-2 border border-border-default text-sm font-medium rounded-md text-text-primary bg-bg-primary hover:bg-bg-muted"
                            >
                                Previous
                            </Link>
                        ) : (
                            <span className="relative inline-flex items-center px-4 py-2 border border-border-default text-sm font-medium rounded-md text-text-muted bg-bg-primary cursor-not-allowed">
                                Previous
                            </span>
                        )}
                        {meta.links[meta.links.length - 1].url ? (
                            <Link
                                href={
                                    meta.links[meta.links.length - 1]
                                        .url as string
                                }
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-border-default text-sm font-medium rounded-md text-text-primary bg-bg-primary hover:bg-bg-muted"
                            >
                                Next
                            </Link>
                        ) : (
                            <span className="ml-3 relative inline-flex items-center px-4 py-2 border border-border-default text-sm font-medium rounded-md text-text-muted bg-bg-primary cursor-not-allowed">
                                Next
                            </span>
                        )}
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-text-secondary">
                                Showing{" "}
                                <span className="font-medium">{meta.from}</span>{" "}
                                to{" "}
                                <span className="font-medium">{meta.to}</span>{" "}
                                of{" "}
                                <span className="font-medium">
                                    {meta.total}
                                </span>{" "}
                                results
                            </p>
                        </div>
                        <div>
                            <nav
                                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                aria-label="Pagination"
                            >
                                {meta.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        className={`relative inline-flex items-center px-4 py-2 border border-border-default text-sm font-medium transition-colors ${
                                            link.active
                                                ? "z-10 bg-interactive-primary border-interactive-primary text-white"
                                                : "bg-bg-primary text-text-primary hover:bg-bg-muted"
                                        } ${
                                            index === 0 ? "rounded-l-md" : ""
                                        } ${
                                            index === meta.links.length - 1
                                                ? "rounded-r-md"
                                                : ""
                                        } ${
                                            !link.url
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                    />
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
