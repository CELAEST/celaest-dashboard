"use client";

import React, { useMemo } from "react";
import { Search, Command, Sun, Moon, Filter } from "lucide-react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { NotificationCenter } from "./NotificationCenter";
import { useUIStore } from "@/stores/useUIStore";
import { UserInfo } from "./Header/UserInfo";

interface HeaderProps {
  onShowLogin?: () => void;
}

export const Header = React.memo(function Header({ onShowLogin }: HeaderProps) {
  const { toggleTheme, isDark, isMounted } = useTheme();
  const { user } = useAuth();
  const { navbarSearchVisible, searchQuery, setSearchQuery } = useUIStore();

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
        {navbarSearchVisible ? (
          <>
            <Search
              className={`absolute left-4 w-5 h-5 transition-colors ${
                isDark ? "text-cyan-400" : "text-blue-500"
              }`}
            />
            <input
              key="search-active"
              type="text"
              placeholder="Buscar soluciones enterprise..."
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={inputClassName}
              autoFocus
            />
            <div className="absolute right-2 flex items-center gap-2">
              <button
                className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                    ${
                      isDark
                        ? "bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }
                  `}
              >
                <Filter size={12} />
                Filtros
              </button>
            </div>
          </>
        ) : (
          <>
            <Search
              className={`absolute left-4 w-5 h-5 transition-colors ${
                isDark
                  ? "text-gray-500 group-focus-within:text-cyan-400"
                  : "text-gray-400 group-focus-within:text-blue-500"
              }`}
            />
            <input
              key="search-inactive"
              type="text"
              placeholder="Search command or data..."
              className={inputClassName}
              value=""
              readOnly
            />
            <div className="absolute right-4 flex items-center gap-1">
              <Command
                className={`w-3 h-3 ${isDark ? "text-gray-600" : "text-gray-400"}`}
              />
              <span
                className={`text-[10px] font-mono ${
                  isDark ? "text-gray-600" : "text-gray-400"
                }`}
              >
                K
              </span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-6">
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
