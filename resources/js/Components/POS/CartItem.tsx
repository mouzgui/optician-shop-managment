import React from "react";
import { Trash2, Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePage } from "@inertiajs/react";

interface CartItemProps {
    item: {
        cartId: string;
        name: string;
        price: number | string;
        quantity: number;
        total: number;
    };
    onUpdateQuantity: (cartId: string, quantity: number) => void;
    onRemove: (cartId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
    item,
    onUpdateQuantity,
    onRemove,
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
        <div className="bg-bg-base p-3 rounded-lg border border-border-default shadow-sm group">
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                    <h4 className="font-bold text-sm text-text-default line-clamp-1">
                        {item.name}
                    </h4>
                    <p className="text-xs text-text-muted">
                        {formatCurrency(Number(item.price))}{" "}
                        {t("POS.cart.each")}
                    </p>
                </div>
                <button
                    onClick={() => onRemove(item.cartId)}
                    className="text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center border border-border-default rounded-lg overflow-hidden">
                    <button
                        onClick={() =>
                            onUpdateQuantity(item.cartId, item.quantity - 1)
                        }
                        className="p-1 hover:bg-bg-subtle text-text-muted transition-colors"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 text-sm font-medium border-x border-border-default min-w-[40px] text-center text-text-default bg-bg-base">
                        {item.quantity}
                    </span>
                    <button
                        onClick={() =>
                            onUpdateQuantity(item.cartId, item.quantity + 1)
                        }
                        className="p-1 hover:bg-bg-subtle text-text-muted transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <span className="font-bold text-text-default">
                    {formatCurrency(item.total)}
                </span>
            </div>
        </div>
    );
};

export default CartItem;
