"use client";

import { useEffect, useRef } from "react";
import { socket } from "@/lib/socket-client";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { decodeJWT } from "@/lib/jwt";
import { toast } from "sonner";

/**
 * Global hook to keep the user profile in sync across all tabs and sessions.
 * Listens to "user.updated" events via WebSocket and invalidates React Query cache.
 */
export function useUserSync(token?: string) {
  const queryClient = useQueryClient();
  // Prevents duplicate toasts when the effect re-runs or the backend emits
  // multiple user.updated events in quick succession (Strict Mode / reconnect).
  const lastToastAt = useRef(0);
  const DEDUP_MS = 3000;

  useEffect(() => {
    if (!token) return;

    const unsubscribe = socket.on("user.updated", (rawPayload: unknown) => {
      const payload = rawPayload as { user_id: string };
      const currentUserId = decodeJWT(token)?.sub;

      if (payload.user_id === currentUserId) {
        // Invalidate user profile query to force a refetch across the app
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.profile(currentUserId ?? "") });

        // Sonner's `id` ensures only one toast with this key is visible at a time.
        // The ref guard suppresses rapid repeats (e.g. backend emitting twice in ms).
        const now = Date.now();
        if (now - lastToastAt.current < DEDUP_MS) return;
        lastToastAt.current = now;

        toast.info("Perfil actualizado", {
          id: "user-profile-sync",
          description: "La información de tu cuenta ha sido actualizada en otra sesión.",
        });
      }
    });

    return () => unsubscribe();
  }, [token, queryClient]);
}
