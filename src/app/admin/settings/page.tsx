'use client';

import { useEffect, useState } from 'react';
import { getStoreSettings, updateStoreSettings } from '@/lib/data-service';
import { StoreSettings, ThermalPrinterWidth } from '@/types/database';
import { Save, Building2, Phone, MapPin, Percent, IndianRupee, Printer } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getStoreSettings().then(setSettings);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setLoading(true);

    try {
      await updateStoreSettings(settings);
      toast.success('Store settings updated successfully!');
    } catch {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  if (!settings) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Store & Receipt Configuration</h1>
        <p className="text-xs text-slate-500 mt-1">Configure restaurant details, GST rates, and thermal bill printing width</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" /> Restaurant Name
            </label>
            <input
              type="text"
              required
              value={settings.restaurant_name}
              onChange={(e) => setSettings({ ...settings, restaurant_name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-600" /> Phone Number
            </label>
            <input
              type="text"
              value={settings.phone_number || ''}
              onChange={(e) => setSettings({ ...settings, phone_number: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Restaurant Address
          </label>
          <textarea
            rows={2}
            value={settings.address || ''}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-indigo-600" /> Default Tax Rate (%) (Set 0 for No Tax)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.tax_rate_percent}
              onChange={(e) => setSettings({ ...settings, tax_rate_percent: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              GSTIN / Tax Reg (Optional)
            </label>
            <input
              type="text"
              placeholder="Leave empty if no GST"
              value={settings.tax_number_gst || ''}
              onChange={(e) => setSettings({ ...settings, tax_number_gst: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-indigo-600" /> Currency Symbol
            </label>
            <input
              type="text"
              value={settings.currency_symbol}
              onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        {/* Thermal Printer Settings */}
        <div className="border-t border-slate-100 pt-5 space-y-3">
          <label className="block text-sm font-bold text-slate-900 flex items-center gap-2">
            <Printer className="w-4 h-4 text-indigo-600" /> Thermal Printer Slip Format
          </label>
          <div className="grid grid-cols-2 gap-4">
            {(['80mm', '58mm'] as ThermalPrinterWidth[]).map((width) => (
              <label
                key={width}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                  settings.thermal_printer_width === width
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <input
                  type="radio"
                  name="printer_width"
                  value={width}
                  checked={settings.thermal_printer_width === width}
                  onChange={() => setSettings({ ...settings, thermal_printer_width: width })}
                  className="accent-indigo-600"
                />
                <div>
                  <p className="font-bold text-sm">{width === '80mm' ? '80mm Standard POS' : '58mm Compact Receipt'}</p>
                  <p className="text-xs text-slate-500 font-normal">
                    {width === '80mm' ? 'Standard thermal desktop printer' : 'Small handheld Bluetooth printer'}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
