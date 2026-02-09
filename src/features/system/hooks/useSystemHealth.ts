import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useSystemStore } from "../stores/useSystemStore";
import { systemApi } from "../api/system.api";

export function useSystemHealth() {
  const { health, isLoading, lastChecked, setHealth, setLoading, setError } = 
    useSystemStore(useShallow((state) => ({
      health: state.health,
      isLoading: state.isLoading,
      lastChecked: state.lastChecked,
      setHealth: state.setHealth,
      setLoading: state.setLoading,
      setError: state.setError,
    })));

  const checkHealth = useCallback(async (force = false) => {
    // Cache de 30 segundos para salud global
    const CACHE_TTL = 30000;
    if (!force && lastChecked && (Date.now() - lastChecked < CACHE_TTL)) return;
    if (isLoading) return;

    setLoading(true);
    try {
      const res = await systemApi.getHealth();
      if (res) setHealth(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sistema Offline");
    } finally {
      setLoading(false);
    }
  }, [lastChecked, isLoading, setHealth, setLoading, setError]);

  return { health, isLoading, checkHealth };
}
