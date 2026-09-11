import Link from 'next/link';
import { Utensils, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-200 shadow-sm">
        <Utensils className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 mb-2">404 - Page Not Found</h1>
      <p className="text-slate-600 text-sm max-w-md mb-6">
        The page or bill receipt you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-600/20 transition"
      >
        <Home className="w-4 h-4" /> Return to Home
      </Link>
    </div>
  );
}
