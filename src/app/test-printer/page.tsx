'use client';

import { useState } from 'react';
import { Printer, CheckCircle2, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function StandaloneTestPrinterPage() {
  const [printed, setPrinted] = useState(false);

  const handleTestPrint = () => {
    setPrinted(true);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">TENAX TN260 Thermal Printer Test</h1>
              <p className="text-xs text-indigo-600 font-bold">80mm Direct ESC/POS Printer Verification (Public Test)</p>
            </div>
          </div>

          <button
            onClick={handleTestPrint}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition"
          >
            <Printer className="w-4 h-4" /> Test Print Sample Bill
          </button>
        </div>

        {/* Instructions Card */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-600" /> TENAX TN260 (UE) Printer Setup Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
              <p className="font-bold text-slate-900">1. USB / LAN Connection</p>
              <p>Connect TENAX TN260 via USB or LAN cable to your Mac or network.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
              <p className="font-bold text-slate-900">2. Select 80mm Roll</p>
              <p>Set paper size in print dialog to 80mm / POS Receipt Roll (3.15").</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
              <p className="font-bold text-slate-900">3. Auto-Cutter</p>
              <p>TN260 1.5M-cut auto-cutter will slice receipt automatically upon print.</p>
            </div>
          </div>
        </div>

        {/* Live Sample Thermal Slip Preview */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> 80mm Live Thermal Receipt Sample Preview
            </h3>
            {printed && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Sample Sent to Printer
              </span>
            )}
          </div>

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

          {/* Rendered 80mm Thermal Slip */}
          <div
            id="printable-receipt"
            className="bg-white text-black shadow-xl rounded-sm w-[80mm] max-w-[80mm] my-4"
            style={{ color: '#000000', backgroundColor: '#ffffff' }}
          >
            <pre style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: '13.5px',
              fontWeight: '600',
              lineHeight: '1.18',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              margin: 0,
              padding: '6px',
            }}>{`GALAXY RESTAURANT KARUNA MEDICAL
Fresh Meals, Quick Bites, Biryani &
            Beverages
    Vilayodi, Chittur, Palakkad,
             Kerala
       Ph: +91 99461 04923
----------------------------------
       RESTAURANT CASH BILL       
----------------------------------
TOKEN: #124  |  CASH
Bill: BILL-1024
Date: 13 Sept 2026, 01:22 pm
----------------------------------
SL  ITEM NAME
           QTY     RATE       AMT
----------------------------------
1. BBQ Al-Faham (Half)
             3   340.00   1020.00
2. Turkish Al-Faham (Quarter)
             1   180.00    180.00
----------------------------------
SUBTOTAL:               Rs.1200.00
GRAND TOTAL:            Rs.1200.00
----------------------------------
        *** THANK YOU! ***        
           VISIT AGAIN            `}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
