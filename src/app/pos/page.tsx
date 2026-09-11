'use client';

import { useEffect, useState } from 'react';
import { getCategories, getMenuItems, getStoreSettings, createBill } from '@/lib/data-service';
import { Category, MenuItem, StoreSettings, CartItem, PaymentMode, PaymentStatus } from '@/types/database';
import ItemCard from '@/components/pos/ItemCard';
import CartSidebar from '@/components/pos/CartSidebar';
import ProtectedGuard from '@/components/auth/ProtectedGuard';
import { logout } from '@/lib/auth';
import { Search, UtensilsCrossed, LayoutDashboard, Menu as MenuIcon, ArrowLeft, RefreshCw, LogOut, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

export default function PosPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, ts, sets] = await Promise.all([getCategories(), getMenuItems(), getStoreSettings()]);
      setCategories(cats);
      setItems(ts);
      setSettings(sets);
    } catch {
      toast.error('Failed to load menu items for POS');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddToCart = (item: MenuItem) => {
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

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.menuItem.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.menuItem.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleGenerateBill = async (params: {
    customer_name: string;
    customer_phone: string;
    discount_amount: number;
    payment_mode: PaymentMode;
    payment_status: PaymentStatus;
  }) => {
    try {
      const bill = await createBill({
        customer_name: params.customer_name,
        customer_phone: params.customer_phone,
        cartItems: cart,
        discount_amount: params.discount_amount,
        tax_rate_percent: settings?.tax_rate_percent || 0,
        payment_mode: params.payment_mode,
        payment_status: params.payment_status,
      });

      toast.success(`Bill #${bill.bill_number} Created Successfully!`);
      setCart([]);
      setIsMobileCartOpen(false);

      window.open(`/print/bill/${bill.id}`, '_blank', 'width=400,height=600');
    } catch {
      toast.error('Failed to create bill');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sym = settings?.currency_symbol || '₹';
  const totalCartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);
  const cartSubtotal = cart.reduce((sum, ci) => sum + (ci.customPrice ?? ci.menuItem.price) * ci.quantity, 0);

  return (
    <ProtectedGuard>
      <div className="h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row overflow-hidden select-none relative">
        
        {/* Main Billing Grid Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* POS Header Navbar */}
          <header className="bg-white border-b border-slate-200 p-3 sm:p-4 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2.5">
              <Link href="/" className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">Counter POS Terminal</h1>
                <p className="text-[10px] sm:text-xs text-indigo-600 font-bold truncate max-w-[150px] sm:max-w-none">
                  {settings?.restaurant_name || 'Restaurant'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={loadData}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
                title="Refresh Menu Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <Link
                href="/admin"
                className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 px-2.5 sm:px-3.5 py-2 rounded-xl border border-slate-200 transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Admin</span>
              </Link>

              <Link
                href="/menu"
                target="_blank"
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 sm:px-3.5 py-2 rounded-xl border border-indigo-200 transition"
              >
                <MenuIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Public Menu</span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition border border-rose-200"
                title="Logout Staff Session"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </header>

          {/* Toolbar: Search + Category Pills */}
          <div className="p-3 sm:p-4 bg-white border-b border-slate-200 space-y-2.5 shrink-0">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search food by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900'
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Food Items Selection Grid */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-slate-50 pb-20 md:pb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-3.5">
              {filteredItems.map((item) => {
                const cartCount = cart.find((ci) => ci.menuItem.id === item.id)?.quantity || 0;
                return (
                  <ItemCard
                    key={item.id}
                    item={item}
                    currencySymbol={sym}
                    onAddToCart={handleAddToCart}
                    cartCount={cartCount}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Bottom Bar on Mobile (Triggers Mobile Cart Drawer) */}
        {cart.length > 0 && (
          <div className="md:hidden fixed bottom-3 left-3 right-3 z-30">
            <button
              onClick={() => setIsMobileCartOpen(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-2xl shadow-xl font-extrabold text-sm flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <span>View Current Order ({totalCartCount} items)</span>
              </div>
              <span className="text-base font-black bg-indigo-700 px-3 py-1 rounded-xl">
                {formatCurrency(cartSubtotal, sym)}
              </span>
            </button>
          </div>
        )}

        {/* Mobile Slide-Up Cart Drawer Sheet */}
        {isMobileCartOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end"
            onClick={() => setIsMobileCartOpen(false)}
          >
            <div
              className="w-full h-5/6 bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <CartSidebar
                cart={cart}
                settings={settings}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
                onCloseMobileCart={() => setIsMobileCartOpen(false)}
                onGenerateBill={handleGenerateBill}
              />
            </div>
          </div>
        )}

        {/* Desktop Permanent Cart Sidebar Panel */}
        <div className="hidden md:block w-96 h-full shrink-0">
          <CartSidebar
            cart={cart}
            settings={settings}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onGenerateBill={handleGenerateBill}
          />
        </div>
      </div>
    </ProtectedGuard>
  );
}
