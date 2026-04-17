'use client';

import React from 'react';
import { X, Info, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-slate-900/90 border border-slate-700/50 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
            <Info size={32} />
          </div>

          <h2 className="text-xl font-black text-white mb-4 tracking-tight">
            Önemli Bilgilendirme
          </h2>

          <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
            <div className="flex gap-3 text-left">
              <div className="mt-1 text-blue-400 shrink-0">
                <Lightbulb size={18} />
              </div>
              <p>
                <strong>Stok Bilgisi:</strong> Stok adetlerini manuel olarak "Ayarlar" sayfasından veya ürün detayından güncellemeniz gerekmektedir.
              </p>
            </div>

            <div className="flex gap-3 text-left">
              <div className="mt-1 text-orange-400 shrink-0">
                <AlertTriangle size={18} />
              </div>
              <p>
                <strong>Fiyat Değişikliği:</strong> Fiyatlar mağazadan mağazaya değişiklik gösterebilir. Lütfen merkez sistemden kontrol edip güncelleyiniz.
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex gap-3 text-left opacity-60">
              <div className="mt-0.5 text-slate-400 shrink-0">
                <CheckCircle size={14} />
              </div>
              <p className="text-[11px] leading-tight">
                <strong>Veri Saklama:</strong> Veriler sadece tarayıcı çerezlerinizde depolanır. Başka bir cihazdan veya tarayıcıdan bu verilere erişemezsiniz.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-8 w-full py-4 rounded-2xl bg-blue-500 text-[#0f172a] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-400 transition-all active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
}
