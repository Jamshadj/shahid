'use client';

import { useEffect, useState } from 'react';
import { getBills, getStoreSettings, updateBillPaymentStatus } from '@/lib/data-service';
import { BillWithItems, StoreSettings } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import KpiCard from '@/components/admin/KpiCard';
import PaymentBreakdown from '@/components/admin/PaymentBreakdown';
import DailyBillTable from '@/components/admin/DailyBillTable';
import { 
  DollarSign, 
  Receipt, 
  TrendingUp, 
  Clock, 
  RefreshCw, 
  Plus 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function AdminDashboardPage() {
  const [bills, setBills] = useState<BillWithItems[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'today' | 'yesterday' | 'week' | 'all'>('today');

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedBills, fetchedSettings] = await Promise.all([
        getBills(),
        getStoreSettings(),
      ]);
      setBills(fetchedBills);
      setSettings(fetchedSettings);
    } catch {
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkAsPaid = async (billId: string) => {
    try {
      await updateBillPaymentStatus(billId, 'paid');
      toast.success('Bill marked as Paid!');
      loadData();
    } catch {
      toast.error('Failed to update bill status');
    }
  };

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;
  const weekStart = todayStart - 86400000 * 7;

  const filteredBills = bills.filter((b) => {
    const billTime = new Date(b.created_at).getTime();
    if (timeFilter === 'today') return billTime >= todayStart;
    if (timeFilter === 'yesterday') return billTime >= yesterdayStart && billTime < todayStart;
    if (timeFilter === 'week') return billTime >= weekStart;
    return true;
  });

  const paidBills = filteredBills.filter((b) => b.payment_status === 'paid');
  const unpaidBills = filteredBills.filter((b) => b.payment_status === 'unpaid' || b.payment_mode === 'due');

  const totalRevenue = paidBills.reduce((sum, b) => sum + b.grand_total, 0);
  const totalBillsCount = filteredBills.length;
  const avgBillValue = totalBillsCount > 0 ? totalRevenue / totalBillsCount : 0;
  const unpaidTotal = unpaidBills.reduce((sum, b) => sum + b.grand_total, 0);

  const cashTotal = paidBills.filter((b) => b.payment_mode === 'cash').reduce((sum, b) => sum + b.grand_total, 0);
  const upiTotal = paidBills.filter((b) => b.payment_mode === 'upi').reduce((sum, b) => sum + b.grand_total, 0);
  const cardTotal = paidBills.filter((b) => b.payment_mode === 'card').reduce((sum, b) => sum + b.grand_total, 0);

  const sym = settings?.currency_symbol || '₹';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sales & Revenue Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time financial summary for <span className="text-indigo-600 font-bold">{settings?.restaurant_name || 'Restaurant'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Filter Buttons */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1">
            {(['today', 'yesterday', 'week', 'all'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                  timeFilter === filter
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/pos"
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-md shadow-indigo-600/20 transition"
          >
            <Plus className="w-4 h-4" /> New Bill
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue, sym)}
          subtitle={`From ${paidBills.length} paid invoices`}
          icon={DollarSign}
          color="emerald"
        />
        <KpiCard
          title="Bills Generated"
          value={String(totalBillsCount)}
          subtitle="Total invoices issued"
          icon={Receipt}
          color="indigo"
        />
        <KpiCard
          title="Avg. Bill Value (ABV)"
          value={formatCurrency(avgBillValue, sym)}
          subtitle="Average spend per bill"
          icon={TrendingUp}
          color="blue"
        />
        <KpiCard
          title="Unpaid / Due Tab"
          value={formatCurrency(unpaidTotal, sym)}
          subtitle={`${unpaidBills.length} bills pending payment`}
          icon={Clock}
          color="rose"
        />
      </div>

      {/* Payment Method Breakdown Widget */}
      <PaymentBreakdown
        cashTotal={cashTotal}
        upiTotal={upiTotal}
        cardTotal={cardTotal}
        dueTotal={unpaidTotal}
        currencySymbol={sym}
      />

      {/* Live Daily Bills Ledger */}
      <DailyBillTable
        bills={filteredBills}
        currencySymbol={sym}
        onMarkAsPaid={handleMarkAsPaid}
      />
    </div>
  );
}
