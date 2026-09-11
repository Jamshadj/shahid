import { useState } from 'react';
import { CartItem, PaymentMode, PaymentStatus, StoreSettings } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { Trash2, Plus, Minus, Receipt, User, Phone, Tag, CreditCard, Wallet, Smartphone, Clock } from 'lucide-react';

interface CartSidebarProps {
  cart: CartItem[];
  settings: StoreSettings | null;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onGenerateBill: (params: {
    customer_name: string;
    customer_phone: string;
    discount_amount: number;
    payment_mode: PaymentMode;
    payment_status: PaymentStatus;
  }) => Promise<void>;
}

export default function CartSidebar({
  cart,
  settings,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onGenerateBill,
}: CartSidebarProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('paid');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, ci) => sum + (ci.customPrice ?? ci.menuItem.price) * ci.quantity, 0);
  const taxRate = settings?.tax_rate_percent || 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * (taxRate / 100) * 100) / 100;
  const grandTotal = Math.round((taxableAmount + taxAmount) * 100) / 100;
  const sym = settings?.currency_symbol || '₹';

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      await onGenerateBill({
        customer_name: customerName,
        customer_phone: customerPhone,
        discount_amount: discountAmount,
        payment_mode: paymentMode,
        payment_status: paymentStatus,
      });

      setCustomerName('');
      setCustomerPhone('');
      setDiscountAmount(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentOptions: { mode: PaymentMode; label: string; icon: any }[] = [
    { mode: 'cash', label: 'Cash', icon: Wallet },
    { mode: 'upi', label: 'UPI / Scan', icon: Smartphone },
    { mode: 'card', label: 'Card', icon: CreditCard },
    { mode: 'due', label: 'Due Tab', icon: Clock },
  ];

  return (
    <div className="w-full h-full bg-white border-l border-slate-200 flex flex-col justify-between overflow-hidden shadow-lg">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-indigo-600" />
          <h3 className="font-extrabold text-slate-900 text-base">Current Bill Order</h3>
        </div>
        {cart.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-rose-600 hover:text-rose-700 font-bold transition"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12 space-y-2">
            <Receipt className="w-12 h-12 stroke-1 opacity-40 text-slate-400" />
            <p className="text-sm font-bold text-slate-600">Cart is empty</p>
            <p className="text-xs text-slate-500">Select food items from grid to add to bill</p>
          </div>
        ) : (
          cart.map((ci) => {
            const price = ci.customPrice ?? ci.menuItem.price;
            const lineTotal = price * ci.quantity;

            return (
              <div key={ci.menuItem.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{ci.menuItem.name}</h4>
                  <button
                    onClick={() => onRemoveItem(ci.menuItem.id)}
                    className="text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">
                    {formatCurrency(price, sym)} × {ci.quantity}
                  </span>

                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                    <button
                      onClick={() => onUpdateQuantity(ci.menuItem.id, -1)}
                      className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-slate-900 w-4 text-center">{ci.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(ci.menuItem.id, 1)}
                      className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-black text-slate-900">{formatCurrency(lineTotal, sym)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Customer & Payment Form Footer */}
      {cart.length > 0 && (
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
          {/* Customer Inputs */}
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
              />
            </div>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
              />
            </div>
          </div>

          {/* Payment Mode Selection */}
          <div className="grid grid-cols-4 gap-1.5">
            {paymentOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = paymentMode === opt.mode;
              return (
                <button
                  key={opt.mode}
                  type="button"
                  onClick={() => {
                    setPaymentMode(opt.mode);
                    setPaymentStatus(opt.mode === 'due' ? 'unpaid' : 'paid');
                  }}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] font-bold border transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 mb-1" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Calculations Summary */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal, sym)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-indigo-600" /> Discount (₹)
              </span>
              <input
                type="number"
                min="0"
                value={discountAmount || ''}
                onChange={(e) => setDiscountAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-20 bg-white border border-slate-200 rounded px-2 py-0.5 text-right font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            {taxAmount > 0 && (
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Tax / GST ({taxRate}%)</span>
                <span>{formatCurrency(taxAmount, sym)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>Grand Total</span>
              <span className="text-xl text-indigo-600">{formatCurrency(grandTotal, sym)}</span>
            </div>
          </div>

          {/* Generate & Print Bill Button */}
          <button
            onClick={handleCheckout}
            disabled={isSubmitting || cart.length === 0}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Receipt className="w-4 h-4" />
            {isSubmitting ? 'Generating Bill...' : 'Generate & Print Receipt'}
          </button>
        </div>
      )}
    </div>
  );
}
