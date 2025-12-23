import React from "react";
import { ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import CartItem from "./CartItem";

interface Item {
    cartId: string;
    name: string;
    price: number | string;
    quantity: number;
    total: number;
}

interface CartProps {
    items: Item[];
    onUpdateQuantity: (cartId: string, quantity: number) => void;
    onRemove: (cartId: string) => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onRemove }) => {
    const { t } = useTranslation();

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
                <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-20" />
                    <p className="text-text-muted">{t("POS.cart.empty")}</p>
                </div>
            ) : (
                items.map((item) => (
                    <CartItem
                        key={item.cartId}
                        item={item}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemove={onRemove}
                    />
                ))
            )}
        </div>
    );
};

export default Cart;
