import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    MagnifyingGlassIcon,
    UserPlusIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { Link } from "@inertiajs/react";

interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
}

interface Props {
    onSelect: (customer: Customer) => void;
    placeholder?: string;
    className?: string;
}

export default function CustomerSearch({
    onSelect,
    placeholder,
    className = "",
}: Props) {
    const { t } = useTranslation();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchTimeout = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const searchCustomers = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(
                route("business.customers.search"),
                {
                    params: { query: searchQuery },
                }
            );
            setResults(response.data);
            setIsOpen(true);
        } catch (error) {
            console.error("Error searching customers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            searchCustomers(value);
        }, 300);
    };

    const handleSelect = (customer: Customer) => {
        onSelect(customer);
        setQuery(`${customer.first_name} ${customer.last_name}`);
        setIsOpen(false);
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full ps-10 pe-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    placeholder={
                        placeholder || t("customers.search_placeholder")
                    }
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() =>
                        query && results.length > 0 && setIsOpen(true)
                    }
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 end-0 pe-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {loading ? (
                        <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                            {t("common.searching")}...
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            {results.map((customer) => (
                                <button
                                    key={customer.id}
                                    onClick={() => handleSelect(customer)}
                                    className="w-full text-start px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors flex flex-col"
                                >
                                    <span className="font-medium">
                                        {customer.first_name}{" "}
                                        {customer.last_name}
                                    </span>
                                    <span className="text-xs opacity-80">
                                        {customer.phone}
                                    </span>
                                </button>
                            ))}
                        </>
                    ) : query.length > 0 ? (
                        <div className="px-4 py-3 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                {t("customers.no_results_found")}
                            </p>
                            <Link
                                href={route("business.customers.create")}
                                className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                            >
                                <UserPlusIcon className="h-4 w-4 me-1" />
                                {t("customers.add_new")}
                            </Link>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
