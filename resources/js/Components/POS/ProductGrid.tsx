import React from "react";
import { Plus, Package, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePage } from "@inertiajs/react";
import { Badge } from "@/Components/UI/Badge";

interface Product {
    id: number;
    type: "frame" | "lens" | "contact_lens" | "service";
    name: string;
    price: number | string;
    stock: number | null;
    meta: string;
}

interface ProductGridProps {
    products: Product[];
    isSearching: boolean;
    searchQuery: string;
    onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    isSearching,
    searchQuery,
    onAddToCart,
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

    const getTypeBadgeVariant = (type: string): "info" | "neutral" | "success" | "warning" => {
        switch (type) {
            case "frame":
                return "info";
            case "lens":
                return "neutral";
            case "contact_lens":
                return "warning";
            case "service":
                return "success";
            default:
                return "neutral";
        }
    };

    if (isSearching) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-default"></div>
            </div>
        );
    }

    if (products.length > 0) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                    <button
                        key={`${product.type}-${product.id}`}
                        onClick={() => onAddToCart(product)}
                        className="flex flex-col text-start p-4 rounded-xl border border-border-default bg-bg-base hover:border-primary-default hover:bg-primary-subtle transition-all group relative overflow-hidden"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <Badge variant={getTypeBadgeVariant(product.type)} className="text-[10px] uppercase">
                                {t(`POS.products.types.${product.type}`)}
                            </Badge>
                            {product.stock !== null && (
                                <span
                                    className={`text-xs ${
                                        product.stock <= 2
                                            ? "text-error font-bold"
                                            : "text-text-muted"
                                    }`}
                                >
                                    {t("POS.products.stock")}: {product.stock}
                                </span>
                            )}
                        </div>
                        <h3 className="font-bold text-text-default mb-1 line-clamp-2">
                            {product.name}
                        </h3>
                        <p className="text-xs text-text-muted mb-3 line-clamp-1">
                            {product.meta}
                        </p>
                        <div className="mt-auto pt-2 border-t border-border-subtle flex items-center justify-between">
                            <span className="text-lg font-black text-primary-default">
                                {formatCurrency(Number(product.price))}
                            </span>
                            <div className="bg-primary-subtle text-primary-strong p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <Plus className="w-5 h-5" />
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        );
    }

    if (searchQuery.length >= 2) {
        return (
            <div className="text-center py-12">
                <Package className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-20" />
                <p className="text-text-muted">
                    {t("POS.products.no_results", { query: searchQuery })}
                </p>
            </div>
        );
    }

    return (
        <div className="text-center py-12">
            <Info className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-20" />
            <p className="text-text-muted">{t("POS.products.search_hint")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-bg-subtle text-text-muted rounded-full text-sm">
                    {t("POS.products.types.frame")}
                </span>
                <span className="px-3 py-1 bg-bg-subtle text-text-muted rounded-full text-sm">
                    {t("POS.products.types.lens")}
                </span>
                <span className="px-3 py-1 bg-bg-subtle text-text-muted rounded-full text-sm">
                    {t("POS.products.types.contact_lens")}
                </span>
            </div>
        </div>
    );
};

export default ProductGrid;
