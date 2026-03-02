import { 
  assetsApi, 
  BackendCustomerAsset, 
  BackendProduct, 
  BackendRelease,
  CreateProductPayload, 
  UpdateProductPayload,
  CreateCategoryPayload,
  BackendCategory
} from "../api/assets.api";

export type AssetType = "excel" | "script" | "google-sheet" | "software" | "plugin" | "theme" | "template" | "asset" | "service";

export interface Asset {
  id: string;
  productId: string;
  name: string;
  slug: string;
  type: AssetType;
  category: string;
  categoryId?: string;
  categoryName?: string;
  price: number;
  operationalCost: number;
  status: "active" | "draft" | "archived" | "stable";
  version: string;
  fileSize: string;
  downloads: number;
  rating: number;
  reviews: number;
  shortDescription: string;
  description: string;
  features: string[];
  tags: string[];
  technicalStack: string[];
  requirements: string[];
  minPlanTier: number;
  thumbnail: string;
  external_url?: string;
  display_type?: string;
  accessType?: "purchase" | "subscription";
  isPurchased: boolean;
  isPublic: boolean;
  isFeatured: boolean;
  github_repository?: string;
  license_id?: string;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

export const assetsService = {
  // Maps a customer-owned asset from /user/my/assets
  mapBackendAssetToAsset: (ba: BackendCustomerAsset): Asset => ({
    id: ba.id,
    productId: ba.product_id,
    name: ba.product_name,
    slug: ba.product_slug,
    type: (ba.product_type || "asset") as AssetType,
    category: ba.product_category || "Purchased",
    categoryId: ba.product_category_id,
    categoryName: ba.product_category,
    price: ba.product_price || 0,
    operationalCost: 0,
    status: ba.is_active ? "active" : "archived",
    version: ba.product_version || "1.0.0",
    fileSize: formatFileSize(ba.product_file_size || 0),
    downloads: ba.product_downloads || 0,
    rating: ba.product_rating || 0,
    reviews: ba.product_reviews || 0,
    shortDescription: ba.product_short_desc || "",
    description: ba.product_description || "",
    features: ba.product_features || [],
    tags: ba.product_tags || [],
    technicalStack: ba.product_technical_stack || [],
    requirements: ba.product_requirements ? ba.product_requirements.split("\n").filter(Boolean) : [],
    minPlanTier: ba.product_min_plan_tier || 0,
    thumbnail: ba.product_thumbnail_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&fm=webp",
    accessType: (ba.access_type === "subscription" ? "subscription" : "purchase") as "purchase" | "subscription",
    isPurchased: true,
    isPublic: false,
    isFeatured: false,
    license_id: ba.license_id,
    organizationId: ba.organization_id,
    external_url: "",
    display_type: ba.product_display_type || ba.product_type,
    createdAt: ba.granted_at || new Date().toISOString(),
    updatedAt: ba.granted_at || new Date().toISOString(),
  }),

  // Maps an organization product from /org/:id/products (inventory)
  mapBackendProductToAsset: (bp: BackendProduct): Asset => ({
    id: bp.id,
    productId: bp.id,
    name: bp.name,
    slug: bp.slug,
    type: (bp.product_type || "software") as AssetType,
    category: bp.category_name || "Inventory",
    categoryId: bp.category_id,
    categoryName: bp.category_name,
    price: bp.base_price,
    operationalCost: 0,
    status: (bp.status === "published" ? "active" : bp.status) as Asset["status"],
    version: bp.version || "1.0.0",
    fileSize: "0 KB",
    downloads: bp.download_count,
    rating: bp.rating_avg,
    reviews: bp.rating_count,
    shortDescription: bp.short_description || "",
    description: bp.description || "",
    features: bp.features || [],
    tags: bp.tags || [],
    technicalStack: bp.technical_stack || [],
    requirements: bp.requirements ? bp.requirements.split("\n").filter(Boolean) : [],
    minPlanTier: bp.min_plan_tier || 0,
    thumbnail: bp.thumbnail_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&fm=webp",
    external_url: bp.external_url || "",
    display_type: bp.display_type || bp.product_type,
    isPurchased: false,
    isPublic: bp.is_public,
    isFeatured: bp.is_featured,
    github_repository: bp.github_repository,
    organizationId: bp.organization_id,
    createdAt: bp.created_at,
    updatedAt: bp.updated_at,
  }),

  // Customer-owned assets
  async getMyAssets(token: string): Promise<Asset[]> {
    const response: unknown = await assetsApi.getMyAssets(token);
    const dataArray = response && typeof response === 'object' && 'data' in response && Array.isArray((response as Record<string, unknown>).data) 
                      ? (response as Record<string, unknown>).data 
                      : Array.isArray(response) ? response : [];
    return (dataArray as BackendCustomerAsset[]).map((item) => this.mapBackendAssetToAsset(item));
  },

  // CELAEST — Auditoría de Funcionalidades "Durmientes" (Back-vs-Front)
  // Este informe revela módulos completos del motor de negocio que existen en el Backend (Go) pero no han sido expuestos en el Dashboard (Next.js).
  // ## 1. 🤖 Módulo AI: Más que solo "Errores"
  // **Estado: BRECHA MASIVA (80% Faltante)**
  // - **AI Chat & Completions:** El backend tiene handlers de `/ai/chat` y `/ai/completions` listos para una interfaz tipo ChatGPT.
  // - **Prompt CMS:** Sistema de gestión de prompts persistentes (`/ai/prompts`) para estandarizar respuestas.
  // - **AI Key Pool:** Gestión centralizada de llaves de proveedores (OpenAI, Anthropic) para rotación y límites (`/ai/pool`).
  // - **Batch Processing:** Procesamiento masivo de tareas IA.
  // *Situación Actual:* El frontend solo lo usa para ver "Failed Tasks".
  // ## 2. 🛡️ Módulo de Auditoría y Telemetría
  // **Estado: BRECHA DE VISIBILIDAD (70% Faltante)**
  // - **Audit Explorer:** El backend permite búsquedas complejas por acción, entidad y usuario (`/audit-logs/search`).
  // - **Reportes de Telemetría:** Dashboards de salud del sistema y errores de red en tiempo real (`/telemetry`).
  // - **Exportación Segura:** Generador de CSV con protección Anti-Inyección.
  // *Situación Actual:* No hay un "Centro de Seguridad" en el Dashboard.
  // Organization inventory (products owned by org)
  async fetchInventory(token: string, orgId: string): Promise<Asset[]> {
    // Increase limit to 100 to ensure we get all products (temporary fix until pagination UI)
    const response: unknown = await assetsApi.getOrgProducts(token, orgId, 1, 100);
    const dataArray = response && typeof response === 'object' && 'data' in response && Array.isArray((response as Record<string, unknown>).data) 
                      ? (response as Record<string, unknown>).data 
                      : Array.isArray(response) ? response : [];
    return (dataArray as BackendProduct[]).map((item) => this.mapBackendProductToAsset(item));
  },

  async fetchAllProducts(token: string): Promise<Asset[]> {
    const response: unknown = await assetsApi.getAllProducts(token, 1, 100);
    const dataArray = response && typeof response === 'object' && 'data' in response && Array.isArray((response as Record<string, unknown>).data) 
                      ? (response as Record<string, unknown>).data 
                      : Array.isArray(response) ? response : [];
    return (dataArray as BackendProduct[]).map((item) => this.mapBackendProductToAsset(item));
  },

  async createAsset(token: string, orgId: string, data: CreateProductPayload): Promise<Asset> {
    const product = await assetsApi.createProduct(token, orgId, data);
    return this.mapBackendProductToAsset(product);
  },

  async updateAsset(token: string, orgId: string, id: string, data: UpdateProductPayload): Promise<Asset> {
    const product = await assetsApi.updateProduct(token, orgId, id, data);
    return this.mapBackendProductToAsset(product);
  },

  async deleteAsset(token: string, orgId: string, id: string): Promise<void> {
    await assetsApi.deleteProduct(token, orgId, id);
  },

  async downloadAsset(token: string, assetId: string) {
    return assetsApi.downloadAsset(token, assetId);
  },

  async skipVersion(token: string, assetId: string, version: string) {
    return assetsApi.skipVersion(token, assetId, version);
  },

  async getLicense(token: string, licenseId: string) {

    return assetsApi.getLicense(token, licenseId);
  },

  async getReleases(token: string, orgId: string, productId: string) {
    return assetsApi.getReleases(token, orgId, productId);
  },

  async createRelease(token: string, orgId: string, productId: string, data: Partial<BackendRelease>) {
    return assetsApi.createRelease(token, orgId, productId, data);
  },

  async updateRelease(token: string, orgId: string, releaseId: string, data: Partial<BackendRelease>) {
    return assetsApi.updateRelease(token, orgId, releaseId, data);
  },

  async deleteRelease(token: string, orgId: string, releaseId: string) {
    return assetsApi.deleteRelease(token, orgId, releaseId);
  },

  async getGlobalReleases(token: string, orgId: string, page = 1, limit = 100) {
    return assetsApi.getGlobalReleases(token, orgId, page, limit);
  },

  async getCategories(token?: string, orgId?: string): Promise<BackendCategory[]> {
    const response = await assetsApi.getCategories(token, orgId);
    return response.categories || [];
  },

  async createCategory(token: string, orgId: string, data: CreateCategoryPayload): Promise<BackendCategory> {
    const response = await assetsApi.createCategory(token, orgId, data);
    return response.category;
  },
};

// Image formats
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 KB";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
