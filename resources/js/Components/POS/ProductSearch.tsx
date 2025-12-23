import React from "react";
import { Search } from "lucide-react";
import ProductGrid from "./ProductGrid";
import { useTranslation } from "react-i18next";

interface Product {
    id: number;
    type: "frame" | "lens" | "contact_lens" | "service";
    name: string;
    price: number | string;
    stock: number | null;
    meta: string;
}

interface ProductSearchProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: Product[];
    isSearching: boolean;
    onAddToCart: (product: Product) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    onAddToCart,
}) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col h-full bg-bg-base">
            <div className="p-4 border-b border-border-default">
                <div className="relative">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                    <input
                        type="text"
                        className="w-full ps-10 pe-4 py-3 rounded-lg border-border-default bg-bg-base text-text-default focus:ring-primary-500 focus:border-primary-500 text-lg"
                        placeholder={t("POS.search.placeholder")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <ProductGrid
                    products={searchResults}
                    isSearching={isSearching}
                    searchQuery={searchQuery}
                    onAddToCart={onAddToCart}
                />
            </div>
        </div>
    );
};

export default ProductSearch;
