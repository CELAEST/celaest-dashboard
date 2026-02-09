import { useState, useEffect, useCallback } from "react";
import { MarketplaceProduct, Review } from "../types";
import { marketplaceService } from "../services/marketplace.service";
import { useApiAuth } from "@/lib/use-api-auth";

interface ProductDetailState {
  product: MarketplaceProduct | null;
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

export function useProductDetail(slug: string | null) {
  const { token } = useApiAuth();
  const [state, setState] = useState<ProductDetailState>({
    product: null,
    reviews: [],
    loading: false,
    error: null,
  });

  const fetchProduct = useCallback(async () => {
    if (!slug) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await marketplaceService.getProductDetail(slug);
      setState({
        product: data.product,
        reviews: data.reviews || [],
        loading: false,
        error: null,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al cargar producto";
      setState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));
    }
  }, [slug]);

  // Fetch cuando cambia el slug
  useEffect(() => {
    if (slug) {
      fetchProduct();
    } else {
      setState({
        product: null,
        reviews: [],
        loading: false,
        error: null,
      });
    }
  }, [slug, fetchProduct]);

  // WebSocket support
  useEffect(() => {
    if (!token || !state.product?.id) return;

    let cleanup = () => {};

    import("@/lib/socket-client").then(({ socket }) => {
      socket.connect(token);

      cleanup = socket.on("marketplace.review_created", (payload: unknown) => {
        const review = payload as Review;
        // Solo refrescar si la review es para ESTE producto
        if (review?.product_id === state.product?.id) {
          fetchProduct();
        }
      });
    });

    return () => cleanup();
  }, [token, state.product?.id, fetchProduct]);

  return {
    ...state,
    refresh: fetchProduct,
  };
}
