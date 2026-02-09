import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MarketplaceProduct, SearchFilter } from "./types";
import { marketplaceService } from "./services/marketplace.service";

interface MarketplaceState {
  products: MarketplaceProduct[];
  total: number;
  loading: boolean;
  error: string | null;
  filters: SearchFilter;

  // Acciones
  setFilters: (filters: Partial<SearchFilter>) => void;
  search: () => Promise<void>;
  reset: () => void;
}

export const useMarketplaceStore = create<MarketplaceState>()(
  persist(
    (set, get) => ({
      products: [],
      total: 0,
      loading: false,
      error: null,
      filters: {
        page: 1,
        limit: 20,
        sort: "newest",
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters, page: newFilters.page || 1 },
        }));
      },

      search: async () => {
        set({ loading: true, error: null });
        try {
          const { filters } = get();
          const response = await marketplaceService.search(filters);
          
          set({ 
            products: response?.products || [], 
            total: response?.total || 0,
            loading: false 
          });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Error al buscar productos";
          set({ error: message, loading: false });
        }
      },

      reset: () => {
        set({
          products: [],
          total: 0,
          loading: false,
          error: null,
          filters: {
            page: 1,
            limit: 20,
            sort: "newest",
          },
        });
      },
    }),
    {
      name: "celaest-marketplace-cache",
      partialize: (state) => ({ filters: state.filters }), // Solo persistir filtros
    }
  )
);
