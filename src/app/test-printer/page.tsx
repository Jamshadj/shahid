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

          {/* Rendered 80mm Thermal Slip */}
          <div
            id="printable-receipt"
            className="bg-white text-black p-4 font-mono text-xs leading-snug shadow-xl border border-slate-300 rounded-sm w-[80mm] max-w-[80mm] my-4"
          >
            {/* Header */}
            <div className="text-center space-y-1 pb-2 border-b-2 border-black">
              <h2 className="font-extrabold text-sm uppercase">GALAXY BAMBOO HUT</h2>
              <p className="text-[10px]">AYYAPPANKAVU, VANDITHAVALAM</p>
              <p className="text-[10px]">PH: +91 9946238246</p>
            </div>

            {/* Meta */}
            <div className="py-2 space-y-0.5 border-b border-black text-[10px]">
              <div className="flex justify-between font-bold">
                <span>BILL NO: #1001</span>
                <span>MODE: CASH</span>
              </div>
              <div>DATE: {new Date().toLocaleDateString('en-IN')}</div>
              <div>CUST: Walk-in Customer</div>
            </div>

            {/* Table */}
            <table className="w-full text-left my-2 text-[10px] border-b border-black pb-2">
              <thead>
                <tr className="border-b border-black font-extrabold">
                  <th className="py-1">QTY ITEM</th>
                  <th className="py-1 text-right">RATE</th>
                  <th className="py-1 text-right">AMT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1 font-bold">2 x Normal Al-Faham (Quarter)</td>
                  <td className="py-1 text-right">140.00</td>
                  <td className="py-1 text-right font-bold">280.00</td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">1 x Normal Mandhi (Quarter)</td>
                  <td className="py-1 text-right">200.00</td>
                  <td className="py-1 text-right font-bold">200.00</td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">2 x Fresh Lime Soda</td>
                  <td className="py-1 text-right">30.00</td>
                  <td className="py-1 text-right font-bold">60.00</td>
                </tr>
              </tbody>
            </table>

            {/* Calculation */}
            <div className="space-y-1 text-[10px] border-b border-black pb-2">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span>₹540.00</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-1.5 border-t-2 border-black">
                <span>GRAND TOTAL:</span>
                <span>₹540.00</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-3 text-[10px] space-y-1">
              <p className="font-bold uppercase tracking-wider">*** THANK YOU! VISIT AGAIN ***</p>
              <p className="text-[8px] text-gray-600">TENAX TN260 80mm POS Thermal Receipt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
