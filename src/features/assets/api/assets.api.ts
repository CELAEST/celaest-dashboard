import { api } from "@/lib/api-client";

// CustomerAsset - response from /user/my/assets (purchased by user)
export interface BackendAsset {
  id: string;
  organization_id: string;
  user_id: string;
  product_id: string;
  order_id?: string;
  license_id?: string;
  access_type: string;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
  product_name: string;
  product_slug: string;
  product_type: string;
  product_display_type?: string;
  product_thumbnail_url?: string;
  product_price?: number;
  product_currency?: string;
  product_short_desc?: string;
  product_description?: string;
  product_category?: string;
  product_rating?: number;
  product_reviews?: number;
  product_downloads?: number;
  product_version?: string;
  product_updated_at?: string;
  product_tags?: string;
  product_requirements?: string;
  product_file_size?: number;
}

// Product - response from /org/:id/products (inventory items)
export interface BackendProduct {
  id: string;
  organization_id: string;
  slug: string;
  sku?: string;
  name: string;
  short_description?: string;
  description?: string;
  category_id?: string;
  product_type: string;
  status: string;
  base_price: number;
  currency: string;
  is_featured: boolean;
  is_public: boolean;
  thumbnail_url?: string;
  images?: string;
  tags?: string;
  requirements?: string;
  download_count: number;
  purchase_count: number;
  rating_avg: number;
  rating_count: number;
  display_type?: string;
  external_url?: string;
  version?: string;
  created_at: string;
  updated_at: string;
}

// Payload for creating a product
export interface CreateProductPayload {
  name: string;
  slug: string;
  sku?: string;
  short_description?: string;
  description?: string;
  category_id?: string;
  product_type?: string;
  status?: string;
  base_price?: number;
  currency?: string;
  is_featured?: boolean;
  is_public?: boolean;
  thumbnail_url?: string;
  external_url?: string;
}

// Payload for updating a product
export interface UpdateProductPayload {
  name?: string;
  slug?: string;
  short_description?: string;
  description?: string;
  category_id?: string;
  status?: string;
  base_price?: number;
  is_featured?: boolean;
  is_public?: boolean;
  thumbnail_url?: string;
}

// License response type
export interface BackendLicense {
  id: string;
  license_key: string;
  product_id: string;
  user_id: string;
  status: string;
  activated_at?: string;
  expires_at?: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    per_page: number;
  };
}


export const assetsApi = {
  /**
   * Obtener activos del usuario (JWT Auth) - Pestaña 'Customer'
   */
  getMyAssets: async (token: string, page = 1, limit = 20) => {
    return api.get<BackendAsset[]>("/api/v1/user/my/assets", { 
      params: { page: page.toString(), per_page: limit.toString() },
      token 
    });
  },

  /**
   * Obtener productos de la organización (JWT Auth) - Pestaña 'Admin' (Inventory)
   */
  getOrgProducts: async (token: string, orgId: string, page = 1, limit = 20) => {
    return api.get<BackendProduct[]>(`/api/v1/org/products`, {
      params: { page: page.toString(), per_page: limit.toString() },
      token,
      orgId
    });
  },

  /**
   * Crear nuevo producto en el catálogo
   */
  createProduct: async (token: string, orgId: string, data: CreateProductPayload) => {
    return api.post<BackendProduct>(`/api/v1/org/products`, data, { token, orgId });
  },

  /**
   * Actualizar producto existente
   */
  updateProduct: async (token: string, orgId: string, productId: string, data: UpdateProductPayload) => {
    return api.put<BackendProduct>(`/api/v1/org/products/${productId}`, data, { token, orgId });
  },

  /**
   * Eliminar/Archivar producto
   */
  deleteProduct: async (token: string, orgId: string, productId: string) => {
    return api.delete(`/api/v1/org/products/${productId}`, { token, orgId });
  },

  /**
   * Obtener URL de descarga para un activo
   */
  downloadAsset: async (token: string, assetId: string) => {
    return api.get<{ download_url: string; version: string; file_size: number }>(
      `/api/v1/user/my/assets/${assetId}/download`,
      { token }
    );
  },

  /**
   * Obtener licencia asociada a un activo
   */
  getLicense: async (token: string, licenseId: string) => {
    const url = `/api/v1/user/licenses/${licenseId}`;
    console.log(`[AssetsAPI] Requesting license from: ${url}`);
    try {
      const response = await api.get<BackendLicense>(url, { token });
      console.log("[AssetsAPI] License response success:", response);
      if (!response || !response.license_key) {
        console.warn("[AssetsAPI] Warning: Response received but license_key is missing or empty", response);
      }
      return response;
    } catch (err) {
      console.error("[AssetsAPI] License response error:", err);
      throw err;
    }
  },
  /**
   * Crear nueva release (versión) para un producto
   */
  createRelease: async (token: string, productId: string, data: {
    version: string;
    status: string;
    download_url: string;
    file_size_bytes?: number;
    file_hash?: string;
    release_notes?: string;
  }) => {
    return api.post(`/api/v1/org/products/${productId}/releases`, data, { token });
  }
};
