'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Layers, 
  History, 
  Settings, 
  CreditCard, 
  Menu as MenuIcon, 
  ArrowLeft,
  LogOut
} from 'lucide-react';
import ProtectedGuard from '@/components/auth/ProtectedGuard';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: 'Overview & Sales', href: '/admin', icon: LayoutDashboard },
    { label: 'Food Items & Stock', href: '/admin/items', icon: UtensilsCrossed },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Bill History & Export', href: '/admin/history', icon: History },
    { label: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <ProtectedGuard>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 shadow-sm">
          <div>
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900 text-base leading-tight">Admin Console</h2>
                  <p className="text-[11px] text-slate-500 font-medium">Galaxy Bamboo Hut</p>
                </div>
              </div>
            </div>

            {/* Quick Terminal Links */}
            <div className="p-3 grid grid-cols-2 gap-2 border-b border-slate-100 bg-slate-50/50">
              <Link
                href="/pos"
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 transition"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>POS Terminal</span>
              </Link>
              <Link
                href="/menu"
                target="_blank"
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition"
              >
                <MenuIcon className="w-3.5 h-3.5" />
                <span>Public Menu</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer info & Logout */}
          <div className="p-4 border-t border-slate-100 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Staff Logout
            </button>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <Link href="/" className="flex items-center gap-1 hover:text-indigo-600 transition font-medium">
                <ArrowLeft className="w-3.5 h-3.5" /> Home Page
              </Link>
              <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">v1.0</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-slate-50 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </ProtectedGuard>
  );
}
