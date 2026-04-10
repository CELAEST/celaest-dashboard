"use client";

import { useRealtimeDashboard } from "@/features/analytics/hooks/useRealtimeDashboard";

/**
 * RealtimeDashboardSync
 *
 * Componente singleton montado UNA SOLA VEZ en el layout raíz.
 * Registra todos los listeners de socket del dashboard en tiempo real.
 *
 * Sin este singleton, cada componente que llamara a useAnalytics()
 * registraría su propia instancia de useRealtimeDashboard(), multiplicando
 * los listeners y disparando N toasts por cada evento de WebSocket.
 *
 * Debe montarse dentro de <QueryProvider> para que useQueryClient() funcione.
 */
export function RealtimeDashboardSync() {
  useRealtimeDashboard();
  return null;
}
