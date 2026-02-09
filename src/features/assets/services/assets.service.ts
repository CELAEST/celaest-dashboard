import { 
  assetsApi, 
  BackendAsset, 
  BackendProduct, 
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
  isPurchased: boolean;
  isPublic: boolean;
  isFeatured: boolean;
  license_id?: string;
  createdAt: string;
  updatedAt: string;
}

export const assetsService = {
  // Maps a customer-owned asset from /user/my/assets
  mapBackendAssetToAsset: (ba: BackendAsset): Asset => ({
    id: ba.id,
    productId: ba.product_id,
    name: ba.product_name,
    slug: ba.product_slug,
    type: (ba.product_type || "asset") as AssetType,
    category: "Purchased",
    price: 0,
    operationalCost: 0,
    status: ba.is_active ? "active" : "archived",
    version: "1.0.0",
    fileSize: "0 KB",
    downloads: 0,
    rating: 5.0,
    reviews: 0,
    shortDescription: "",
    description: "",
    features: [],
    requirements: [],
    thumbnail: ba.product_thumbnail_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&fm=webp",
    isPurchased: true,
    isPublic: false,
    isFeatured: false,
    license_id: ba.license_id,
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
    status: bp.status as Asset["status"],
    version: "1.0.0",
    fileSize: "0 KB",
    downloads: bp.download_count,
    rating: bp.rating_avg,
    reviews: bp.rating_count,
    shortDescription: bp.short_description || "",
    description: bp.description || "",
    features: [],
    requirements: bp.requirements ? bp.requirements.split(",") : [],
    thumbnail: bp.thumbnail_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&fm=webp",
    isPurchased: false,
    isPublic: bp.is_public,
    isFeatured: bp.is_featured,
    createdAt: bp.created_at,
    updatedAt: bp.updated_at,
  }),

  // Customer-owned assets
  async getMyAssets(token: string): Promise<Asset[]> {
    const assets = await assetsApi.getMyAssets(token);
    // api-client returns the data array directly due to unwrapping
    return Array.isArray(assets) ? assets.map(this.mapBackendAssetToAsset) : [];
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
  }
};

