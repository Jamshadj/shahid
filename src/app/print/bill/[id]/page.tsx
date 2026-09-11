'use client';

import { use, useEffect, useState } from 'react';
import { getBillById, getStoreSettings } from '@/lib/data-service';
import { BillWithItems, StoreSettings } from '@/types/database';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrintBillPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const billId = resolvedParams.id;

  const [bill, setBill] = useState<BillWithItems | null>(null);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBillById(billId), getStoreSettings()]).then(([b, s]) => {
      setBill(b);
      setSettings(s);
      setLoading(false);

      // Auto-trigger print dialog after render
      setTimeout(() => {
        if (b) {
          window.print();
        }
      }, 400);
    });
  }, [billId]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-mono">Loading thermal receipt for TENAX TN260...</div>;
  }

  if (!bill) {
    return (
      <div className="p-8 text-center space-y-4 font-mono text-slate-700">
        <p className="text-lg font-bold">Bill Not Found.</p>
        <Link href="/pos" className="text-indigo-600 underline">
          Return to POS Terminal
        </Link>
      </div>
    );
  }

  const sym = settings?.currency_symbol || '₹';
  const taxRate = settings?.tax_rate_percent || 0;
  const halfTax = (taxRate / 2).toFixed(1);
  const cgstAmount = (bill.tax_amount / 2).toFixed(2);
  const sgstAmount = (bill.tax_amount / 2).toFixed(2);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col items-center justify-center font-sans">
      {/* On-screen Action Bar (Hidden during printing) */}
      <div className="w-full max-w-sm mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/pos"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to POS
        </Link>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition"
        >
          <Printer className="w-4 h-4" /> Print on TENAX TN260 (80mm)
        </button>
      </div>

      {/* Printable Receipt Container (TENAX TN260 80mm Paper Format) */}
      <div
        id="printable-receipt"
        className="bg-white text-black p-4 font-mono text-xs leading-snug shadow-2xl rounded-sm w-[80mm] max-w-[80mm]"
        style={{ color: '#000000', backgroundColor: '#ffffff' }}
      >
        {/* Header */}
        <div className="text-center space-y-0.5 pb-2 border-b-2 border-black">
          <h2 className="font-extrabold text-sm uppercase tracking-wider">
            {settings?.restaurant_name || 'GALAXY RESTAURANT KARUNA MEDICAL COLLEGE'}
          </h2>
          <p className="text-[9px] font-semibold text-gray-800">Fresh Meals, Quick Bites, Biryani & Refreshing Beverages</p>
          {settings?.address && <p className="text-[10px] uppercase font-bold">{settings.address}</p>}
          {settings?.phone_number && <p className="text-[10px] font-bold">Ph: {settings.phone_number}</p>}
        </div>

        {/* Invoice Header Details */}
        <div className="py-2 space-y-0.5 border-b border-black text-[10px]">
          <div className="text-center font-black uppercase tracking-wider py-0.5 border-y border-black text-xs my-1">
            RESTAURANT CASH BILL
          </div>
          <div className="flex justify-between font-black text-xs">
            <span>TOKEN NUMBER: #{bill.bill_number % 100 || bill.bill_number}</span>
            <span>MODE: {bill.payment_mode.toUpperCase()}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Bill: BILL-{bill.bill_number}</span>
            <span>Date: {formatDate(bill.created_at)}</span>
          </div>
          {bill.customer_name && bill.customer_name !== 'Walk-in Customer' && <div>CUST: {bill.customer_name}</div>}
          {bill.customer_phone && <div>MOB: {bill.customer_phone}</div>}
        </div>

        {/* Items Table */}
        <table className="w-full text-left my-2 text-[10px] border-b border-black pb-2">
          <thead>
            <tr className="border-b border-black font-extrabold">
              <th className="py-1">QTY ITEM</th>
              <th className="py-1 text-right">RATE</th>
              <th className="py-1 text-right">AMT</th>
            </tr>
          </thead>
          <tbody>
            {bill.bill_items?.map((item) => (
              <tr key={item.id} className="align-top">
                <td className="py-1 pr-1 font-bold">
                  {item.quantity} x {item.item_name}
                </td>
                <td className="py-1 text-right whitespace-nowrap">{item.unit_price}</td>
                <td className="py-1 text-right font-bold whitespace-nowrap">{item.total_price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Calculation Summary */}
        <div className="space-y-1 text-[10px] border-b border-black pb-2">
          <div className="flex justify-between">
            <span>SUBTOTAL:</span>
            <span>{formatCurrency(bill.subtotal, sym)}</span>
          </div>

          {bill.discount_amount > 0 && (
            <div className="flex justify-between font-bold">
              <span>DISCOUNT:</span>
              <span>-{formatCurrency(bill.discount_amount, sym)}</span>
            </div>
          )}

          {bill.tax_amount > 0 && (
            <>
              <div className="flex justify-between text-gray-700">
                <span>CGST ({halfTax}%):</span>
                <span>+{sym}{cgstAmount}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>SGST ({halfTax}%):</span>
                <span>+{sym}{sgstAmount}</span>
              </div>
            </>
          )}

          <div className="flex justify-between text-sm font-black pt-1.5 border-t-2 border-black">
            <span>GRAND TOTAL:</span>
            <span>{formatCurrency(bill.grand_total, sym)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-3 text-[10px] space-y-1">
          <p className="font-bold uppercase tracking-wider">*** THANK YOU! VISIT AGAIN ***</p>
          <p className="text-[8px] text-gray-600">TENAX TN260 80mm POS Thermal Receipt</p>
        </div>
      </div>
    </div>
  );
}
