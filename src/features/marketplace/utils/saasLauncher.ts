import type { MarketplaceProduct } from "../types";

export type SaasProductCandidate = Pick<
  MarketplaceProduct,
  "product_type" | "external_url" | "slug"
> & {
  display_type?: string | null;
  type?: string | null;
  name?: string | null;
};

export function isSaasProduct(product?: SaasProductCandidate | null): boolean {
  if (!product) return false;
  const type = (
    product.product_type ||
    product.display_type ||
    product.type ||
    ""
  ).toLowerCase();
  if (type === "saas" || type === "service") return true;
  const slug = product.slug?.toLowerCase() || "";
  const name = product.name?.toLowerCase() || "";
  if (slug === "lingua" || slug.includes("lingua") || name.includes("lingua")) {
    return true;
  }
  return Boolean(
    product.external_url && /^https?:\/\//i.test(product.external_url.trim()),
  );
}

export function resolveSaasExternalUrl(
  product?: SaasProductCandidate | null,
): string {
  const explicit = product?.external_url?.trim().replace(/\/+$/, "");
  const explicitLower = explicit?.toLowerCase() || "";
  const isDeadPlaceholder =
    explicitLower === "https://lingua.celaest.com" ||
    explicitLower === "https://app.celaest.com" ||
    explicitLower.includes("app.celaest.com") ||
    explicitLower.includes("example.com");

  if (explicit && /^https?:\/\//i.test(explicit) && !isDeadPlaceholder) {
    return explicit;
  }
  if (isSaasProduct(product)) {
    const envUrl = process.env.NEXT_PUBLIC_LINGUA_URL?.trim();
    if (envUrl) return envUrl.replace(/\/+$/, "");
    const isLocal =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");
    return isLocal
      ? "http://localhost:3001"
      : "https://lingua.celaest.com";
  }
  return "";
}

export function buildSaasLaunchUrl(
  externalUrl: string,
  accessToken?: string | null,
  refreshToken?: string | null,
): string {
  const cleanBase = externalUrl.trim().replace(/\/+$/, "");
  if (!cleanBase) return "";
  if (!accessToken) return cleanBase;

  const params = new URLSearchParams();
  params.set("access_token", accessToken);
  if (refreshToken) {
    params.set("refresh_token", refreshToken);
  }
  return `${cleanBase}/auth/callback#${params.toString()}`;
}

export function launchSaasProduct(
  product: SaasProductCandidate,
  accessToken?: string | null,
  refreshToken?: string | null,
): boolean {
  const baseUrl = resolveSaasExternalUrl(product);
  if (!baseUrl) return false;
  const launchUrl = buildSaasLaunchUrl(baseUrl, accessToken, refreshToken);
  if (typeof window !== "undefined" && launchUrl) {
    window.open(launchUrl, "_blank", "noopener,noreferrer");
    return true;
  }
  return false;
}

