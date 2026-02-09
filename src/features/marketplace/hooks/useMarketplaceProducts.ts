/**
 * useMarketplaceProducts - Hook para búsqueda de productos
 * Responsabilidad única: búsqueda con debounce y estados de loading
 */
import { useEffect, useCallback, useRef } from "react";
import { useMarketplaceStore } from "../store";
import { SearchFilter } from "../types";
import { useApiAuth } from "@/lib/use-api-auth";

const DEBOUNCE_MS = 300;

export function useMarketplaceProducts() {
  const {
    products,
    total,
    loading,
    error,
    filters,
    setFilters,
    search,
    reset,
  } = useMarketplaceStore();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Búsqueda con debounce para el query de texto
  const searchWithDebounce = useCallback(
    (query: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        setFilters({ q: query, page: 1 });
      }, DEBOUNCE_MS);
    },
    [setFilters]
  );

  // Cambiar filtros sin debounce (categoría, precio, sort)
  const updateFilters = useCallback(
    (newFilters: Partial<SearchFilter>) => {
      setFilters({ ...newFilters, page: 1 });
    },
    [setFilters]
  );

  // Paginación
  const nextPage = useCallback(() => {
    const currentPage = filters.page || 1;
    const totalPages = Math.ceil(total / (filters.limit || 20));
    if (currentPage < totalPages) {
      setFilters({ page: currentPage + 1 });
    }
  }, [filters.page, filters.limit, total, setFilters]);

  const prevPage = useCallback(() => {
    const currentPage = filters.page || 1;
    if (currentPage > 1) {
      setFilters({ page: currentPage - 1 });
    }
  }, [filters.page, setFilters]);

  // Efecto: buscar cuando cambian los filtros
  useEffect(() => {
    search();
  }, [filters, search]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // WebSocket support for real-time catalog updates
  const { token, orgId } = useApiAuth();
  useEffect(() => {
    if (!token) return;

    let cleanup = () => {};

    import("@/lib/socket-client").then(({ socket }) => {
      socket.connect(token, orgId || undefined);

      const handleRefresh = () => {
        search();
      };

      const offs = [
        socket.on("product.created", handleRefresh),
        socket.on("product.updated", handleRefresh),
        socket.on("product.deleted", handleRefresh),
      ];

      cleanup = () => {
        offs.forEach(off => off());
      };
    });

    return () => cleanup();
  }, [token, search, orgId]);

  return {
    // Data
    products,
    total,
    loading,
    error,
    filters,

    // Computed
    currentPage: filters.page || 1,
    totalPages: Math.ceil(total / (filters.limit || 20)),
    hasNextPage: (filters.page || 1) < Math.ceil(total / (filters.limit || 20)),
    hasPrevPage: (filters.page || 1) > 1,

    // Actions
    searchWithDebounce,
    updateFilters,
    nextPage,
    prevPage,
    reset,
    refresh: search,
  };
}
