'use client';

import type { Product, StoredProduct } from './types';

const KEYS = {
  PRODUCTS: 'asus_products',
  MANUAL_PRICES: 'asus_manual_prices',
  STOCKS: 'asus_stocks',
  STORE_NAME: 'asus_store_name',
  LAST_UPDATED: 'asus_last_updated',
  MANUAL_PRODUCTS: 'asus_manual_products',
  SPIFF_STATES: 'asus_spiff_states',
  DELETED_IDS: 'asus_deleted_ids',
};

const DEFAULT_STORE_NAME = 'Gebze Teknosa';

// ─── JSON Storage Sync ────────────────────────────────────────────────────────

export interface AppState {
  products: Product[];
  manualProducts: Product[];
  settings: {
    storeName: string;
  };
  overrides: {
    prices: Record<string, number>;
    stocks: Record<string, number>;
    spiffStates: Record<string, boolean>;
    deletedIds: string[];
  };
}

let cache: AppState | null = null;

async function fetchState(): Promise<AppState> {
  const res = await fetch('/api/storage');
  return res.json();
}

async function saveState(state: AppState) {
  await fetch('/api/storage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  });
}

export async function initStorage(): Promise<AppState> {
  if (!cache) {
    cache = await fetchState();
  }
  return cache;
}

function getCache(): AppState {
  if (!cache) {
    // Fallsave if accessed before init (should not happen with proper useEffect)
    return {
      products: [],
      manualProducts: [],
      settings: { storeName: DEFAULT_STORE_NAME },
      overrides: { prices: {}, stocks: {}, spiffStates: {}, deletedIds: [] }
    };
  }
  return cache;
}

// ─── Store name ───────────────────────────────────────────────────────────────

export function getStoreName(): string {
  return getCache().settings.storeName;
}

export function setStoreName(name: string): void {
  const state = getCache();
  state.settings.storeName = name;
  saveState(state);
}

// ─── Manual prices ────────────────────────────────────────────────────────────

export function getManualPrices(): Record<string, number> {
  return getCache().overrides.prices;
}

export function setManualPrice(productId: string, price: number): void {
  const state = getCache();
  state.overrides.prices[productId] = price;
  saveState(state);
}

// ─── Stocks ───────────────────────────────────────────────────────────────────

export function getStocks(): Record<string, number> {
  return getCache().overrides.stocks;
}

export function setStock(productId: string, stock: number): void {
  const state = getCache();
  state.overrides.stocks[productId] = Math.max(0, stock);
  saveState(state);
}

// ─── Manual Added Products ────────────────────────────────────────────────────

export function getManualProducts(): Product[] {
  return getCache().manualProducts;
}

export function addManualProduct(product: Product): void {
  const state = getCache();
  state.manualProducts.push(product);
  saveState(state);
}

// ─── SPIFF States ────────────────────────────────────────────────────────────

export function getSpiffStates(): Record<string, boolean> {
  return getCache().overrides.spiffStates;
}

export function setSpiffActive(productId: string, active: boolean): void {
  const state = getCache();
  state.overrides.spiffStates[productId] = active;
  saveState(state);
}

// ─── Delete Products ─────────────────────────────────────────────────────────

export function getDeletedIds(): string[] {
  return getCache().overrides.deletedIds;
}

export function deleteProduct(productId: string): void {
  const state = getCache();
  // 1. Remove from manual products
  const countBefore = state.manualProducts.length;
  state.manualProducts = state.manualProducts.filter(p => p.id !== productId);
  
  if (state.manualProducts.length === countBefore) {
    // 2. If not manual, add to deleted ids list
    if (!state.overrides.deletedIds.includes(productId)) {
      state.overrides.deletedIds.push(productId);
    }
  }
  saveState(state);
}

// ─── Sorting Logic ───────────────────────────────────────────────────────────

export type SortMode = 'price' | 'model';

const MODEL_PRIORITY: Record<string, number> = {
  'vivobook': 1,
  'zenbook': 2,
  'expertbook': 3,
  'proart': 4,
  'tuf': 5,
  'rog': 6,
};

function getModelPriority(name: string): number {
  const n = name.toLowerCase();
  for (const [key, priority] of Object.entries(MODEL_PRIORITY)) {
    if (n.includes(key)) return priority;
  }
  return 99;
}

// ─── Merged products (base + overrides) ──────────────────────────────────────

export function getMergedProducts(sortMode: SortMode = 'price'): StoredProduct[] {
  const state = getCache();
  const { products: base, manualProducts: manualAdded, overrides } = state;
  const { prices: manualPrices, stocks, spiffStates, deletedIds } = overrides;

  const all = [...base, ...manualAdded];

  // ID'ye göre tekilleştir
  const map = new Map<string, Product>();
  all.forEach(p => {
    if (!deletedIds.includes(p.id)) {
      map.set(p.id, p);
    }
  });

  const merged = Array.from(map.values()).map((p) => ({
    ...p,
    manualPrice: manualPrices[p.id],
    stock: stocks[p.id] ?? 0,
    spiffActive: spiffStates[p.id] ?? false,
  }));

  // Sıralama
  return merged.sort((a, b) => {
    if (sortMode === 'model') {
      const priA = getModelPriority(a.name);
      const priB = getModelPriority(b.name);
      if (priA !== priB) return priA - priB;
      // Aynı modelse fiyata göre
    }
    
    const priceA = a.manualPrice ?? a.price;
    const priceB = b.manualPrice ?? b.price;
    return priceA - priceB;
  });
}

export function getLastUpdated(): string {
  return new Date().toISOString();
}
