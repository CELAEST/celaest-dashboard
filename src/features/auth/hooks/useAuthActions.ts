"use client";
import { logger } from "@/lib/logger";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { SupabaseClient } from "@supabase/supabase-js";
import { AuthActions, AuthResult, AuthSession, AuthUser } from "../lib/types";

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
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: response.access_token,
            refresh_token: response.refresh_token,
          });

          if (sessionError) {
            return {
              success: false,
              error: { code: "UNKNOWN_ERROR", message: getAuthErrorMessage(sessionError) },
            };
          }

          // Sincronizar inmediatamente el store para evitar parpadeos de renderizado
          const userObj: AuthUser = sessionData?.session?.user
            ? mapSupabaseUser(sessionData.session.user)
            : {
                id: response.user?.id || "user",
                email: response.user?.email || email.trim().toLowerCase(),
                name: response.user?.name || email.split("@")[0],
                avatarUrl: response.user?.avatar_url,
                role: "client",
                permissions: [],
                emailVerified: true,
                createdAt: new Date().toISOString(),
              };

          useAuthStore.getState().setAuth({
            user: userObj,
            session: {
              user: userObj,
              accessToken: response.access_token,
              refreshToken: response.refresh_token,
              expiresAt: Math.floor(Date.now() / 1000) + (response.expires_in || 3600),
            },
          });

          return { success: true };
        }


        return {
          success: false,
          error: { code: "UNKNOWN_ERROR", message: "Error al iniciar sesión" },
        };
      } catch (error: unknown) {
        const errCode =
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          (error as { code?: unknown }).code === "EMAIL_NOT_VERIFIED"
            ? "EMAIL_NOT_VERIFIED"
            : "INVALID_CREDENTIALS";
        return {
          success: false,
          error: {
            code: errCode,
            message:
              error instanceof Error
                ? error.message
                : "Email o contraseña incorrectos",
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
    ): Promise<AuthResult<{ requiresVerification?: boolean; email?: string }>> => {
      try {
        const cleanEmail = email.trim().toLowerCase();
        const locale =
          typeof document !== "undefined" && document.documentElement.lang
            ? document.documentElement.lang
            : "es";
        const response = await authService.register({
          email: cleanEmail,
          password,
          name: name.trim(),
          locale,
        });

        return {
          success: true,
          data: {
            requiresVerification: Boolean(response.requires_verification),
            email: response.email || cleanEmail,
          },
        };
      } catch (error: unknown) {
        return {
          success: false,
          error: {
            code: "UNKNOWN_ERROR",
            message:
              error instanceof Error
                ? error.message
                : "No se pudo crear la cuenta",
          },
        };
      }
    },
    [],
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
          scopes: "read:user user:email",
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
    } catch (error: unknown) {
      logger.error("Supabase signOut error:", error);
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
    } catch (error: unknown) {
      logger.error("Client cleanup error:", error);
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
