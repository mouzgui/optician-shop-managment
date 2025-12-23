import React, { useState, useEffect, useMemo } from "react";
import POSLayout from "@/Layouts/POSLayout";
import { router, usePage } from "@inertiajs/react";
import axios from "axios";
import { debounce } from "lodash";
import ProductSearch from "@/Components/POS/ProductSearch";
import Cart from "@/Components/POS/Cart";
import CustomerSelector from "@/Components/POS/CustomerSelector";
import CheckoutSummary from "@/Components/POS/CheckoutSummary";
import PrescriptionSelector from "@/Components/POS/PrescriptionSelector";
import PaymentModal from "@/Components/POS/PaymentModal";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { enUS, arSA } from "date-fns/locale";

interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    phone?: string;
}

interface Prescription {
    id: number;
    type: "spectacle" | "contact_lens";
    date: string;
    doctor?: string;
    notes?: string;
}

interface Product {
    id: number;
    type: "frame" | "lens" | "contact_lens" | "service";
    name: string;
    price: number | string;
    stock: number | null;
    meta: string;
}

interface CartItem extends Product {
    cartId: string;
    quantity: number;
    discount: number;
    total: number;
}

interface Props {
    branches: { id: number; name: string }[];
    customers: Customer[];
}

export default function Index({ branches, customers }: Props) {
    const { t, i18n } = useTranslation();
    const { business } = usePage().props as any;

    const locales: Record<string, any> = { en: enUS, ar: arSA };
    const currentLocale = locales[i18n.language] || enUS;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(
            i18n.language === "ar" ? "ar-SA" : "en-US",
            {
                style: "currency",
                currency: business?.currency_code || "USD",
            }
        ).format(amount);
    };
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null
    );
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<
        number | null
    >(null);
    const [selectedPrescriptionType, setSelectedPrescriptionType] = useState<
        "spectacle" | "contact_lens" | null
    >(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [depositAmount, setDepositAmount] = useState(0);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // Debounced search
    const performSearch = useMemo(
        () =>
            debounce(async (q: string) => {
                if (q.length < 2) {
                    setSearchResults([]);
                    return;
                }
                setIsSearching(true);
                try {
                    const response = await axios.get(
                        route("business.sales.pos.search-products"),
                        {
                            params: { q },
                        }
                    );
                    setSearchResults(response.data);
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setIsSearching(false);
                }
            }, 300),
        []
    );

    useEffect(() => {
        performSearch(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        if (selectedCustomer) {
            fetchPrescriptions(selectedCustomer.id);
        } else {
            setPrescriptions([]);
            setSelectedPrescriptionId(null);
            setSelectedPrescriptionType(null);
        }
    }, [selectedCustomer]);

    const fetchPrescriptions = async (customerId: number) => {
        try {
            const response = await axios.get(
                route("business.sales.pos.customer-prescriptions", customerId)
            );
            setPrescriptions(response.data);
        } catch (error) {
            console.error("Failed to fetch prescriptions", error);
        }
    };

    const addToCart = (product: Product) => {
        const cartId = `${product.type}-${product.id}`;
        const existingItem = cart.find((item) => item.cartId === cartId);

        if (existingItem) {
            updateQuantity(cartId, existingItem.quantity + 1);
        } else {
            const newItem: CartItem = {
                ...product,
                cartId,
                quantity: 1,
                discount: 0,
                total: Number(product.price),
            };
            setCart([...cart, newItem]);
        }
    };

    const updateQuantity = (cartId: string, quantity: number) => {
        if (quantity < 1) return;
        setCart(
            cart.map((item) => {
                if (item.cartId === cartId) {
                    const total = Number(item.price) * quantity - item.discount;
                    return { ...item, quantity, total };
                }
                return item;
            })
        );
    };

    const removeItem = (cartId: string) => {
        setCart(cart.filter((item) => item.cartId !== cartId));
    };

    const subtotal = cart.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    );
    const totalDiscount =
        cart.reduce((sum, item) => sum + item.discount, 0) + discountAmount;
    const total = subtotal - totalDiscount;

    const handleCheckout = () => {
        if (!selectedCustomer) {
            toast.error(t("POS.errors.select_customer"));
            return;
        }
        if (cart.length === 0) {
            toast.error(t("POS.errors.cart_empty"));
            return;
        }
        setIsPaymentModalOpen(true);
    };

    const completeCheckout = (paymentData: any) => {
        router.post(route("business.sales.pos.checkout"), {
            customer_id: selectedCustomer?.id,
            branch_id: branches[0]?.id,
            items: cart.map((item) => ({
                item_type: item.type,
                item_id: item.id,
                description: item.name,
                quantity: item.quantity,
                unit_price: item.price,
                discount: item.discount,
                total: item.total,
            })),
            discount_amount: discountAmount,
            total: total,
            prescription_id: selectedPrescriptionId,
            prescription_type: selectedPrescriptionType,
            initial_payment: {
                amount: paymentData.amount,
                payment_method: paymentData.payment_method,
                reference: paymentData.reference,
                cash_amount: paymentData.cash_amount,
                card_amount: paymentData.card_amount,
            },
            notes: paymentData.reference,
        });
    };

    return (
        <POSLayout title={t("POS.title")}>
            <div className="flex h-full">
                {/* Left Side: Product Search & Selection */}
                <div className="w-2/3 flex flex-col border-r border-border-default bg-bg-base">
                    <ProductSearch
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        searchResults={searchResults}
                        isSearching={isSearching}
                        onAddToCart={addToCart}
                    />
                </div>

                {/* Right Side: Cart & Checkout */}
                <div className="w-1/3 flex flex-col bg-bg-subtle shadow-inner">
                    <CustomerSelector
                        customers={customers}
                        selectedCustomer={selectedCustomer}
                        onSelect={setSelectedCustomer}
                    />

                    <PrescriptionSelector
                        prescriptions={prescriptions}
                        selectedPrescriptionId={selectedPrescriptionId}
                        onSelect={(id, type) => {
                            setSelectedPrescriptionId(id);
                            setSelectedPrescriptionType(type);
                        }}
                    />

                    <Cart
                        items={cart}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeItem}
                    />

                    <CheckoutSummary
                        subtotal={subtotal}
                        totalDiscount={totalDiscount}
                        total={total}
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                        depositAmount={depositAmount}
                        setDepositAmount={setDepositAmount}
                        onCheckout={handleCheckout}
                        disabled={cart.length === 0 || !selectedCustomer}
                    />
                </div>
            </div>

            {isPaymentModalOpen && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onConfirm={completeCheckout}
                    total={total}
                    subtotal={subtotal}
                    totalDiscount={totalDiscount}
                    initialDeposit={depositAmount}
                />
            )}
        </POSLayout>
    );
}
