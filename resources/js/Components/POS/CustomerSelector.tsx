import React from "react";
import { UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    phone?: string;
}

interface CustomerSelectorProps {
    customers: Customer[];
    selectedCustomer: Customer | null;
    onSelect: (customer: Customer | null) => void;
}

const CustomerSelector: React.FC<CustomerSelectorProps> = ({
    customers,
    selectedCustomer,
    onSelect,
}) => {
    const { t } = useTranslation();

    return (
        <div className="p-4 border-b border-border-default bg-bg-base">
            <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-text-default flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-text-muted" />
                    {t("POS.customer.label")}
                </h2>
                {selectedCustomer && (
                    <button
                        onClick={() => onSelect(null)}
                        className="text-xs text-error hover:underline"
                    >
                        {t("POS.customer.change")}
                    </button>
                )}
            </div>

            {!selectedCustomer ? (
                <select
                    className="w-full rounded-lg border-border-default bg-bg-base text-text-default focus:ring-primary-500 focus:border-primary-500"
                    onChange={(e) => {
                        const customer = customers.find(
                            (c) => c.id === parseInt(e.target.value)
                        );
                        if (customer) onSelect(customer);
                    }}
                    value=""
                >
                    <option value="" disabled>
                        {t("POS.customer.placeholder")}
                    </option>
                    {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.first_name} {c.last_name}{" "}
                            {c.phone ? `(${c.phone})` : ""}
                        </option>
                    ))}
                </select>
            ) : (
                <div className="p-3 bg-primary-subtle border border-primary-default/10 rounded-lg">
                    <p className="font-bold text-primary-strong">
                        {selectedCustomer.first_name}{" "}
                        {selectedCustomer.last_name}
                    </p>
                    {selectedCustomer.phone && (
                        <p className="text-sm text-primary-default">
                            {selectedCustomer.phone}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomerSelector;
