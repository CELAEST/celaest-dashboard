"use client";

import React from "react";
import {
  MagnifyingGlass,
  Command,
  Sun,
  Moon,
  ShieldWarning,
  Pulse,
} from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { NotificationCenter } from "./NotificationCenter";
import { useUIStore } from "@/stores/useUIStore";
import { useErrorStore } from "@/features/errors/stores/useErrorStore";
import { UserInfo } from "./Header/UserInfo";
import { HeaderFilterPill } from "./Header/HeaderFilterPill";

interface HeaderProps {
  onShowLogin?: () => void;
}

export const Header = React.memo(function Header({ onShowLogin }: HeaderProps) {
  const { toggleTheme, isMounted } = useTheme();
  const { user } = useAuth();
  const { searchQuery, setSearchQuery } = useUIStore();
  const { showErrorControls, errorFilters, setErrorFilters } = useErrorStore();

  // Static classes resolving synchronously via Tailwind dark: variants
  const headerClassName =
    "h-20 px-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 bg-white/60 border-gray-200 dark:bg-black/40 dark:border-white/5";

  const inputClassName =
    "w-full border rounded-full h-10 pl-12 pr-12 text-sm focus:outline-none focus:ring-1 transition-all bg-gray-100 border-gray-200 text-gray-900 focus:border-blue-500/50 focus:ring-blue-500/50 placeholder:text-gray-500 dark:bg-black/50 dark:border-white/10 dark:text-white dark:focus:border-cyan-500/50 dark:focus:ring-cyan-500/50 dark:placeholder:text-gray-600";

  const themeButtonClassName =
    "p-2 rounded-full transition-all duration-300 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-yellow-400 dark:hover:bg-white/5";

  // Prevent hydration mismatch for icons/theme-dependent UI
  if (!isMounted) {
    return (
      <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-40 border-b bg-white/60 dark:bg-black/40 border-gray-200 dark:border-white/5 backdrop-blur-md">
        <div className="w-64 h-10 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse" />
        <div className="flex gap-4">
          <div className="w-20 h-10 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse" />
          <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className={headerClassName}>
      <div className="flex items-center w-full max-w-xl relative group mr-4">
        {/* MagnifyingGlass Input stays same, it will drive the global searchQuery state */}
        <MagnifyingGlass
          className="absolute left-4 w-5 h-5 transition-colors text-gray-400 group-focus-within:text-blue-500 dark:text-gray-500 dark:group-focus-within:text-cyan-400"
        />
        <input
          type="text"
          placeholder={
            showErrorControls ? "Funnel errors..." : "MagnifyingGlass command or data..."
          }
          className={inputClassName}
          value={searchQuery || ""}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Buscar en el dashboard"
        />
        {!searchQuery && !showErrorControls && (
          <div className="absolute right-4 flex items-center gap-1">
            <Command className="w-3 h-3 text-gray-400 dark:text-gray-600" />
            <span className="text-[10px] font-mono text-gray-400 dark:text-gray-600">
              K
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Feature Specific: Error Monitoring Controls */}
        {showErrorControls && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-500">
            <HeaderFilterPill
              icon={ShieldWarning}
              options={[
                { value: "all", label: "Toda Severidad" },
                { value: "critical", label: "Crítico" },
                { value: "warning", label: "Advertencia" },
              ]}
              value={errorFilters.severity}
              onChange={(val) =>
                setErrorFilters({ ...errorFilters, severity: val })
              }
            />
            <HeaderFilterPill
              icon={Pulse}
              options={[
                { value: "all", label: "Todo Estado" },
                { value: "failed", label: "Fallido" },
                { value: "reviewing", label: "En Revisión" },
                { value: "resolved", label: "Resuelto" },
                { value: "ignored", label: "Ignorado" },
              ]}
              value={errorFilters.status}
              onChange={(val) =>
                setErrorFilters({ ...errorFilters, status: val })
              }
            />
            <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1" />
          </div>
        )}

        {user ? (
          <UserInfo user={user} />
        ) : (
          <button
            onClick={onShowLogin}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-md dark:bg-cyan-500/10 dark:text-cyan-400 dark:hover:bg-cyan-500/20 dark:hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] dark:shadow-none"
          >
            Iniciar Sesión
          </button>
        )}

        <button
          onClick={toggleTheme}
          className={themeButtonClassName}
          aria-label="Toggle theme"
        >
          <div className="relative w-5 h-5">
            <Sun className="w-5 h-5 absolute top-0 left-0 transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
            <Moon className="w-5 h-5 absolute top-0 left-0 transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
          </div>
        </button>

        <NotificationCenter />
      </div>
    </header>
  );
});
