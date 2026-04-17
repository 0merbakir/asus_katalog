'use client';

import { Tag } from 'lucide-react';
import type { StoredProduct } from '@/lib/types';

interface Props {
  product: StoredProduct;
  onClick: () => void;
}

function formatPrice(n: number) {
  return n.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });
}

export default function ProductListItem({ product, onClick }: Props) {
  const displayPrice = product.manualPrice ?? product.price;
  const hasManualPrice = product.manualPrice !== undefined;
  const image = product.imageUrls[0];

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-3 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-2xl active:scale-[0.98] transition-all hover:border-[#38bdf8]/30 dark:hover:border-[#38bdf8]/30 group text-left shadow-sm dark:shadow-none"
    >
      {/* Small Image Thumbnail */}
      <div className="w-16 h-16 bg-slate-100 dark:bg-[#172033] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
        {image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={image} alt={product.name} className="w-full h-full object-contain p-1" />
        ) : (
          <div className="text-slate-400 dark:text-[#334155] opacity-50">
            <Tag size={20} />
          </div>
        )}
      </div>

      {/* Info Group */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
            {product.modelCode}
          </h3>
          {product.spiffActive && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#c084fc]/20 border border-[#c084fc]/30 text-[#c084fc] text-[8px] font-black uppercase tracking-widest">
              SPIFF
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-slate-900 dark:text-white/90 leading-tight line-clamp-1">
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-sm font-bold ${hasManualPrice ? 'text-[#c084fc]' : 'text-[#38bdf8]'}`}>
            {formatPrice(displayPrice)}
          </span>
        </div>
      </div>

      {/* Stock Badge */}
      <div className={`px-2.5 py-1.5 rounded-lg border text-xs font-black min-w-[2.5rem] text-center ${
        product.stock > 0
          ? 'bg-[#38bdf8]/10 border-[#38bdf8]/30 text-[#38bdf8]'
          : 'bg-red-500/10 border-red-500/30 text-red-400'
      }`}>
        {product.stock}
      </div>
    </button>
  );
}
