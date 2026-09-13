'use client';

import { use, useEffect, useState } from 'react';
import { getBillById, getStoreSettings } from '@/lib/data-service';
import { BillWithItems, StoreSettings } from '@/types/database';
import { formatDate } from '@/lib/utils';
import { Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// ── Thermal Printer Text Formatting ──
// TENAX TN260 80mm ignores ALL CSS layout.
// From physical testing: ~38 chars fit per line at 12px mono.
// Using 32 for guaranteed safety on all 80mm printers.
const W = 32;

const center = (t: string) => {
  if (t.length >= W) return t;
  return ' '.repeat(Math.floor((W - t.length) / 2)) + t;
};

const lr = (l: string, r: string) => {
  const gap = W - l.length - r.length;
  return gap <= 0 ? l + ' ' + r : l + ' '.repeat(gap) + r;
};

const dash = () => '-'.repeat(W);

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
      setTimeout(() => { if (b) window.print(); }, 400);
    });
  }, [billId]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-mono">Loading receipt...</div>;
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

  const money = (v: number) => `Rs.${v.toFixed(2)}`;

  // Balanced word-wrap: splits near the middle to avoid
  // orphan words like "COLLEGE" or "Kerala" alone on a line
  const wrapCenter = (text: string): string[] => {
    if (text.length <= W) return [center(text)];
    const mid = Math.floor(text.length / 2);
    const l = text.lastIndexOf(' ', mid);
    const r = text.indexOf(' ', mid);
    let at: number;
    if (l === -1 && r === -1) return [text];
    else if (l === -1) at = r;
    else if (r === -1) at = l;
    else at = (mid - l <= r - mid) ? l : r;
    const p1 = text.substring(0, at);
    const p2 = text.substring(at + 1);
    return [
      ...(p1.length <= W ? [center(p1)] : wrapCenter(p1)),
      ...(p2.length <= W ? [center(p2)] : wrapCenter(p2)),
    ];
  };

  const storeName = settings?.restaurant_name || 'GALAXY RESTAURANT KARUNA MEDICAL COLLEGE';
  const tagline = 'Fresh Meals, Quick Bites, Biryani & Beverages';
  const addr = settings?.address || 'Vilayodi, Chittur, Palakkad, Kerala';
  const phone = settings?.phone_number || '+91 99461 04923';
  const token = bill.bill_number % 100 || bill.bill_number;

  const L: string[] = [];

  // Header — balanced auto-wrap
  L.push(...wrapCenter(storeName));
  L.push(...wrapCenter(tagline));
  L.push(...wrapCenter(addr));
  L.push(center('Ph: ' + phone));
  L.push(dash());

  // Title
  L.push(center('RESTAURANT CASH BILL'));
  L.push(dash());

  // Meta
  L.push(lr('TOKEN: #' + token, bill.payment_mode.toUpperCase()));
  L.push('Bill: BILL-' + bill.bill_number);
  L.push('Date: ' + formatDate(bill.created_at));
  if (bill.customer_name && bill.customer_name !== 'Walk-in Customer') {
    L.push('CUST: ' + bill.customer_name);
  }
  if (bill.customer_phone) {
    L.push('MOB: ' + bill.customer_phone);
  }
  L.push(dash());

  // Items — 2-line format
  L.push(lr('ITEM', 'RATE     AMT'));
  L.push(dash());

  bill.bill_items?.forEach((item) => {
    L.push(`${item.quantity} x ${item.item_name}`);
    const r = item.unit_price.toFixed(2);
    const a = item.total_price.toFixed(2);
    L.push((r.padStart(10) + a.padStart(10)).padStart(W));
  });
  L.push(dash());

  // Totals
  L.push(lr('SUBTOTAL:', money(bill.subtotal)));
  if (bill.discount_amount > 0) {
    L.push(lr('DISCOUNT:', '-' + money(bill.discount_amount)));
  }
  L.push(dash());
  L.push(lr('GRAND TOTAL:', money(bill.grand_total)));
  L.push(dash());

  // Footer
  L.push(center('*** THANK YOU! ***'));
  L.push(center('VISIT AGAIN'));

  const receipt = L.join('\n');

  return (
    <div className="min-h-screen bg-slate-100 p-2 md:p-8 flex flex-col items-center justify-center font-sans">
      
      <style jsx global>{`
        @media print {
          @page { size: 80mm auto; margin: 0; }
          body {
            background: #fff !important;
            color: #000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-hidden, .print\\:hidden { display: none !important; }
          #printable-receipt {
            width: 80mm !important;
            max-width: 80mm !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 1mm 2mm !important;
          }
        }
      `}</style>

      {/* Action Bar — hidden on print */}
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

      {/* Thermal Receipt */}
      <div
        id="printable-receipt"
        className="bg-white text-black shadow-2xl rounded-sm w-[80mm] max-w-[80mm]"
        style={{ color: '#000', backgroundColor: '#fff' }}
      >
        <pre style={{
          fontFamily: 'monospace',
          fontSize: '12px',
          lineHeight: '1.4',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          margin: 0,
          padding: '6px',
        }}>{receipt}</pre>
      </div>
    </div>
  );
}


