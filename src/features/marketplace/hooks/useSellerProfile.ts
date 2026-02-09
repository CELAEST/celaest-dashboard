/**
 * useSellerProfile - Hook para perfil de vendedor
 * Responsabilidad única: fetch de perfil público de vendedor
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { SellerProfile } from "../types";
import { marketplaceService } from "../services/marketplace.service";

interface SellerProfileState {
  seller: SellerProfile | null;
  loading: boolean;
  error: string | null;
}

export function useSellerProfile(sellerId: string | null) {
  const isMounted = useRef(true);
  const [state, setState] = useState<SellerProfileState>({
    seller: null,
    loading: false,
    error: null,
  });

  const fetchSeller = useCallback(async () => {
    if (!sellerId) return;

    if (isMounted.current) {
        setState((prev) => ({ ...prev, loading: true, error: null }));
    }

    try {
      const data = await marketplaceService.getSellerProfile(sellerId);
      if (isMounted.current) {
        setState({
          seller: data,
          loading: false,
          error: null,
        });
      }
    } catch (err: unknown) {
      if (isMounted.current) {
        const message = err instanceof Error ? err.message : "Error al cargar vendedor";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: message,
        }));
      }
    }
  }, [sellerId]);

  useEffect(() => {
    isMounted.current = true;
    
    if (sellerId) {
      // Wrap in microtask to avoid synchronous setState warning
      Promise.resolve().then(() => {
        if (isMounted.current) {
          fetchSeller();
        }
      });
    } else {
      Promise.resolve().then(() => {
        if (isMounted.current) {
          setState({
            seller: null,
            loading: false,
            error: null,
          });
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
  }, [sellerId, fetchSeller]);

  return {
    ...state,
    refresh: fetchSeller,
  };
}
