'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginWithCode } from '@/lib/auth';
import { UtensilsCrossed, Key, ArrowRight, Menu as MenuIcon, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/pos';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Please enter your staff access code');
      return;
    }

    setLoading(true);
    try {
      const success = await loginWithCode(code);
      if (success) {
        toast.success('Staff Authentication Successful');
        router.push(redirectPath);
      } else {
        toast.error('Invalid access code. Please try again.');
      }
    } catch {
      toast.error('Authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-slate-900">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
        {/* Logo Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-indigo-600/20">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Galaxy Staff Terminal</h1>
          <p className="text-xs text-slate-500 font-medium">Secure Counter POS & Admin Console Access</p>
        </div>

        {/* Access Code Form */}
        <form onSubmit={handleCodeLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 text-center flex items-center justify-center gap-1.5">
              <Key className="w-4 h-4 text-indigo-600" /> Enter Staff Access Code
            </label>
            <input
              type="password"
              required
              autoFocus
              placeholder="••••••"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-center text-2xl font-mono tracking-widest text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
            />
            <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Protected Staff Access Area
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Verifying...' : 'Unlock Staff Terminal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Public Digital Menu Quick Link */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2">
          <p className="text-xs text-slate-500">Customer looking for digital menu?</p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl transition"
          >
            <MenuIcon className="w-3.5 h-3.5" /> Open Public Digital Menu (No Login Required)
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
