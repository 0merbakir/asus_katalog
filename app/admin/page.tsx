'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, Store, RotateCcw, Plus, Tag, Package, Info, Sun, Moon } from 'lucide-react';
import { setStoreName, getStoreName, initStorage, addManualProduct } from '@/lib/storage';
import { useToast } from '@/components/ToastProvider';
import { useTheme } from 'next-themes';

export default function AdminPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [storeName, setStoreNameState] = useState('');
  const [nameInput, setNameInput] = useState('');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    initStorage().then(() => {
      const currentName = getStoreName();
      setStoreNameState(currentName);
      setNameInput(currentName);
    });
  }, []);

  const saveStoreName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      setStoreName(trimmed);
      setStoreNameState(trimmed);
      showToast(`Mağaza adı güncellendi: ${trimmed}`, 'success');
    }
  };

  const handleAddProduct = () => {
    const model = (document.getElementById('new-model') as HTMLInputElement).value;
    const name = (document.getElementById('new-name') as HTMLInputElement).value;
    const price = (document.getElementById('new-price') as HTMLInputElement).value;
    const spiff = (document.getElementById('new-spiff') as HTMLInputElement).value;
    const image = (document.getElementById('new-image') as HTMLInputElement).value;
    const features = (document.getElementById('new-features') as HTMLTextAreaElement).value;

    if (model && name && price) {
      const newProd = {
        id: model.toLowerCase().replace(/\s+/g, '-'),
        modelCode: model,
        name,
        price: parseInt(price, 10),
        spiff: spiff || '0 TL',
        features,
        imageUrls: image ? [image] : [],
      };
      addManualProduct(newProd);
      showToast('Yeni ürün eklendi!', 'success');
      
      // Clear inputs
      (document.getElementById('new-model') as HTMLInputElement).value = '';
      (document.getElementById('new-name') as HTMLInputElement).value = '';
      (document.getElementById('new-price') as HTMLInputElement).value = '';
      (document.getElementById('new-spiff') as HTMLInputElement).value = '';
      (document.getElementById('new-image') as HTMLInputElement).value = '';
      (document.getElementById('new-features') as HTMLTextAreaElement).value = '';
    } else {
      showToast('Lütfen zorunlu alanları doldurun', 'error');
    }
  };

  return (
    <main className="min-h-dvh max-w-lg mx-auto bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 antialiased pb-20">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 pt-safe bg-slate-50/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/60 px-5 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push('/')}
          className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings size={20} className="text-[#38bdf8]" />
          Yönetim Paneli
        </h1>
        <div className="ml-auto">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* ── Store Settings ────────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Genel Ayarlar</h2>
          <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-3xl p-6 space-y-5 shadow-sm dark:shadow-none">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                <Store size={15} className="text-[#38bdf8]" />
                Mağaza Adı
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Örn: Gebze Teknosa"
                  className="flex-1 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-2xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#38bdf8]/60 text-sm"
                />
                <button
                  onClick={saveStoreName}
                  className="w-full sm:w-auto shrink-0 px-8 py-3 rounded-2xl bg-[#38bdf8] text-[#0f172a] text-sm font-black uppercase tracking-wider hover:bg-[#38bdf8]/90 transition-colors active:scale-95"
                >
                  Kaydet
                </button>
              </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-[#334155]/50" />
          </div>
        </section>

        {/* ── Add Product Form ────────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Yeni Ürün Ekle</h2>
          <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-3xl p-6 space-y-4 shadow-sm dark:shadow-none">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Model Bilgisi</label>
              <input
                type="text"
                placeholder="Model Kodu (Örn: UX8406)"
                className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#38bdf8]/50 outline-none"
                id="new-model"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Ürün Adı</label>
              <input
                type="text"
                placeholder="Ürün Adı"
                className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#38bdf8]/50 outline-none"
                id="new-name"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Fiyat (TL)</label>
                <input
                  type="number"
                  placeholder="24.999"
                  className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#38bdf8]/50 outline-none"
                  id="new-price"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">SPIFF (İsteğe bağlı)</label>
                <input
                  type="text"
                  placeholder="1.000 TL"
                  className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#38bdf8]/50 outline-none"
                  id="new-spiff"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Görsel URL</label>
              <input
                type="text"
                placeholder="https://..."
                className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#38bdf8]/50 outline-none"
                id="new-image"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Özellikler</label>
              <textarea
                placeholder="Örn: 32GB RAM, 1TB SSD, OLED"
                className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#38bdf8]/50 outline-none resize-none"
                rows={3}
                id="new-features"
              />
            </div>

            <button
              onClick={handleAddProduct}
              className="w-full flex items-center justify-center gap-2 py-5 bg-[#38bdf8] text-[#0f172a] rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#38bdf8]/90 transition-all active:scale-95 shadow-lg shadow-[#38bdf8]/20 dark:shadow-none"
            >
              <Plus size={20} />
              Ürünü Kaydet
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
