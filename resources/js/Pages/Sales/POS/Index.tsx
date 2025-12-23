import React, { useState, useEffect, useMemo } from 'react';
import POSLayout from '@/Layouts/POSLayout';
import { useForm, router } from '@inertiajs/react';
import { 
  Search, 
  UserPlus, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  Tag, 
  Info,
  Package,
  Eye,
  Activity
} from 'lucide-react';
import axios from 'axios';
import { debounce } from 'lodash';

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  phone?: string;
}

interface Product {
  id: number;
  type: 'frame' | 'lens' | 'contact_lens' | 'service';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [depositAmount, setDepositAmount] = useState(0);

  // Debounced search
  const performSearch = useMemo(
    () => debounce(async (q: string) => {
      if (q.length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const response = await axios.get(route('business.sales.pos.search-products'), {
          params: { q }
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    performSearch(searchQuery);
  }, [searchQuery]);

  const addToCart = (product: Product) => {
    const cartId = `${product.type}-${product.id}`;
    const existingItem = cart.find(item => item.cartId === cartId);

    if (existingItem) {
      updateQuantity(cartId, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        ...product,
        cartId,
        quantity: 1,
        discount: 0,
        total: Number(product.price)
      };
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(cart.map(item => {
      if (item.cartId === cartId) {
        const total = (Number(item.price) * quantity) - item.discount;
        return { ...item, quantity, total };
      }
      return item;
    }));
  };

  const removeItem = (cartId: string) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const totalDiscount = cart.reduce((sum, item) => sum + item.discount, 0) + discountAmount;
  const total = subtotal - totalDiscount;

  const handleCheckout = () => {
    if (!selectedCustomer) {
      alert('Please select a customer');
      return;
    }
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    router.post(route('business.sales.pos.checkout'), {
      customer_id: selectedCustomer.id,
      branch_id: branches[0]?.id,
      items: cart.map(item => ({
        item_type: item.type,
        item_id: item.id,
        description: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        discount: item.discount,
        total: item.total
      })),
      discount_amount: discountAmount,
      total: total,
      initial_payment: {
        amount: depositAmount,
        payment_method: paymentMethod
      }
    });
  };

  return (
    <POSLayout title="New Sale">
      <div className="flex h-full">
        {/* Left Side: Product Search & Selection */}
        <div className="w-2/3 flex flex-col border-r border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500 text-lg"
                placeholder="Search products by brand, model, SKU, or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {isSearching ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((product) => (
                  <button
                    key={`${product.type}-${product.id}`}
                    onClick={() => addToCart(product)}
                    className="flex flex-col text-left p-4 rounded-xl border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        product.type === 'frame' ? 'bg-blue-100 text-blue-700' :
                        product.type === 'lens' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {product.type.replace('_', ' ')}
                      </span>
                      {product.stock !== null && (
                        <span className={`text-xs ${product.stock <= 2 ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                          Stock: {product.stock}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-1">{product.meta}</p>
                    <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-lg font-black text-primary-600">${product.price}</span>
                      <div className="bg-primary-100 text-primary-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-5 h-5" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery.length >= 2 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No products found matching "{searchQuery}"</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Info className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">Type at least 2 characters to search products</p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">Frames</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">Lenses</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">Contact Lenses</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Cart & Checkout */}
        <div className="w-1/3 flex flex-col bg-gray-50 shadow-inner">
          {/* Customer Selection */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-gray-400" />
                Customer
              </h2>
              {selectedCustomer && (
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Change
                </button>
              )}
            </div>
            
            {!selectedCustomer ? (
              <select 
                className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                onChange={(e) => {
                  const customer = customers.find(c => c.id === parseInt(e.target.value));
                  if (customer) setSelectedCustomer(customer);
                }}
                value=""
              >
                <option value="" disabled>Select a customer...</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.first_name} {c.last_name} {c.phone ? `(${c.phone})` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-primary-50 border border-primary-100 rounded-lg">
                <p className="font-bold text-primary-900">{selectedCustomer.first_name} {selectedCustomer.last_name}</p>
                {selectedCustomer.phone && <p className="text-sm text-primary-700">{selectedCustomer.phone}</p>}
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">Your cart is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartId} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500">${item.price} each</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.cartId)}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 text-gray-500"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium border-x border-gray-200 min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 text-gray-500"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="font-bold text-gray-900">${item.total.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Totals & Checkout */}
          <div className="p-4 bg-white border-t border-gray-200 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600">
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span>Discount</span>
                </div>
                <span>-${totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-black text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment & Checkout Buttons */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                    paymentMethod === 'cash' ? 'bg-green-50 border-green-600 text-green-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  Cash
                </button>
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                    paymentMethod === 'card' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Card
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Initial Payment (Deposit)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    className="w-full pl-7 py-2 rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                  />
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0 || !selectedCustomer}
                className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
              >
                Complete Checkout
                <span className="px-2 py-0.5 bg-primary-500 rounded text-sm">${total.toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </POSLayout>
  );
}
