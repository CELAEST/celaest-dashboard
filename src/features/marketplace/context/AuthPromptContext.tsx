"use client";

/**
 * MarketplaceAuthPromptContext
 *
 * Permite que un componente profundo del árbol del marketplace (p. ej. el
 * formulario de reseñas dentro del modal de detalle del producto) solicite
 * abrir el flujo de login al usuario, sin tener que pasar callbacks 4 niveles
 * arriba. El proveedor lo monta el contenedor que aloja el `LoginModal`
 * (típicamente `MarketplacePublicView`) y conecta `requestLogin` con
 * `setShowLoginModal(true)` + persistencia del intent.
 *
 * Si un componente usa `useAuthPrompt` fuera de un provider, recibe un
 * `requestLogin` no-op (no rompe, sólo no hace nada). Esto evita que componentes
 * compartidos entre la vista pública y la autenticada exploten.
 */
import React, { createContext, useContext, useMemo } from "react";
import type { MarketplaceAuthIntent } from "../utils/authIntent";

interface AuthPromptContextValue {
  /**
   * Solicita al contenedor padre que muestre el modal de login. El `intent`
   * se persiste en sessionStorage para que el dashboard pueda reabrir el
   * mismo modal en la misma tab después de autenticar.
   */
  requestLogin: (intent: MarketplaceAuthIntent) => void;
}

const NOOP_VALUE: AuthPromptContextValue = {
  requestLogin: () => {},
};

const AuthPromptContext = createContext<AuthPromptContextValue>(NOOP_VALUE);

export const AuthPromptProvider: React.FC<{
  onRequestLogin: (intent: MarketplaceAuthIntent) => void;
  children: React.ReactNode;
}> = ({ onRequestLogin, children }) => {
  const value = useMemo<AuthPromptContextValue>(
    () => ({ requestLogin: onRequestLogin }),
    [onRequestLogin],
  );

  return (
    <AuthPromptContext.Provider value={value}>
      {children}
    </AuthPromptContext.Provider>
  );
};

export function useAuthPrompt(): AuthPromptContextValue {
  return useContext(AuthPromptContext);
}
