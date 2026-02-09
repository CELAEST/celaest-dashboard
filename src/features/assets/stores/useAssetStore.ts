import { create } from "zustand";
import { assetsService, Asset } from "../services/assets.service";

interface AssetStore {
  assets: Asset[]; // Customer purchased assets
  inventory: Asset[]; // Organization catalog products
  isLoading: boolean;
  isInventoryLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  lastInventoryFetched: number | null;
  
  // Actions
  setAssets: (assets: Asset[]) => void;
  setInventory: (assets: Asset[]) => void;
  fetchAssets: (token: string, force?: boolean) => Promise<void>;
  fetchInventory: (token: string, orgId: string, force?: boolean) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setInventoryLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useAssetStore = create<AssetStore>((set, get) => ({
  assets: [],
  inventory: [],
  isLoading: false,
  isInventoryLoading: false,
  error: null,
  lastFetched: null,
  lastInventoryFetched: null,

  setAssets: (assets) => set({ 
    assets, 
    lastFetched: Date.now(), 
    isLoading: false 
  }),

  setInventory: (inventory) => set({
    inventory,
    lastInventoryFetched: Date.now(),
    isInventoryLoading: false
  }),

  fetchAssets: async (token: string, force = false) => {
    if (!token) return;
    const now = Date.now();
    const { lastFetched, isLoading } = get();
    if (!force && !isLoading && lastFetched && (now - lastFetched < 30000)) return;

    set({ isLoading: true, error: null });
    try {
      const assets = await assetsService.getMyAssets(token);
      set({ assets, lastFetched: Date.now(), isLoading: false });
    } catch (err: unknown) {
      console.error("[AssetStore] Error fetching assets:", err);
      set({ error: "No se pudieron cargar tus activos.", isLoading: false });
    }
  },

  fetchInventory: async (token: string, orgId: string, force = false) => {
    if (!token || !orgId) return;
    const now = Date.now();
    const { lastInventoryFetched, isInventoryLoading } = get();
    if (!force && !isInventoryLoading && lastInventoryFetched && (now - lastInventoryFetched < 30000)) return;

    set({ isInventoryLoading: true, error: null });
    try {
      const inventory = await assetsService.fetchInventory(token, orgId);
      set({ inventory, lastInventoryFetched: Date.now(), isInventoryLoading: false });
    } catch (err: unknown) {
      console.error("[AssetStore] Error fetching inventory:", err);
      set({ error: "No se pudo cargar el inventario.", isInventoryLoading: false });
    }
  },

  setLoading: (isLoading) => set({ isLoading }),
  setInventoryLoading: (isInventoryLoading) => set({ isInventoryLoading }),
  setError: (error) => set({ error, isLoading: false, isInventoryLoading: false }),

  clear: () => set({ 
    assets: [], 
    inventory: [],
    isLoading: false, 
    isInventoryLoading: false,
    error: null, 
    lastFetched: null,
    lastInventoryFetched: null
  }),
}));
