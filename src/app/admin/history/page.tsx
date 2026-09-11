'use client';

import { useEffect, useState } from 'react';
import { getBills, getStoreSettings, deleteBill, deleteBills, deleteAllBills } from '@/lib/data-service';
import { BillWithItems, StoreSettings } from '@/types/database';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Search, Download, Printer, History, Trash2, CheckSquare, Square, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function AdminHistoryPage() {
  const [bills, setBills] = useState<BillWithItems[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [paymentModeFilter, setPaymentModeFilter] = useState<string>('all');

  // Selection for bulk delete
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteConfirmBill, setDeleteConfirmBill] = useState<BillWithItems | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const refreshBills = async () => {
    const [b, s] = await Promise.all([getBills(), getStoreSettings()]);
    setBills(b);
    setSettings(s);
  };

  useEffect(() => {
    refreshBills();
  }, []);

  const filteredBills = bills.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      String(b.bill_number).includes(q) ||
      (b.customer_name && b.customer_name.toLowerCase().includes(q)) ||
      (b.customer_phone && b.customer_phone.includes(q));

    const matchesStatus = statusFilter === 'all' || b.payment_status === statusFilter;
    const matchesMode = paymentModeFilter === 'all' || b.payment_mode === paymentModeFilter;

    return matchesSearch && matchesStatus && matchesMode;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredBills.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBills.map((b) => b.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSingle = async (bill: BillWithItems) => {
    setIsDeleting(true);
    try {
      await deleteBill(bill.id);
      toast.success(`Bill #${bill.bill_number} deleted successfully`);
      setSelectedIds((prev) => prev.filter((id) => id !== bill.id));
      await refreshBills();
    } catch {
      toast.error('Failed to delete bill');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmBill(null);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected bill(s)?`)) return;

    setIsDeleting(true);
    try {
      await deleteBills(selectedIds);
      toast.success(`${selectedIds.length} bill(s) deleted successfully`);
      setSelectedIds([]);
      await refreshBills();
    } catch {
      toast.error('Failed to delete selected bills');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearAllHistory = async () => {
    setIsDeleting(true);
    try {
      await deleteAllBills();
      toast.success('All billing history deleted cleanly');
      setSelectedIds([]);
      await refreshBills();
    } catch {
      toast.error('Failed to clear billing history');
    } finally {
      setIsDeleting(false);
      setShowClearAllModal(false);
    }
  };

  const exportToCSV = () => {
    if (filteredBills.length === 0) {
      toast.warn('No bills available to export');
      return;
    }

    const headers = ['Bill Number', 'Date', 'Customer Name', 'Phone', 'Subtotal', 'Discount', 'Tax', 'Grand Total', 'Payment Mode', 'Payment Status'];
    const rows = filteredBills.map((b) => [
      b.bill_number,
      formatDate(b.created_at),
      `"${b.customer_name || 'Walk-in'}"`,
      `"${b.customer_phone || ''}"`,
      b.subtotal,
      b.discount_amount,
      b.tax_amount,
      b.grand_total,
      b.payment_mode,
      b.payment_status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sales_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Report Downloaded!');
  };

  const sym = settings?.currency_symbol || '₹';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600" /> Historical Bills & Data Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">Search, reprint, delete, or export complete restaurant invoice logs</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-rose-600/20 transition"
            >
              <Trash2 className="w-4 h-4" /> Delete Selected ({selectedIds.length})
            </button>
          )}

          {bills.length > 0 && (
            <button
              onClick={() => setShowClearAllModal(true)}
              className="flex items-center justify-center gap-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 px-3.5 py-2.5 rounded-xl font-bold text-xs transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All History
            </button>
          )}

          <button
            onClick={exportToCSV}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition"
          >
            <Download className="w-4 h-4" /> Export CSV Report
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Bill #, Customer, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-600 font-medium"
        >
          <option value="all">All Payment Statuses</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid / Due</option>
        </select>

        <select
          value={paymentModeFilter}
          onChange={(e) => setPaymentModeFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-600 font-medium"
        >
          <option value="all">All Payment Modes</option>
          <option value="cash">Cash</option>
          <option value="upi">UPI / Digital</option>
          <option value="card">Card Terminal</option>
          <option value="due">Due Tab</option>
        </select>
      </div>

      {/* Bills Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 w-10 text-center">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-700 transition">
                    {filteredBills.length > 0 && selectedIds.length === filteredBills.length ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4">Bill #</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Grand Total</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    No billing history records found.
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => {
                  const isSelected = selectedIds.includes(bill.id);
                  return (
                    <tr
                      key={bill.id}
                      className={`transition ${isSelected ? 'bg-indigo-50/50' : 'hover:bg-slate-50/80'}`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => toggleSelectOne(bill.id)}
                          className="text-slate-400 hover:text-slate-700 transition"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                        #{bill.bill_number}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 font-medium">
                        {formatDate(bill.created_at)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {bill.customer_name || 'Walk-in'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="uppercase text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {bill.payment_mode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            bill.payment_status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {bill.payment_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-900 text-base">
                        {formatCurrency(bill.grand_total, sym)}
                      </td>
                      <td className="py-3.5 px-4 text-center flex items-center justify-center gap-2">
                        <Link
                          href={`/print/bill/${bill.id}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                          title="Print Thermal Receipt"
                        >
                          <Printer className="w-4 h-4" /> Print
                        </Link>
                        <button
                          onClick={() => setDeleteConfirmBill(bill)}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition border border-rose-200"
                          title="Delete Bill"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal for Single Bill */}
      {deleteConfirmBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Delete Bill #{deleteConfirmBill.bill_number}?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              Are you sure you want to permanently remove Bill <strong>#{deleteConfirmBill.bill_number}</strong> ({formatCurrency(deleteConfirmBill.grand_total, sym)})?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmBill(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSingle(deleteConfirmBill)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All History Modal */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-300">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Clear Entire Bill History?</h3>
                <p className="text-xs text-slate-500">High level administrative action</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              You are about to wipe <strong>ALL ({bills.length}) historical bills</strong> from database & local records. This action cannot be reversed!
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearAllModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllHistory}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition disabled:opacity-50"
              >
                {isDeleting ? 'Wiping...' : 'Clear All History'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
