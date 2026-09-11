'use client';

import { use, useEffect, useState } from 'react';
import { getBillById, getStoreSettings } from '@/lib/data-service';
import { BillWithItems, StoreSettings } from '@/types/database';
import { formatDate } from '@/lib/utils';
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

  // Use 'Rs. ' for physical thermal printing so thermal ESC/POS drivers never print '?' instead of '₹'
  const printSym = 'Rs. ';

  const formatPrintMoney = (val: number) => {
    return `${printSym}${val.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 p-2 md:p-8 flex flex-col items-center justify-center font-sans">
      
      {/* Global CSS for Perfect Thermal Printing */}
      <style jsx global>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-hidden, .print\\:hidden {
            display: none !important;
          }
          #printable-receipt {
            width: 74mm !important;
            max-width: 74mm !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 auto !important;
            padding: 2mm 0 !important;
          }
        }
      `}</style>

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
          <Printer className="w-4 h-4" /> Print Receipt
        </button>
      </div>

      {/* Printable Thermal Receipt (TENAX TN260 80mm Paper Format) */}
      <div
        id="printable-receipt"
        className="bg-white text-black p-4 font-mono text-xs leading-snug shadow-2xl rounded-sm w-[76mm] max-w-[76mm]"
        style={{ color: '#000000', backgroundColor: '#ffffff' }}
      >
        {/* Header */}
        <div className="text-center space-y-0.5 pb-2 border-b-2 border-black">
          <h2 className="font-extrabold text-sm uppercase tracking-wider leading-tight">
            {settings?.restaurant_name || 'GALAXY RESTAURANT KARUNA MEDICAL COLLEGE'}
          </h2>
          <p className="text-[9px] font-semibold text-gray-800">Fresh Meals, Quick Bites, Biryani & Refreshing Beverages</p>
          {settings?.address && <p className="text-[10px] uppercase font-bold">{settings.address}</p>}
          {settings?.phone_number && <p className="text-[10px] font-bold">Ph: {settings.phone_number}</p>}
        </div>

        {/* Cash Bill Title Bar */}
        <div className="text-center font-black uppercase tracking-wider py-1 border-b-2 border-black text-xs my-1 bg-black text-white">
          RESTAURANT CASH BILL
        </div>

        {/* Invoice Header Table */}
        <table className="w-full text-left my-1 text-[10px] border-b border-black pb-1 font-bold">
          <tbody>
            <tr>
              <td className="py-0.5">TOKEN NO: #{bill.bill_number % 100 || bill.bill_number}</td>
              <td className="py-0.5 text-right uppercase">MODE: {bill.payment_mode}</td>
            </tr>
            <tr>
              <td className="py-0.5">Bill: BILL-{bill.bill_number}</td>
              <td className="py-0.5 text-right">{formatDate(bill.created_at)}</td>
            </tr>
            {bill.customer_name && bill.customer_name !== 'Walk-in Customer' && (
              <tr>
                <td colSpan={2} className="py-0.5">CUST: {bill.customer_name}</td>
              </tr>
            )}
            {bill.customer_phone && (
              <tr>
                <td colSpan={2} className="py-0.5">MOB: {bill.customer_phone}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Items Table with Explicit Column Widths */}
        <table className="w-full text-left my-2 text-[10px] border-b-2 border-black pb-2">
          <thead>
            <tr className="border-b border-black font-extrabold">
              <th className="py-1 w-[50%]">QTY ITEM</th>
              <th className="py-1 w-[25%] text-right pr-1">RATE</th>
              <th className="py-1 w-[25%] text-right">AMT</th>
            </tr>
          </thead>
          <tbody>
            {bill.bill_items?.map((item) => (
              <tr key={item.id} className="align-top">
                <td className="py-1 pr-1 font-bold w-[50%]">
                  {item.quantity} x {item.item_name}
                </td>
                <td className="py-1 text-right whitespace-nowrap w-[25%] pr-1">{item.unit_price.toFixed(2)}</td>
                <td className="py-1 text-right font-bold whitespace-nowrap w-[25%]">{item.total_price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Calculation Summary Table */}
        <table className="w-full text-[10px] border-b-2 border-black pb-2 my-1 font-bold">
          <tbody>
            <tr>
              <td className="py-0.5">SUBTOTAL:</td>
              <td className="py-0.5 text-right">{formatPrintMoney(bill.subtotal)}</td>
            </tr>

            {bill.discount_amount > 0 && (
              <tr>
                <td className="py-0.5">DISCOUNT:</td>
                <td className="py-0.5 text-right">-{formatPrintMoney(bill.discount_amount)}</td>
              </tr>
            )}

            <tr className="text-sm font-black border-t border-black">
              <td className="pt-1">GRAND TOTAL:</td>
              <td className="pt-1 text-right">{formatPrintMoney(bill.grand_total)}</td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div className="text-center pt-3 text-[10px] space-y-1">
          <p className="font-bold uppercase tracking-wider">*** THANK YOU! VISIT AGAIN ***</p>
        </div>
      </div>
    </div>
  );
}
