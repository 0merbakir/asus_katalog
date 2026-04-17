export interface Product {
  id: string;
  modelCode: string;
  name: string;
  price: number;       // Teknosa'dan gelen fiyat
  imageUrls: string[];
  url?: string;
  spiff?: string;
  features?: string;
}

export interface StoredProduct extends Product {
  manualPrice?: number; // Kullanıcının manuel girdiği fiyat (öncelikli)
  stock: number;
  spiffActive?: boolean;
}

export interface AppState {
  products: StoredProduct[];
  storeName: string;
  lastUpdated: string | null;
}
