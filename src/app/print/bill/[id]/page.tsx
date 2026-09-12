'use client';

import { use, useEffect, useState } from 'react';
import { getBillById, getStoreSettings } from '@/lib/data-service';
import { BillWithItems, StoreSettings } from '@/types/database';
import { formatDate } from '@/lib/utils';
import { Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// ── Thermal Printer Text Formatting Helpers ──
// The TENAX TN260 80mm thermal printer ignores all CSS layout
// (text-align, table widths, flexbox). The ONLY way to align
// columns is monospace pre-formatted text with space padding.
// 80mm paper with standard thermal font ≈ 42 chars per line.
const LINE_WIDTH = 42;

function centerText(text: string, width: number = LINE_WIDTH): string {
  if (text.length >= width) return text;
  const pad = Math.floor((width - text.length) / 2);
  return ' '.repeat(pad) + text;
}

function leftRight(left: string, right: string, width: number = LINE_WIDTH): string {
  const space = width - left.length - right.length;
  if (space <= 0) return left + ' ' + right;
  return left + ' '.repeat(space) + right;
}

function dashedLine(width: number = LINE_WIDTH): string {
  return '-'.repeat(width);
}

function formatItemLine(qty: string, rate: string, amt: string, width: number = LINE_WIDTH): string {
  // Item name gets flexible width, rate=10 chars, amt=10 chars
  const rateWidth = 10;
  const amtWidth = 10;
  const nameWidth = width - rateWidth - amtWidth;
  const paddedRate = rate.padStart(rateWidth);
  const paddedAmt = amt.padStart(amtWidth);
  // If item name is longer than nameWidth, it will wrap naturally in <pre> 
  const paddedName = qty.length > nameWidth ? qty : qty.padEnd(nameWidth);
  return paddedName + paddedRate + paddedAmt;
}

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

  const fmtMoney = (val: number) => `Rs.${val.toFixed(2)}`;

  const storeName = settings?.restaurant_name || 'GALAXY RESTAURANT KARUNA MEDICAL COLLEGE';
  const tagline = 'Fresh Meals, Quick Bites, Biryani & Refreshing Beverages';
  const address = settings?.address || 'VILAYODI, CHITTUR, PALAKKAD, KERALA';
  const phone = settings?.phone_number || '+91 75580 60207';
  const tokenNo = bill.bill_number % 100 || bill.bill_number;
  const dateStr = formatDate(bill.created_at);

  // Build the entire receipt as pre-formatted monospace text lines
  const lines: string[] = [];

  // Header
  lines.push(centerText(storeName));
  lines.push(centerText(tagline));
  lines.push(centerText(address));
  lines.push(centerText(`Ph: ${phone}`));
  lines.push(dashedLine());

  // Title
  lines.push(centerText('RESTAURANT CASH BILL'));
  lines.push(dashedLine());

  // Metadata — each on its own line to avoid merging
  lines.push(`TOKEN NO: #${tokenNo}`);
  lines.push(`MODE: ${bill.payment_mode.toUpperCase()}`);
  lines.push(`Bill: BILL-${bill.bill_number}`);
  lines.push(`Date: ${dateStr}`);
  if (bill.customer_name && bill.customer_name !== 'Walk-in Customer') {
    lines.push(`CUST: ${bill.customer_name}`);
  }
  if (bill.customer_phone) {
    lines.push(`MOB: ${bill.customer_phone}`);
  }
  lines.push(dashedLine());

  // Items header
  lines.push(formatItemLine('QTY ITEM', 'RATE', 'AMT'));
  lines.push(dashedLine());

  // Items
  bill.bill_items?.forEach((item) => {
    const name = `${item.quantity} x ${item.item_name}`;
    const rate = item.unit_price.toFixed(2);
    const amt = item.total_price.toFixed(2);
    lines.push(formatItemLine(name, rate, amt));
  });
  lines.push(dashedLine());

  // Totals
  lines.push(leftRight('SUBTOTAL:', fmtMoney(bill.subtotal)));
  if (bill.discount_amount > 0) {
    lines.push(leftRight('DISCOUNT:', `-${fmtMoney(bill.discount_amount)}`));
  }
  lines.push(dashedLine());
  lines.push(leftRight('GRAND TOTAL:', fmtMoney(bill.grand_total)));
  lines.push(dashedLine());

  // Footer
  lines.push('');
  lines.push(centerText('*** THANK YOU! VISIT AGAIN ***'));

  const receiptText = lines.join('\n');

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
          }
          .print-hidden, .print\\:hidden {
            display: none !important;
          }
          #printable-receipt {
            width: 80mm !important;
            max-width: 80mm !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 2mm 3mm !important;
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

      {/* Printable Thermal Receipt — Pure Monospace Pre-formatted Text */}
      <div
        id="printable-receipt"
        className="bg-white text-black shadow-2xl rounded-sm w-[80mm] max-w-[80mm]"
        style={{ color: '#000000', backgroundColor: '#ffffff' }}
      >
        <pre
          style={{
            fontFamily: 'monospace',
            fontSize: '12px',
            lineHeight: '1.4',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            margin: 0,
            padding: '8px',
          }}
        >{receiptText}</pre>
      </div>
    </div>
  );
}
