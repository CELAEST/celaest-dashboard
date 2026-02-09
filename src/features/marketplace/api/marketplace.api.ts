import { api } from "@/lib/api-client";
import { 
  MarketplaceProduct, 
  Review, 
  SellerProfile, 
  SearchFilter, 
  CreateReviewInput,
  ProductSearchResponse,
  CheckoutResponse
} from "../types";

export const marketplaceApi = {
  /**
   * Buscar productos en el marketplace global
   */
  search: async (filter: SearchFilter) => {
    const params: Record<string, string> = {};
    if (filter.q) params.q = filter.q;
    if (filter.category) params.category = filter.category;
    if (filter.min_price) params.min_price = filter.min_price.toString();
    if (filter.max_price) params.max_price = filter.max_price.toString();
    if (filter.sort) params.sort = filter.sort;
    if (filter.page) params.page = filter.page.toString();
    if (filter.limit) params.limit = filter.limit.toString();

    return api.get<ProductSearchResponse>("/api/v1/public/marketplace/search", { params });
  },

  /**
   * Obtener detalle de un producto por su slug
   */
  getBySlug: async (slug: string) => {
    return api.get<{ product: MarketplaceProduct, reviews: Review[] }>(
      `/api/v1/public/marketplace/products/${slug}`
    );
  },

  /**
   * Obtener perfil público de un vendedor
   */
  getSellerProfile: async (sellerId: string) => {
    return api.get<SellerProfile>(`/api/v1/public/marketplace/sellers/${sellerId}`);
  },

  /**
   * Enviar una reseña (Requiere Auth)
   */
  submitReview: async (productId: string, data: CreateReviewInput, token: string) => {
    return api.post<void>(
      `/api/v1/user/marketplace/products/${productId}/reviews`, 
      data, 
      { token }
    );
  },

  /**
   * Actualizar perfil de vendedor (Requiere Tenant Auth)
   */
  updateProfile: async (data: Partial<SellerProfile>, token: string, orgId: string) => {
    return api.put<void>("/api/v1/org/marketplace/seller-profile", data, { 
      token, 
      orgId 
    });
  },

  /**
   * Crear sesión de checkout para comprar un producto (Requiere Auth)
   */
  createCheckoutSession: async (productId: string, token: string) => {
    return api.post<CheckoutResponse>(
      "/api/v1/user/marketplace/checkout",
      { product_id: productId },
      { token }
    );
  },

  /**
   * Verificar estado de una compra (Polling actively)
   */
  verifyPurchase: async (sessionId: string, token: string) => {
    return api.get<{ 
      status: string; 
      message?: string; 
      has_access: boolean;
      product_id?: string;
    }>(
      `/api/v1/user/marketplace/checkout/verify/${sessionId}`,
      { token }
    );
  }
};
