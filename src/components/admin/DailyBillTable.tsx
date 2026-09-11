import Link from 'next/link';
import { BillWithItems } from '@/types/database';
import { formatCurrency, formatTime } from '@/lib/utils';
import { Printer, CheckCircle, MessageCircle } from 'lucide-react';

interface DailyBillTableProps {
  bills: BillWithItems[];
  currencySymbol: string;
  onMarkAsPaid?: (billId: string) => void;
}

export default function DailyBillTable({ bills, currencySymbol, onMarkAsPaid }: DailyBillTableProps) {
  if (bills.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
        <p className="text-sm font-medium">No bills generated for this period.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">Daily Bills Ledger</h3>
          <p className="text-xs text-slate-500">Live stream of generated invoices & receipts</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          {bills.length} {bills.length === 1 ? 'Bill' : 'Bills'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4">Bill #</th>
              <th className="py-3.5 px-4">Time</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Items</th>
              <th className="py-3.5 px-4">Mode</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Grand Total</th>
              <th className="py-3.5 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bills.map((bill) => {
              const totalItems = bill.bill_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
              const isPaid = bill.payment_status === 'paid';

              const waText = encodeURIComponent(
                `*Receipt from Restaurant*\nBill #${bill.bill_number}\nDate/Time: ${formatTime(bill.created_at)}\nTotal: ${currencySymbol}${bill.grand_total}\nPayment: ${bill.payment_mode.toUpperCase()}\nStatus: ${bill.payment_status.toUpperCase()}\nThank you for dining with us!`
              );
              const waUrl = bill.customer_phone
                ? `https://wa.me/${bill.customer_phone.replace(/[^0-9]/g, '')}?text=${waText}`
                : `https://wa.me/?text=${waText}`;

              return (
                <tr key={bill.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                    #{bill.bill_number}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500 font-medium">
                    {formatTime(bill.created_at)}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{bill.customer_name || 'Walk-in'}</p>
                    {bill.customer_phone && (
                      <p className="text-xs text-slate-500 font-mono">{bill.customer_phone}</p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    {totalItems} items
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                      {bill.payment_mode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isPaid
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900 text-base">
                    {formatCurrency(bill.grand_total, currencySymbol)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/print/bill/${bill.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        title="Print / View Thermal Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </Link>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition"
                        title="Share Receipt on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>

                      {!isPaid && onMarkAsPaid && (
                        <button
                          onClick={() => onMarkAsPaid(bill.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
                          title="Mark bill as Paid"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
