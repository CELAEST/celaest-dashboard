import { marketplaceApi } from "../api/marketplace.api";
import { 
  SearchFilter, 
  CreateReviewInput 
} from "../types";

export const marketplaceService = {
  /**
   * Buscar productos en el marketplace
   */
  async search(filter: SearchFilter) {
    const response = await marketplaceApi.search(filter);
    return response;
  },

  /**
   * Obtener detalle de un producto
   */
  async getProductDetail(slug: string) {
    return marketplaceApi.getBySlug(slug);
  },

  /**
   * Obtener perfil del vendedor
   */
  async getSellerProfile(sellerId: string) {
    return marketplaceApi.getSellerProfile(sellerId);
  },

  /**
   * Enviar reseña
   */
  async submitReview(productId: string, data: CreateReviewInput, token: string) {
    return marketplaceApi.submitReview(productId, data, token);
  },

  /**
   * Crear sesión de pago
   */
  async buyProduct(productId: string, token: string) {
    return marketplaceApi.createCheckoutSession(productId, token);
  },

  /**
   * Verificar compra
   */
  async verifyPurchase(sessionId: string, token: string) {
    return marketplaceApi.verifyPurchase(sessionId, token);
  }
};
