/**
 * authIntent
 *
 * Pequeña capa sobre sessionStorage para persistir la intención de un usuario
 * NO autenticado cuando dispara un flujo que requiere sesión desde dentro del
 * marketplace público (p. ej. "Iniciar sesión para dejar tu reseña").
 *
 * Tras volver al dashboard ya autenticado, `MarketplaceDashboardView` consume
 * este intent y reabre el `ProductDetailModal` en la tab correcta para que la
 * accesibilidad sea continua: el usuario no tiene que volver a buscar el
 * producto y la pestaña de reseñas.
 */

const STORAGE_KEY = "marketplace_pending_intent";

export type MarketplaceAuthIntentTab = "overview" | "features" | "reviews";

export interface MarketplaceAuthIntent {
  productId: string;
  tab?: MarketplaceAuthIntentTab;
}

/**
 * Persiste un intent en sessionStorage. Silenciosamente no-op cuando el
 * storage no está disponible (SSR / iframes sandbox).
 */
export function setAuthIntent(intent: MarketplaceAuthIntent): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(intent));
  } catch {
    /* sessionStorage puede fallar en privado/quota — ignoramos */
  }
}

/**
 * Recupera el intent guardado y lo borra. Devuelve null si no hay nada
 * pendiente o si el payload está corrupto.
 */
export function consumeAuthIntent(): MarketplaceAuthIntent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(STORAGE_KEY);
    const parsed = JSON.parse(raw) as MarketplaceAuthIntent;
    if (!parsed || typeof parsed.productId !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Helper para borrar el intent sin consumirlo — útil cuando otra acción
 * (cancelar el LoginModal, navegar fuera) lo deja obsoleto.
 */
export function clearAuthIntent(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
