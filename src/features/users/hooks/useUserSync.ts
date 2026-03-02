"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (!token) return;

    const unsubscribe = socket.on("user.updated", (rawPayload: unknown) => {
      const payload = rawPayload as {
        user_id: string;
      };
      
      const currentUserId = decodeJWT(token)?.sub;

      if (payload.user_id === currentUserId) {
        console.log("[useUserSync] User profile updated from another tab/session. Invalidating queries...");
        
        // Invalidate user profile query to force a refetch across the app
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.profile(currentUserId ?? "") });
        
        toast.info("Perfil actualizado", {
          description: "La información de tu cuenta ha sido actualizada en otra sesión."
        });
      }
    });

    return () => unsubscribe();
  }, [token, queryClient]);
}
