import { Wallet, Smartphone, CreditCard, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PaymentBreakdownProps {
  cashTotal: number;
  upiTotal: number;
  cardTotal: number;
  dueTotal: number;
  currencySymbol: string;
}

export default function PaymentBreakdown({
  cashTotal,
  upiTotal,
  cardTotal,
  dueTotal,
  currencySymbol,
}: PaymentBreakdownProps) {
  const grandSum = cashTotal + upiTotal + cardTotal + dueTotal;

  const items = [
    {
      label: 'Cash',
      amount: cashTotal,
      icon: Wallet,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50 border-emerald-200',
    },
    {
      label: 'UPI / Digital',
      amount: upiTotal,
      icon: Smartphone,
      color: 'bg-indigo-600',
      textColor: 'text-indigo-700',
      bgColor: 'bg-indigo-50 border-indigo-200',
    },
    {
      label: 'Card Terminal',
      amount: cardTotal,
      icon: CreditCard,
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50 border-blue-200',
    },
    {
      label: 'Unpaid / Due Tab',
      amount: dueTotal,
      icon: Clock,
      color: 'bg-rose-500',
      textColor: 'text-rose-700',
      bgColor: 'bg-rose-50 border-rose-200',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">Payment Method Breakdown</h3>
          <p className="text-xs text-slate-500">Cash drawer & digital ledger reconciliation</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          Total: {formatCurrency(grandSum, currencySymbol)}
        </span>
      </div>

      {/* Progress Bar */}
      {grandSum > 0 ? (
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
          {items.map(
            (item) =>
              item.amount > 0 && (
                <div
                  key={item.label}
                  style={{ width: `${(item.amount / grandSum) * 100}%` }}
                  className={`${item.color} transition-all duration-500`}
                  title={`${item.label}: ${formatCurrency(item.amount, currencySymbol)}`}
                />
              )
          )}
        </div>
      ) : (
        <div className="h-3 w-full bg-slate-100 rounded-full" />
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          const percentage = grandSum > 0 ? Math.round((item.amount / grandSum) * 100) : 0;
          return (
            <div key={item.label} className={`border rounded-xl p-3.5 ${item.bgColor} space-y-1`}>
              <div className="flex items-center justify-between text-slate-600 text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" /> {item.label}
                </span>
                <span>{percentage}%</span>
              </div>
              <p className={`text-lg font-black ${item.textColor}`}>
                {formatCurrency(item.amount, currencySymbol)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
