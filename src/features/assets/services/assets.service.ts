import { 
  assetsApi, 
  BackendCustomerAsset, 
  BackendProduct, 
  BackendRelease,
  CreateProductPayload, 
  UpdateProductPayload 
} from "../api/assets.api";

export type AssetType = "excel" | "script" | "google-sheet" | "software" | "plugin" | "theme" | "template" | "asset" | "service";

export interface Asset {
  id: string;
  productId: string;
  name: string;
  slug: string;
  type: AssetType;
  category: string;
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
  requirements: string[];
  thumbnail: string;
  external_url?: string;
  display_type?: string;
  isPurchased: boolean;
  isPublic: boolean;
  isFeatured: boolean;
  license_id?: string;
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
    features: safeJsonParse(ba.product_tags) || [],
    requirements: safeJsonParse(ba.product_requirements) || [],
    thumbnail: ba.product_thumbnail_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&fm=webp",
    isPurchased: true,
    isPublic: false,
    isFeatured: false,
    license_id: ba.license_id,
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
    category: "Inventory",
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
    features: [],
    requirements: bp.requirements ? bp.requirements.split(",") : [],
    thumbnail: bp.thumbnail_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&fm=webp",
    external_url: bp.external_url || "",
    display_type: bp.display_type || bp.product_type,
    isPurchased: false,
    isPublic: bp.is_public,
    isFeatured: bp.is_featured,
    createdAt: bp.created_at,
    updatedAt: bp.updated_at,
  }),

  // Customer-owned assets
  async getMyAssets(token: string): Promise<Asset[]> {
    const response = await assetsApi.getMyAssets(token);
    // Handle paginated response
    if (response && response.data && Array.isArray(response.data)) {
      return response.data.map(this.mapBackendAssetToAsset);
    }
    // Fallback for old/direct arrays just in case, though current api returns PaginatedBackendData
    return Array.isArray(response) ? (response as any).map(this.mapBackendAssetToAsset) : [];
  },

  // Organization inventory (products owned by org)
  async fetchInventory(token: string, orgId: string): Promise<Asset[]> {
    const products = await assetsApi.getOrgProducts(token, orgId);
    return Array.isArray(products) ? products.map(this.mapBackendProductToAsset) : [];
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

  async getLicense(token: string, licenseId: string) {
    console.log("[AssetsService] getLicense called for:", licenseId);
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

  async getGlobalReleases(token: string, orgId: string, page = 1, limit = 20) {
    return assetsApi.getGlobalReleases(token, orgId, page, limit);
  },
};

const safeJsonParse = (jsonString?: string): string[] => {
  if (!jsonString) return [];
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 KB";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
