"use client";

import React from "react";
import Link from "next/link";
import {
  Sun,
  Moon,
  ShieldWarning,
  Pulse,
  List,
  ArrowUpRight,
  User,
} from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { NotificationCenter } from "./NotificationCenter";
import { LocaleSwitcher } from "./Header/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { useErrorStore } from "@/features/errors/stores/useErrorStore";
import { UserInfo } from "./Header/UserInfo";
import { HeaderFilterPill } from "./Header/HeaderFilterPill";

interface HeaderProps {
  onShowLogin?: () => void;
  onMenuClick?: () => void;
}

export const Header = React.memo(function Header({
  onShowLogin,
  onMenuClick,
}: HeaderProps) {
  const { toggleTheme, isMounted } = useTheme();
  const { user } = useAuth();
  const { showErrorControls, errorFilters, setErrorFilters } = useErrorStore();
  const tHeader = useTranslations("header");
  const tAuth = useTranslations("auth");

  // Static classes resolving synchronously via Tailwind dark: variants
  const headerClassName =
    "h-20 px-4 flex items-center justify-between sticky top-0 z-40 md:backdrop-blur-md border-b transition-colors duration-300 bg-white dark:bg-black md:bg-white/60 md:dark:bg-black/40 border-gray-200 dark:border-white/5";

  const themeButtonClassName =
    "p-2 rounded-full transition-all duration-300 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-yellow-400 dark:hover:bg-white/5";

  // Prevent hydration mismatch for icons/theme-dependent UI
  if (!isMounted) {
    return (
      <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-40 border-b bg-white dark:bg-black md:bg-white/60 md:dark:bg-black/40 border-gray-200 dark:border-white/5 md:backdrop-blur-md">
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
      <div className="flex items-center gap-1.5">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-full transition-all duration-300 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-cyan-400 dark:hover:bg-white/5"
            aria-label="Open menu"
          >
            <List size={22} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Feature Specific: Error Monitoring Controls */}
        {showErrorControls && (
          <div className="hidden md:flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-500">
            <HeaderFilterPill
              icon={ShieldWarning}
              options={[
                { value: "all", label: tHeader("all_severity") },
                { value: "critical", label: tHeader("critical") },
                { value: "warning", label: tHeader("warning") },
              ]}
              value={errorFilters.severity}
              onChange={(val) =>
                setErrorFilters({ ...errorFilters, severity: val })
              }
            />
            <HeaderFilterPill
              icon={Pulse}
              options={[
                { value: "all", label: tHeader("all_status") },
                { value: "failed", label: tHeader("failed") },
                { value: "reviewing", label: tHeader("reviewing") },
                { value: "resolved", label: tHeader("resolved") },
                { value: "ignored", label: tHeader("ignored") },
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
          <>
            {/* Desktop auth buttons */}
            <div className="hidden sm:flex items-center gap-3 sm:gap-4">
              <button
                onClick={onShowLogin}
                className="text-xs font-semibold text-gray-600 transition-colors hover:text-gray-950 dark:text-gray-400 dark:hover:text-white sm:text-sm cursor-pointer"
              >
                {tAuth("sign_in")}
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-white/25" />
              <Link
                href="/?mode=signup"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-500 sm:text-sm"
              >
                {tAuth("sign_up")}
                <ArrowUpRight className="h-3.5 w-3.5" weight="bold" />
              </Link>
            </div>

            {/* Mobile compact login icon */}
            <button
              onClick={onShowLogin}
              className="flex sm:hidden p-2 rounded-full transition-all duration-300 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-cyan-400 dark:hover:bg-white/5 cursor-pointer"
              aria-label={tAuth("sign_in")}
            >
              <User size={20} />
            </button>
          </>
        )}

        <LocaleSwitcher align="right" />

        <button
          onClick={toggleTheme}
          className={`${themeButtonClassName} sm:flex hidden`}
          aria-label={tHeader("toggle_theme")}
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
