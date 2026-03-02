import { logger } from "@/lib/logger";
import { api } from "@/lib/api-client";

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
  category_name?: string;
  product_type: string;
  status: string;
  base_price: number;
  currency: string;
  is_featured: boolean;
  is_public: boolean;
  thumbnail_url?: string;
  images?: string;
  tags?: string[];
  features?: string[];
  technical_stack?: string[];
  requirements?: string;
  download_count: number;
  purchase_count: number;
  rating_avg: number;
  rating_count: number;
  min_plan_tier: number;
  display_type?: string;
  external_url?: string;
  github_repository?: string;
  version?: string;
  created_at: string;
  updated_at: string;
}

export interface BackendCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  parent_id?: string;
  icon?: string;
  color?: string;
  sort_order: number;
  is_active: boolean;
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
  github_repository?: string;
  tags?: string[];
  features?: string[];
  technical_stack?: string[];
  min_plan_tier?: number;
}

// Product Categories (Centralized Reference)

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  icon?: string;
  color?: string;
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
  external_url?: string;
  github_repository?: string;
  tags?: string[];
  features?: string[];
  technical_stack?: string[];
  min_plan_tier?: number;
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

export interface BackendRelease {
  id: string;
  product_id: string;
  version: string;
  version_major: number;
  version_minor: number;
  version_patch: number;
  status: string;
  release_notes?: string;
  changelog?: string[];
  download_url?: string;
  file_size_bytes?: number;
  file_hash?: string;
  min_app_version?: string;
  max_app_version?: string;
  released_at?: string;
  download_count?: number;
  created_at: string;
  updated_at: string;
  product_name?: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    per_page: number;
  };
}


export interface PaginatedBackendData<T> {
  data: T[];
  total: number;
  page: number;
}

export interface BackendCustomerAsset {
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
  product_display_type: string;
  product_thumbnail_url?: string;
  product_price: number;
  product_currency: string;
  product_short_desc: string;
  product_description: string;
  product_category: string;
  product_category_id?: string;
  product_rating: number;
  product_reviews: number;
  product_downloads: number;
  product_version: string;
  product_updated_at: string;
  product_tags?: string[];
  product_features?: string[];
  product_technical_stack?: string[];
  product_requirements?: string;
  product_min_plan_tier: number;
  product_file_size: number;
}

// Overview Response Types
export interface BackendSystemHealth {
  cpu: number;
  ram: number;
  network: number;
  uptime: string;
  latency: string;
}

export interface BackendReleaseMetrics {
  total_releases: number;
  active_versions: number;
  adoption_rate: number;
  deprecated_count: number;
  system_health?: BackendSystemHealth;
}

export interface BackendReleaseActivity {
  id: string;
  type: string;
  user: string;
  action: string;
  target: string;
  status: string;
  created_at: string;
}

export interface ReleaseOverviewResponse {
  metrics: BackendReleaseMetrics;
  activity: BackendReleaseActivity[];
}

// Pipeline Response Types
export interface BackendBuildMetadata {
  triggered_by: string;
  branch: string;
  commit: string;
  environment: string;
  artifact_name: string;
  artifact_size: string;
}

export interface BackendPipelineStage {
  name: string;
  status: string;
  duration: string;
  commit: string;
}

export interface BackendPipelineLog {
  time: string;
  type: "info" | "cmd" | "success" | "warning" | "error";
  msg: string;
}

export interface BackendPipelineStatus {
  stages: BackendPipelineStage[];
  logs: BackendPipelineLog[];
  metadata?: BackendBuildMetadata;
}

export const assetsApi = {
  /**
   * Obtener activos del usuario (JWT Auth) - Pestaña 'Customer'
   */
  getMyAssets: async (token: string, page = 1, limit = 20) => {
    return api.get<PaginatedBackendData<BackendCustomerAsset>>("/api/v1/user/my/assets", { 
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
   * Obtener todos los productos de la plataforma (Super Admin)
   */
  getAllProducts: async (token: string, page = 1, limit = 20) => {
    return api.get<BackendProduct[]>(`/api/v1/admin/products`, {
      params: { page: page.toString(), per_page: limit.toString() },
      token
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
   * Skip a specific version for an asset
   */
  skipVersion: async (token: string, assetId: string, version: string) => {
    return api.post(`/api/v1/user/my/assets/${assetId}/skip`, { version }, { token });
  },

  /**
   * Obtener licencia asociada a un activo
   */
  getLicense: async (token: string, licenseId: string) => {
    const url = `/api/v1/user/licenses/${licenseId}`;
    logger.log(`[AssetsAPI] Requesting license from: ${url}`);
    try {
      const response = await api.get<BackendLicense>(url, { token });
      logger.log("[AssetsAPI] License response success:", response);
      if (!response || !response.license_key) {
        logger.warn("[AssetsAPI] Warning: Response received but license_key is missing or empty", response);
      }
      return response;
    } catch (err: unknown) {
      logger.error("[AssetsAPI] License response error:", err);
      throw err;
    }
  },
  /**
   * Obtener todas las releases de un producto
   */
  getReleases: async (token: string, orgId: string, productId: string) => {
    const path = orgId 
      ? `/api/v1/org/products/${productId}/releases` 
      : `/api/v1/public/products/${productId}/releases`;
    return api.get<BackendRelease[]>(path, { token, orgId: orgId || undefined });
  },

  /**
   * Crear nueva release (versión) para un producto
   */
  createRelease: async (token: string, orgId: string, productId: string, data: Partial<BackendRelease> & { file?: File }) => {
    if (data.file) {
      const formData = new FormData();
      formData.append("file", data.file);
      if (data.version) formData.append("version", data.version);
      if (data.status) formData.append("status", data.status);
      if (data.release_notes) formData.append("release_notes", data.release_notes);
      if (data.changelog) formData.append("changelog", data.changelog.join(","));
      if (data.min_app_version) formData.append("min_app_version", data.min_app_version);
      if (data.max_app_version) formData.append("max_app_version", data.max_app_version);
      
      return api.post<BackendRelease>(`/api/v1/org/products/${productId}/releases`, formData, { token, orgId });
    }
    return api.post<BackendRelease>(`/api/v1/org/products/${productId}/releases`, data, { token, orgId });
  },

  /**
   * Actualizar release existente
   */
  updateRelease: async (token: string, orgId: string, releaseId: string, data: Partial<BackendRelease>) => {
    return api.put<BackendRelease>(`/api/v1/org/releases/${releaseId}`, data, { token, orgId });
  },

  /**
   * Eliminar release
   */
  deleteRelease: async (token: string, orgId: string, releaseId: string) => {
    return api.delete(`/api/v1/org/releases/${releaseId}`, { token, orgId });
  },

  /**
   * Obtener todas las releases de la organización (Global)
   */
  getGlobalReleases: async (token: string, orgId: string, page = 1, limit = 20) => {
    return api.get<PaginatedBackendData<BackendRelease>>(`/api/v1/org/releases`, {
      params: { page: page.toString(), per_page: limit.toString() },
      token,
      orgId
    });
  },

  // Analytics & Overview
  getReleaseOverview: async (token: string, orgId: string) => {
    return api.get<ReleaseOverviewResponse>(`/api/v1/org/releases/overview`, { token, orgId });
  },

  getPipelineStatus: async (token: string, orgId: string) => {
    return api.get<BackendPipelineStatus>(`/api/v1/org/releases/pipeline/latest`, { token, orgId });
  },

  abortPipeline: async (token: string, orgId: string) => {
    return api.post(`/api/v1/org/releases/pipeline/abort`, {}, { token, orgId });
  },

  getMyAsset: async (token: string, assetId: string) => {
    return api.get<{ asset: BackendCustomerAsset }>(`/api/v1/user/my/assets/${assetId}`, { token });
  },

  /**
   * Obtener todas las categorías de productos (Public o Org Context)
   */
  getCategories: async (token?: string, orgId?: string) => {
    // Categories are usually public but can be org-scoped in some contexts
    const path = orgId ? "/api/v1/org/product-categories" : "/api/v1/public/product-categories";
    return api.get<{ categories: BackendCategory[] }>(path, { token, orgId });
  },

  /**
   * Crear una nueva categoría de producto (Requiere Auth de Organización)
   */
  createCategory: async (token: string, orgId: string, data: CreateCategoryPayload) => {
    return api.post<{ category: BackendCategory }>("/api/v1/org/product-categories", data, { token, orgId });
  }
};
