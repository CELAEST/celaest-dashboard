"use client";

import React, { useMemo } from "react";
import {
  Search,
  Command,
  Sun,
  Moon,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { NotificationCenter } from "./NotificationCenter";
import { useUIStore } from "@/stores/useUIStore";
import { UserInfo } from "./Header/UserInfo";
import { HeaderFilterPill } from "./Header/HeaderFilterPill";

interface HeaderProps {
  onShowLogin?: () => void;
}

export const Header = React.memo(function Header({ onShowLogin }: HeaderProps) {
  const { toggleTheme, isDark, isMounted } = useTheme();
  const { user } = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    showErrorControls,
    errorFilters,
    setErrorFilters,
  } = useUIStore();

  // Memoizar clases dinámicas
  const headerClassName = useMemo(
    () =>
      `h-20 px-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
        isDark ? "bg-black/40 border-white/5" : "bg-white/60 border-gray-200"
      }`,
    [isDark],
  );

  const inputClassName = useMemo(
    () =>
      `w-full border rounded-full h-10 pl-12 pr-12 text-sm focus:outline-none focus:ring-1 transition-all ${
        isDark
          ? "bg-black/50 border-white/10 text-white focus:border-cyan-500/50 focus:ring-cyan-500/50 placeholder:text-gray-600"
          : "bg-gray-100 border-gray-200 text-gray-900 focus:border-blue-500/50 focus:ring-blue-500/50 placeholder:text-gray-500"
      }`,
    [isDark],
  );

  const themeButtonClassName = useMemo(
    () =>
      `p-2 rounded-full transition-all duration-300 ${
        isDark
          ? "text-gray-400 hover:text-yellow-400 hover:bg-white/5"
          : "text-gray-500 hover:text-blue-600 hover:bg-gray-100"
      }`,
    [isDark],
  );

  // Prevent hydration mismatch for icons/theme-dependent UI
  if (!isMounted) {
    return (
      <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-40 border-b bg-white/60 border-gray-200">
        <div className="w-64 h-10 bg-gray-100 rounded-full animate-pulse" />
        <div className="flex gap-4">
          <div className="w-20 h-10 bg-gray-100 rounded-full animate-pulse" />
          <div className="w-10 h-10 bg-gray-100 rounded-full animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className={headerClassName}>
      <div className="flex items-center w-full max-w-xl relative group mr-4">
        {/* Search Input stays same, it will drive the global searchQuery state */}
        <Search
          className={`absolute left-4 w-5 h-5 transition-colors ${
            isDark
              ? "text-gray-500 group-focus-within:text-cyan-400"
              : "text-gray-400 group-focus-within:text-blue-500"
          }`}
        />
        <input
          type="text"
          placeholder={
            showErrorControls ? "Filter errors..." : "Search command or data..."
          }
          className={inputClassName}
          value={searchQuery || ""}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {!searchQuery && !showErrorControls && (
          <div className="absolute right-4 flex items-center gap-1">
            <Command
              className={`w-3 h-3 ${isDark ? "text-gray-600" : "text-gray-400"}`}
            />
            <span
              className={`text-[10px] font-mono ${isDark ? "text-gray-600" : "text-gray-400"}`}
            >
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
              icon={ShieldAlert}
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
              icon={Activity}
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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isDark
                ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
            }`}
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
