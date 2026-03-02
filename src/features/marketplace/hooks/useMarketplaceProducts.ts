import { useQuery } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import { useMarketplaceStore } from "../store";
import { SearchFilter } from "../types";
import { useApiAuth } from "@/lib/use-api-auth";
import { useShallow } from "zustand/react/shallow";
import { marketplaceApi } from "../api/marketplace.api";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { socket } from "@/lib/socket-client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const DEBOUNCE_MS = 300;

export function useMarketplaceProducts() {
  const { filters, setFilters, reset } = useMarketplaceStore(useShallow(state => ({
    filters: state.filters,
    setFilters: state.setFilters,
    reset: state.reset
  })));

  const { token } = useApiAuth();
  const queryClient = useQueryClient();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Real-time synchronization for Marketplace Hub
  useEffect(() => {
    if (!token) return;

    const handler = () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assets.all });
    };

    const unsubscribers = [
      socket.on("product.created", handler),
      socket.on("product.updated", handler),
      socket.on("product.asset_created", handler),
      socket.on("order.paid", handler),
      socket.on("subscription.created", handler),
      socket.on("subscription.updated", handler),
      socket.on("license.created", handler),
      socket.on("license.activated", handler),
    ];

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [token, queryClient]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.marketplace.products({ ...filters }),
    queryFn: () => marketplaceApi.search(filters),
    // El endpoint /public/marketplace/search no requiere autenticación.
    // Se carga siempre; el socket de real-time (que sí requiere token) se suscribe por separado.
    enabled: true,
    staleTime: 60 * 1000, // 1 minute
  });

  const searchWithDebounce = useCallback(
    (query: string) => {
// ... existing ...
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setFilters({ q: query, page: 1 });
      }, DEBOUNCE_MS);
    },
    [setFilters]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<SearchFilter>) => {
      setFilters({ ...newFilters, page: 1 });
    },
    [setFilters]
  );

  const nextPage = useCallback(() => {
    const currentPage = filters.page || 1;
    const totalPages = Math.ceil((data?.total || 0) / (filters.limit || 20));
    if (currentPage < totalPages) {
      setFilters({ page: currentPage + 1 });
    }
  }, [filters.page, filters.limit, data?.total, setFilters]);

  const prevPage = useCallback(() => {
    const currentPage = filters.page || 1;
    if (currentPage > 1) {
      setFilters({ page: currentPage - 1 });
    }
  }, [filters.page, setFilters]);

  return {
    products: data?.products || [],
    total: data?.total || 0,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    filters,
    currentPage: filters.page || 1,
    totalPages: Math.ceil((data?.total || 0) / (filters.limit || 20)),
    hasNextPage: (filters.page || 1) < Math.ceil((data?.total || 0) / (filters.limit || 20)),
    hasPrevPage: (filters.page || 1) > 1,
    searchWithDebounce,
    updateFilters,
    nextPage,
    prevPage,
    reset,
    refresh: refetch,
  };
}
