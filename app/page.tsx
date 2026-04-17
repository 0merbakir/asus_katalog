'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Zap, LayoutGrid, Store, Settings, Info, ArrowUpDown } from 'lucide-react';
import type { StoredProduct } from '@/lib/types';
import {
  initStorage,
  getMergedProducts,
  getStoreName,
  type SortMode
} from '@/lib/storage';
import ProductListItem from '@/components/ProductListItem';
import ProductDetailModal from '@/components/ProductDetailModal';
import { ToastProvider } from '@/components/ToastProvider';
import { InfoModal } from '@/components/InfoModal';

export default function HomePage() {
  const [products, setProducts] = useState<StoredProduct[]>([]);
  const [storeName, setStoreNameState] = useState('Gebze Teknosa');
  const [totalStock, setTotalStock] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<StoredProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('price');
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(() => {
    const merged = getMergedProducts(sortMode);
    setProducts(merged);
    setStoreNameState(getStoreName());
    setTotalStock(merged.reduce((sum, p) => sum + p.stock, 0));
  }, [sortMode]);

  useEffect(() => {
    initStorage().then(() => {
      refreshData();
      setIsLoading(false);
    });
  }, [refreshData]);

  const handleProductUpdate = useCallback((id: string, updates: Partial<StoredProduct>) => {
    refreshData();
    if (selectedProduct?.id === id) {
      const merged = getMergedProducts(sortMode);
      const updated = merged.find(p => p.id === id);
      if (updated) setSelectedProduct(updated);
    }
  }, [refreshData, selectedProduct, sortMode]);

  const openDetail = (product: StoredProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38bdf8]" />
      </div>
    );
  }

  return (
    <ToastProvider>
      <main className="min-h-dvh max-w-lg mx-auto bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-200 antialiased pb-20">
        {/* ── Minimal Header ─────────────────────────────────────────── */}
        <header className="sticky top-0 z-30 pt-safe bg-slate-50/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/60 px-5 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white glow-blue leading-tight">
              {storeName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest bg-slate-200 dark:bg-slate-800/40 px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700/50">
                {products.length} Ürün
              </span>
              <span className="text-[10px] font-bold text-[#38bdf8] uppercase tracking-widest bg-[#38bdf8]/10 px-2 py-0.5 rounded-full border border-[#38bdf8]/20">
                {totalStock} Stok
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSortMode(prev => prev === 'price' ? 'model' : 'price')}
              className={`p-2.5 rounded-xl border transition-all active:scale-95 flex items-center gap-2 ${
                sortMode === 'model'
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                  : 'bg-slate-200 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={sortMode === 'price' ? 'Fiyata Göre' : 'Modele Göre'}
            >
              <ArrowUpDown size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden xs:block">
                {sortMode === 'price' ? 'Fiyat' : 'Model'}
              </span>
            </button>

            <button
              onClick={() => setIsInfoOpen(true)}
              className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
              aria-label="Bilgi"
            >
              <Info size={20} />
            </button>
            <Link
              href="/admin"
              className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-[#38bdf8] transition-all active:scale-95"
              aria-label="Ayarlar"
            >
              <Settings size={20} />
            </Link>
          </div>
        </header>

        {/* ── Compact Product List ────────────────────────────────────────────── */}
        <div className="px-5 pt-4 space-y-3">
          {products.length === 0 ? (
            <div className="flex flex-col items-center py-20 opacity-40">
              <Zap size={48} className="mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest">Ürün Bulunamadı</p>
            </div>
          ) : (
            products.map((p) => (
              <ProductListItem
                key={p.id}
                product={p}
                onClick={() => openDetail(p)}
              />
            ))
          )}

          {/* List Footer */}
          <div className="flex flex-col items-center py-8 opacity-20">
            <LayoutGrid size={24} />
            <span className="text-[10px] font-bold mt-2 uppercase tracking-[0.3em]">
              Kataloğun Sonu
            </span>
          </div>
        </div>

        {/* Modals */}
        <ProductDetailModal
          product={selectedProduct}
          storeName={storeName}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onProductUpdate={handleProductUpdate}
        />

        <InfoModal 
          isOpen={isInfoOpen} 
          onClose={() => setIsInfoOpen(false)} 
        />
      </main>
    </ToastProvider>
  );
}
