"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { SupabaseClient } from "@supabase/supabase-js";
import { AuthActions, AuthResult, AuthSession } from "../lib/types";

import { getAuthErrorMessage } from "../lib/errors";
import { mapSupabaseUser } from "../lib/mappers";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../stores/useAuthStore";

export function useAuthActions(
  supabase: SupabaseClient | null,
): AuthActions {

  const router = useRouter();

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      try {
        // Llamada al servicio en lugar del adaptador antiguo
        const response = await authService.login(email.trim().toLowerCase(), password);

        if (response.access_token && supabase) {
          // Sincronizar el cliente de Supabase con el token recibido del backend
          await supabase.auth.setSession({
            access_token: response.access_token,
            refresh_token: response.refresh_token,
          });

          return { success: true };
        }


        return {
          success: false,
          error: { code: "UNKNOWN_ERROR", message: "Error al iniciar sesión" },
        };
      } catch (error) {
        return {
          success: false,
          error: { 
            code: "INVALID_CREDENTIALS", 
            message: error instanceof Error ? error.message : "Email o contraseña incorrectos" 
          },
        };
      }

    },
    [supabase],
  );


  const signUp = useCallback(
    async (
      email: string,
      password: string,
      name: string,
    ): Promise<AuthResult> => {
      if (!supabase) {
        return {
          success: false,
          error: { code: "UNKNOWN_ERROR", message: "Servicio no disponible" },
        };
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              full_name: name,
              name: name,
            },
          },
        });

        if (error) {
          return {
            success: false,
            error: {
              code: "UNKNOWN_ERROR",
              message: getAuthErrorMessage(error),
            },
          };
        }

        if (data.user) {
          return { success: true };
        }

        return {
          success: false,
          error: { code: "UNKNOWN_ERROR", message: "Error al crear cuenta" },
        };
      } catch {
        return {
          success: false,
          error: { code: "NETWORK_ERROR", message: "Error de conexión" },
        };
      }
    },
    [supabase],
  );

  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    if (!supabase) {
      return {
        success: false,
        error: { code: "UNKNOWN_ERROR", message: "Servicio no disponible" },
      };
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: { code: "UNKNOWN_ERROR", message: getAuthErrorMessage(error) },
        };
      }

      return { success: true };
    } catch {
      return {
        success: false,
        error: {
          code: "UNKNOWN_ERROR",
          message: "Error al conectar con Google",
        },
      };
    }
  }, [supabase]);

  const signInWithGitHub = useCallback(async (): Promise<AuthResult> => {
    if (!supabase) {
      return {
        success: false,
        error: { code: "UNKNOWN_ERROR", message: "Servicio no disponible" },
      };
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: "offline",
          }, // Added access_type offline just in case, consistent with google
        },
      });

      if (error) {
        return {
          success: false,
          error: { code: "UNKNOWN_ERROR", message: getAuthErrorMessage(error) },
        };
      }

      return { success: true };
    } catch {
      return {
        success: false,
        error: {
          code: "UNKNOWN_ERROR",
          message: "Error al conectar con GitHub",
        },
      };
    }
  }, [supabase]);

  const { reset } = useAuthStore.getState();

  const signOut = useCallback(async (): Promise<AuthResult> => {
    if (!supabase) return { success: false };

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Supabase signOut error:", error);
      // Continue cleanup even if server call fails
    }

    try {
      // Clean cookies manually for safety
      document.cookie.split(";").forEach((c) => {
        const trimmed = c.trim();
        if (trimmed.startsWith("sb-")) {
          document.cookie =
            trimmed.split("=")[0] +
            "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
      });

      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }

      // State update using Zustand reset
      reset();

      router.refresh(); // Refresh server components
      router.push("/?mode=signin");
      return { success: true };
    } catch (error) {
      console.error("Client cleanup error:", error);
      return {
        success: false,
        error: { code: "UNKNOWN_ERROR", message: "Error al cerrar sesión" },
      };
    }
  }, [supabase, router, reset]);


  const refreshSession = useCallback(async (): Promise<
    AuthResult<AuthSession>
  > => {
    if (!supabase)
      return {
        success: false,
        error: { code: "UNKNOWN_ERROR", message: "Servicio no disponible" },
      };
    const { data, error } = await supabase.auth.refreshSession();
    if (error || !data.user)
      return {
        success: false,
        error: { code: "UNKNOWN_ERROR", message: "Error refreshing session" },
      };

    return {
      success: true,
      data: {
        accessToken: data.session?.access_token || "",
        expiresAt: data.session?.expires_at || 0,
        user: mapSupabaseUser(data.user),
      },
    };
  }, [supabase]);

  return {
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    refreshSession,
  };
}
