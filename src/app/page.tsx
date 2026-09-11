import Link from 'next/link';
import { Utensils, CreditCard, LayoutDashboard, Menu as MenuIcon, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6 md:p-12 relative overflow-hidden text-slate-900">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">QuickBill POS</h1>
            <p className="text-xs text-slate-500 font-medium">Smart Restaurant Management</p>
          </div>
        </div>
        <Link
          href="/admin"
          className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 bg-white border border-slate-200 hover:border-indigo-300 px-4 py-2 rounded-xl shadow-sm transition"
        >
          <LayoutDashboard className="w-4 h-4 text-indigo-600" />
          Admin Dashboard
        </Link>
      </header>

      {/* Main Feature Cards */}
      <main className="max-w-5xl mx-auto w-full my-auto py-12 z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-4">
            <Zap className="w-3.5 h-3.5" /> High Speed Counter Billing & Digital Menu
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Streamline Your Restaurant Billing & Sales
          </h2>
          <p className="text-slate-600 text-sm md:text-base mt-3">
            Select a terminal below to start generating bills, managing menus, or viewing live revenue analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Billing POS */}
          <Link
            href="/pos"
            className="group bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">POS Billing Terminal</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Fast counter checkout grid with item images, discount calculators, and 58mm/80mm thermal receipt printing.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-600 group-hover:text-indigo-700">
              Open POS Terminal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Public Digital Menu */}
          <Link
            href="/menu"
            className="group bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                <MenuIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Public Digital Menu</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Lightweight, text-only digital menu designed for instant mobile loading without heavy image lag.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-600 group-hover:text-indigo-700">
              View Public Menu <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Admin Analytics */}
          <Link
            href="/admin"
            className="group bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Admin Analytics</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Live daily sales metrics, Cash/UPI/Card payment breakdowns, CSV sales logs export, and store configuration.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-600 group-hover:text-indigo-700">
              Go to Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-6 z-10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Single Restaurant POS Architecture</span>
        </div>
        <span>Built with Next.js & Supabase</span>
      </footer>
    </div>
  );
}
