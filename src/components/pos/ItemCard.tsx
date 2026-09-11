import { MenuItem } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { Plus, Image as ImageIcon } from 'lucide-react';

interface ItemCardProps {
  item: MenuItem;
  currencySymbol: string;
  onAddToCart: (item: MenuItem) => void;
  cartCount: number;
}

// Helper to extract portion size like (Quarter), (Half), (Full) for visual badges
function parseItemPortion(fullName: string) {
  const match = fullName.match(/\((Quarter|Half|Full|Single|Q|1\/2|Full)\)/i);
  if (match) {
    const cleanName = fullName.replace(match[0], '').trim();
    const portion = match[1];
    return { name: cleanName, portion };
  }
  return { name: fullName, portion: null };
}

export default function ItemCard({ item, currencySymbol, onAddToCart, cartCount }: ItemCardProps) {
  const { name, portion } = parseItemPortion(item.name);

  return (
    <div
      onClick={() => item.is_available && onAddToCart(item)}
      title={item.name}
      className={`group bg-white border rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 select-none shadow-sm ${
        item.is_available
          ? 'border-slate-200 hover:border-indigo-500 hover:shadow-md'
          : 'border-slate-200 opacity-50 cursor-not-allowed'
      }`}
    >
      {/* Thumbnail Image */}
      <div className="w-full h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative mb-2 flex items-center justify-center text-slate-400">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <ImageIcon className="w-8 h-8 opacity-40" />
        )}

        {/* Portion Badge Top-Left */}
        {portion && (
          <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-sm border border-white/20 uppercase tracking-wider">
            {portion}
          </div>
        )}

        {/* Quantity Badge in Cart Top-Right */}
        {cartCount > 0 && (
          <div className="absolute top-2 right-2 bg-indigo-600 text-white font-extrabold text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-md">
            {cartCount}
          </div>
        )}
      </div>

      {/* Item Details - 2 lines complete title support */}
      <div className="space-y-1">
        <div className="min-h-[2.5rem] flex flex-col justify-center">
          <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 transition">
            {item.name}
          </h4>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <span className="font-black text-indigo-600 text-sm sm:text-base">
            {formatCurrency(item.price, currencySymbol)}
          </span>

          {item.is_available ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(item);
              }}
              className="w-7 h-7 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-200 flex items-center justify-center transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[10px] uppercase font-bold text-rose-600">Sold Out</span>
          )}
        </div>
      </div>
    </div>
  );
}
