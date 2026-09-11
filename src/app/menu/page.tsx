'use client';

import { useEffect, useState } from 'react';
import { getCategories, getMenuItems, getStoreSettings, createBill } from '@/lib/data-service';
import { Category, MenuItem, StoreSettings, CartItem, PaymentMode } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { 
  Search, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CheckCircle2, 
  ArrowLeft, 
  Receipt, 
  X,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function PublicMenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedBillId, setCompletedBillId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getCategories(), getMenuItems(), getStoreSettings()]).then(([cats, its, sets]) => {
      setCategories(cats);
      setItems(its);
      setSettings(sets);
    });
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((ci) =>
          ci.menuItem.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
        );
      }
      return prev.filter((ci) => ci.menuItem.id !== itemId);
    });
  };

  const handleGenerateBill = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      const bill = await createBill({
        customer_name: customerName,
        customer_phone: customerPhone,
        cartItems: cart,
        discount_amount: 0,
        tax_rate_percent: settings?.tax_rate_percent || 0,
        payment_mode: paymentMode,
        payment_status: 'paid',
      });

      toast.success(`Bill #${bill.bill_number} generated successfully!`);
      setCompletedBillId(bill.id);
      setCart([]);
      setIsCheckoutOpen(false);
    } catch {
      toast.error('Failed to generate bill');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartSubtotal = cart.reduce((sum, ci) => sum + ci.menuItem.price * ci.quantity, 0);
  const totalCartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);
  const sym = settings?.currency_symbol || '₹';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Header Banner */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-black text-slate-900">{settings?.restaurant_name || 'Restaurant Digital Menu'}</h1>
              <p className="text-xs text-indigo-600 font-bold">Public Mobile Digital Menu</p>
            </div>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition"
          >
            <Lock className="w-3 h-3 text-indigo-600" /> Staff Login
          </Link>
        </div>

        {/* Category Tabs Scroll */}
        <div className="max-w-3xl mx-auto px-4 pb-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            All Items ({items.length})
          </button>
          {categories.map((cat) => {
            const count = items.filter((i) => i.category_id === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search food, beverages, desserts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 shadow-sm"
          />
        </div>

        {/* Success Banner if bill generated */}
        {completedBillId && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 text-sm">Bill Generated Successfully!</p>
                <p className="text-xs text-emerald-700">Your order has been recorded into POS.</p>
              </div>
            </div>
            <Link
              href={`/print/bill/${completedBillId}`}
              target="_blank"
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm"
            >
              <Receipt className="w-3.5 h-3.5" /> View Receipt
            </Link>
          </div>
        )}

        {/* Text-Only Food Items List */}
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const inCart = cart.find((ci) => ci.menuItem.id === item.id);

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-2xl p-4 flex items-center justify-between gap-4 transition shadow-sm ${
                  !item.is_available ? 'opacity-60 border-slate-200' : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base">{item.name}</h3>
                    {!item.is_available && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">
                        Sold Out
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.description}</p>
                  )}
                  <p className="text-base font-black text-indigo-600 pt-1">
                    {formatCurrency(item.price, sym)}
                  </p>
                </div>

                {/* Add / Remove buttons */}
                <div>
                  {item.is_available ? (
                    inCart ? (
                      <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl p-1">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 flex items-center justify-center transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-black w-5 text-center text-slate-900">{inCart.quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 px-3.5 py-2 rounded-xl text-xs font-bold transition"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    )
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Bottom Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 z-40 shadow-lg">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold">{totalCartCount} items selected</p>
              <p className="text-xl font-black text-slate-900">{formatCurrency(cartSubtotal, sym)}</p>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm px-6 py-3 rounded-xl shadow-md shadow-indigo-600/20 transition"
            >
              <ShoppingBag className="w-4 h-4" /> Generate Bill
            </button>
          </div>
        </div>
      )}

      {/* Modal Checkout */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" /> Checkout & Generate Bill
              </h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['upi', 'cash', 'card'] as PaymentMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase border transition ${
                        paymentMode === mode
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartSubtotal, sym)}</span>
                </div>
                {(settings?.tax_rate_percent || 0) > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Tax ({(settings?.tax_rate_percent || 0)}%)</span>
                    <span>{formatCurrency(cartSubtotal * ((settings?.tax_rate_percent || 0) / 100), sym)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-900 text-sm pt-1 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="text-indigo-600">
                    {formatCurrency(cartSubtotal * (1 + (settings?.tax_rate_percent || 0) / 100), sym)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleGenerateBill}
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Generating Bill...' : 'Confirm & Print Bill'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
