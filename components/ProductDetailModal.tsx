'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Copy, Minus, Plus, Tag, CheckCircle, Package, Info } from 'lucide-react';
import type { StoredProduct } from '@/lib/types';
import { setManualPrice, setStock, setSpiffActive, deleteProduct } from '@/lib/storage';
import { useToast } from './ToastProvider';

interface Props {
  product: StoredProduct | null;
  storeName: string;
  isOpen: boolean;
  onClose: () => void;
  onProductUpdate: (id: string, updates: Partial<StoredProduct>) => void;
}

function formatPrice(n: number) {
  return n.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });
}

export default function ProductDetailModal({ product, storeName, isOpen, onClose, onProductUpdate }: Props) {
  const { showToast } = useToast();
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setPriceInput(String(product.manualPrice ?? product.price));
      setImgIdx(0);
    }
  }, [product]);

  if (!product) return null;

  const displayPrice = product.manualPrice ?? product.price;
  const hasManualPrice = product.manualPrice !== undefined;
  const images = product.imageUrls;

  const commitPrice = () => {
    const parsed = parseInt(priceInput.replace(/\D/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) {
      setManualPrice(product.id, parsed);
      onProductUpdate(product.id, { manualPrice: parsed });
      showToast('Fiyat güncellendi', 'success');
    }
    setEditingPrice(false);
  };

  const changeStock = (delta: number) => {
    const next = Math.max(0, product.stock + delta);
    setStock(product.id, next);
    onProductUpdate(product.id, { stock: next });
  };

  const handleCopy = async () => {
    try {
      const text = `${product.modelCode} ${storeName}`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Panoya kopyalandı!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Kopyalama başarısız', 'error');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Detail Panel — Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-slate-50 dark:bg-[#0f172a] border-t border-slate-200 dark:border-[#334155] rounded-t-3xl max-w-lg mx-auto transition-transform duration-300 ease-out overflow-y-auto max-h-[90dvh] ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle */}
        <div className="w-12 h-1.5 bg-slate-700/50 rounded-full mx-auto my-4" onClick={onClose} />

        {/* Content */}
        <div className="px-6 pb-12 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xs font-black text-[#38bdf8] uppercase tracking-[0.2em]">
                  {product.modelCode}
                </h2>
                {product.spiffActive && (
                  <span className="px-2 py-0.5 rounded-full bg-[#c084fc]/20 border border-[#c084fc]/30 text-[#c084fc] text-[9px] font-black uppercase tracking-widest animate-pulse">
                    {product.spiff && product.spiff !== '0 TL' ? product.spiff : 'SPIFF'}
                  </span>
                )}
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                {product.name}
              </h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 active:scale-90 transition-transform"
            >
              <X size={20} />
            </button>
          </div>

          {/* Image Slider */}
          <div className="relative aspect-video bg-slate-100 dark:bg-[#172033] rounded-2xl overflow-hidden shadow-inner">
            {images.length > 0 ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[imgIdx]}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 transition-opacity duration-300"
                />
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === imgIdx ? 'bg-[#38bdf8] w-4' : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-700">
                <Tag size={48} />
                <span className="text-xs mt-2 uppercase font-bold tracking-widest">Görsel Yok</span>
              </div>
            )}
          </div>

          {/* Details & Features */}
          {product.features && (
            <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-4 flex gap-3 shadow-none">
              <Info size={18} className="text-[#38bdf8] flex-shrink-0" />
              <p className="text-sm text-slate-600 dark:text-slate-300/90 leading-relaxed italic">
                {product.features}
              </p>
            </div>
          )}

          {/* Editor Sections */}
          <div className="grid grid-cols-2 gap-4">
            {/* Price Editor */}
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Fiyat Yönetimi</label>
              <div className="bg-white dark:bg-[#172033] border border-slate-200 dark:border-[#334155] rounded-2xl p-4 shadow-sm dark:shadow-none">
                {editingPrice ? (
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="number"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      onBlur={commitPrice}
                      onKeyDown={(e) => e.key === 'Enter' && commitPrice()}
                      className="flex-1 bg-slate-50 dark:bg-slate-900 border border-[#38bdf8] rounded-xl px-4 py-2 text-[#38bdf8] font-bold text-lg focus:outline-none"
                      autoFocus
                    />
                  </div>
                ) : (
                  <button onClick={() => setEditingPrice(true)} className="w-full flex items-center justify-between group">
                    <div className="flex flex-col items-start">
                      <span className={`text-2xl font-black tracking-tight ${hasManualPrice ? 'text-[#c084fc]' : 'text-[#38bdf8]'}`}>
                        {formatPrice(displayPrice)}
                      </span>
                      {hasManualPrice && <span className="text-[9px] font-bold text-[#c084fc]/70 uppercase tracking-wider">Manuel Override Etkin</span>}
                    </div>
                    <Tag size={20} className="text-slate-600 group-hover:text-[#38bdf8] transition-colors" />
                  </button>
                )}
              </div>
            </div>

            {/* Stock Manager */}
            <div className="space-y-2 flex-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Stok Durumu</label>
              <div className="flex items-center justify-between bg-white dark:bg-[#172033] border border-slate-200 dark:border-[#334155] rounded-2xl p-1 shrink-0 shadow-sm dark:shadow-none">
                <button
                  onClick={() => changeStock(-1)}
                  className="w-10 h-10 flex items-center justify-center text-slate-400 active:scale-90 transition-transform"
                >
                  <Minus size={20} />
                </button>
                <div className="text-lg font-black text-slate-900 dark:text-white px-2">
                  {product.stock}
                </div>
                <button
                  onClick={() => changeStock(1)}
                  className="w-10 h-10 flex items-center justify-center text-[#38bdf8] active:scale-90 transition-transform"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* SPIFF Toggle */}
            <div className="space-y-2 flex-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">SPIFF Durumu</label>
              <button 
                onClick={() => {
                  const next = !product.spiffActive;
                  setSpiffActive(product.id, next);
                  onProductUpdate(product.id, { spiffActive: next });
                }}
                className={`flex items-center justify-between w-full h-12 px-4 rounded-2xl border transition-all active:scale-95 ${
                  product.spiffActive 
                    ? 'bg-[#c084fc]/10 border-[#c084fc]/40 text-[#c084fc]' 
                    : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider">
                  {product.spiffActive ? 'SPIFF AKTİF' : 'SPIFF PASİF'}
                </span>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${product.spiffActive ? 'bg-[#c084fc]' : 'bg-slate-600'}`}>
                   <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${product.spiffActive ? 'left-[18px]' : 'left-[2px]'}`} />
                </div>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleCopy}
              className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                copied
                  ? 'bg-[#38bdf8] text-[#0f172a]'
                  : 'bg-white text-[#0f172a] hover:bg-slate-200'
              }`}
            >
              {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
              {copied ? 'Kopyalandı' : 'Detayları Kopyala'}
            </button>

            {/* Delete Button with Double Confirmation */}
            <button
              onClick={() => {
                const btn = document.getElementById('delete-btn');
                if (btn?.getAttribute('data-confirm') === 'true') {
                  deleteProduct(product.id);
                  onProductUpdate(product.id, {}); // Trigger list refresh
                  showToast('Ürün kaldırıldı', 'info');
                  onClose();
                  // Full reload to ensure state is clean
                  setTimeout(() => window.location.reload(), 300);
                } else {
                  btn?.setAttribute('data-confirm', 'true');
                  const label = btn?.querySelector('.label');
                  if (label) label.textContent = 'Emin misiniz? (Silmek için bir daha basın)';
                  btn?.classList.add('bg-red-500', 'text-white');
                  btn?.classList.remove('bg-red-500/10', 'text-red-400');
                  setTimeout(() => {
                    btn?.setAttribute('data-confirm', 'false');
                    if (label) label.textContent = 'Ürünü Kaldır';
                    btn?.classList.remove('bg-red-500', 'text-white');
                    btn?.classList.add('bg-red-500/10', 'text-red-400');
                  }, 3000);
                }
              }}
              id="delete-btn"
              data-confirm="false"
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95"
            >
              <span className="label">Ürünü Kaldır</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
