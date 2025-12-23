import React from "react";
import { Link } from "@inertiajs/react";
import { Skeleton } from "./Skeleton";

interface Column<T> {
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
}

export function DataTable<T>({
    columns,
    data,
    keyField,
    isLoading = false,
    emptyMessage = "No data found",
}: DataTableProps<T>) {
    return (
        <div className="bg-bg-primary rounded-xl border border-border-subtle shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border-subtle">
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
                    <tbody className="divide-y divide-border-subtle">
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
        </div>
    );
}
