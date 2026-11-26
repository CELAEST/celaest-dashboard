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
  async buyProduct(productId: string, token: string, orgId: string, couponCode?: string) {
    return marketplaceApi.createCheckoutSession(productId, token, orgId, couponCode);
  },

  /**
   * Verificar compra
   */
  async verifyPurchase(sessionId: string, token: string, orgId: string) {
    return marketplaceApi.verifyPurchase(sessionId, token, orgId);
  },

  /**
   * Estado del trial gratuito WELCOME de 15 días para Lingua
   */
  async getWelcomeTrialStatus(token: string, orgId?: string | null) {
    return marketplaceApi.getWelcomeTrialStatus(token, orgId);
  },

  /**
   * Activa directamente 15 días gratis de Lingua con el cupón WELCOME
   */
  async claimWelcomeTrial(token: string, orgId?: string | null) {
    return marketplaceApi.claimWelcomeTrial(token, orgId);
  }
};
