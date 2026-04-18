"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { motion } from "motion/react";
import { SignOut, Bomb } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { usePermissions } from "@/features/auth/hooks/useAuthorization";
import { type Permission } from "@/features/auth/lib/permissions";
import { SignOutModal } from "./SignOutModal";
import Logo from "@/components/icons/Logo";
import { menuSections } from "./Sidebar/config";
import { SidebarMenuItem } from "./Sidebar/SidebarMenuItem";
import { OrgSwitcher } from "./Sidebar/OrgSwitcher";
import { useOrgStore } from "../stores/useOrgStore";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isGuest?: boolean;
  onShowLogin?: () => void;
}

export const AppSidebar = React.memo(function AppSidebar({
  activeTab,
  setActiveTab,
  isGuest,
  onShowLogin,
}: SidebarProps) {
  const router = useRouter(); // Initialize router
  const [isHovered, setIsHovered] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const { theme } = useTheme();
  const { signOut } = useAuth();

  // Selective subscriptions for performance and reactivity
  const user = useAuthStore(useShallow((state) => state.user));
  const { currentOrg } = useOrgStore(
    useShallow((state) => ({
      currentOrg: state.currentOrg,
    })),
  );
  const currentOrgId = currentOrg?.id;

  const { hasPermission } = usePermissions();
  const isDark = theme === "dark";

  // Memoizar secciones y filtrar sus ítems
  const visibleMenuSections = useMemo(
    () =>
      menuSections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => {
            if (isGuest) return true;
            if (!item.scope) return true;
            return user ? hasPermission(item.scope as Permission) : true;
          }),
        }))
        .filter((section) => section.items.length > 0),
    [user, hasPermission, isGuest],
  );

  // Abrir modal de Sign Out
  const handleSignOutClick = useCallback(() => {
    setShowSignOutModal(true);
  }, []);

  // Confirmar Sign Out
  const handleConfirmSignOut = useCallback(async () => {
    setShowSignOutModal(false);

    // 1. Navigate immediately to update URL params (pre-empting the guest check)
    router.replace("/?mode=signin");

    // 2. Perform sign out
    if (user) {
      await signOut();
    }
  }, [user, signOut, router]);

  // Cancelar Sign Out
  const handleCancelSignOut = useCallback(() => {
    setShowSignOutModal(false);
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const handleItemClick = useCallback(
    (id: string) => {
      if (isGuest && id !== "marketplace") {
        onShowLogin?.();
        return;
      }
      setActiveTab(id);
    },
    [isGuest, onShowLogin, setActiveTab],
  );

  // Clases memoizadas
  const containerClassName = useMemo(
    () =>
      `h-screen fixed left-0 top-0 z-50 flex flex-col backdrop-blur-2xl border-r transition-colors duration-300 ${
        isDark
          ? "bg-[#020202]/80 border-white/[0.05] shadow-[4px_0_24px_rgba(0,0,0,0.5)]"
          : "bg-white/80 border-gray-200 shadow-xl"
      }`,
    [isDark],
  );

  return (
    <>
      <motion.div
        className={containerClassName}
        initial={{ width: "88px" }}
        animate={{ width: isHovered ? "280px" : "88px" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="h-20 flex items-center justify-center relative overflow-hidden px-4 border-b border-transparent dark:border-white/2">
          <div
            className={`absolute inset-0 bg-linear-to-r ${
              isDark
                ? "from-white/2 to-transparent"
                : "from-blue-500/5 to-transparent"
            }`}
          />

          <motion.div
            className="relative z-10 flex items-center gap-1 w-full justify-center"
            animate={{ marginLeft: isHovered ? "-12px" : "0px" }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="shrink-0 w-15 h-15"
              animate={{
                scale: isHovered ? 1.05 : 1.1,
                x: isHovered ? 0 : 3,
                y: isHovered ? 4 : 7,
              }}
              transition={{ duration: 0.3 }}
            >
              <Logo
                className="w-full h-full"
                color={isDark ? "#22d3ee" : "#2563eb"}
              />
            </motion.div>

            <motion.div
              className="overflow-hidden"
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: isHovered ? "auto" : 0,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col shrink-0 leading-none whitespace-nowrap">
                <span
                  className={`text-xl font-bold tracking-tight ${
                    isDark
                      ? "text-white"
                      : "bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent"
                  }`}
                >
                  CELAEST
                </span>
                <span
                  className={`text-[10px] font-medium tracking-[0.21em] mt-0.5 ${
                    isDark ? "text-gray-500" : "text-blue-500/60"
                  }`}
                >
                  DASHBOARD
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Org Switcher (multi-org dropdown) */}
        {!isGuest && <OrgSwitcher isExpanded={isHovered} />}

        <nav
          className={`flex-1 py-6 flex flex-col px-3 overflow-y-auto no-scrollbar transition-all duration-300 ${
            isHovered ? "gap-6" : "gap-2"
          }`}
        >
          {visibleMenuSections.map((section, sidx) => (
            <div key={sidx} className="flex flex-col gap-1">
              <motion.div
                initial={false}
                animate={{
                  height: isHovered ? 24 : 0,
                  opacity: isHovered ? 1 : 0,
                }}
                className="overflow-hidden flex flex-col justify-end"
              >
                <div className="px-3 pb-2">
                  <span
                    className={`text-[11px] whitespace-nowrap font-bold tracking-widest uppercase ${
                      isDark ? "text-gray-500/80" : "text-gray-400"
                    }`}
                  >
                    {section.title}
                  </span>
                </div>
              </motion.div>
              {section.items.map((item) => (
                <SidebarMenuItem
                  key={item.id}
                  item={item}
                  isActive={activeTab === item.id}
                  isHovered={isHovered}
                  isLocked={isGuest && item.id !== "marketplace"}
                  isDark={isDark}
                  onClick={() => handleItemClick(item.id)}
                />
              ))}
            </div>
          ))}
        </nav>

        {!isGuest && (
          <div
            className={`p-4 border-t flex flex-col gap-3 ${
              isDark ? "border-white/5" : "border-gray-200"
            }`}
          >
            {/* Live Connection Status */}
            <motion.div
              className="flex items-center gap-2 px-1"
              animate={{ opacity: isHovered ? 1 : 0 }}
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-cyan-400/80" : "text-blue-600/80"}`}
                >
                  Live Connection
                </span>
                <span
                  className={`text-[8px] font-mono truncate max-w-[140px] ${isDark ? "text-gray-600" : "text-gray-400"}`}
                >
                  ID: {currentOrgId || "N/A"}
                </span>
              </div>
            </motion.div>

            <button
              onClick={handleSignOutClick}
              className={`flex items-center w-full h-10 transition-colors rounded-xl px-3 ${
                isDark
                  ? "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                  : "text-gray-500 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              <SignOut size={20} />
              <motion.span
                className="ml-3 whitespace-nowrap font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
              >
                Sign Out
              </motion.span>
            </button>

            {/* Development Tools */}
            {process.env.NODE_ENV === "development" && (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "☢️ NUCLEAR RESET: Are you sure you want to clear ALL local storage and session data?",
                    )
                  ) {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = "/";
                  }
                }}
                className={`flex items-center w-full h-10 transition-colors rounded-xl px-3 ${
                  isDark
                    ? "text-orange-400 hover:text-white hover:bg-orange-500"
                    : "text-orange-600 hover:text-white hover:bg-orange-500"
                }`}
                title="Nuclear Reset (Dev Only)"
              >
                <Bomb size={20} />
                <motion.span
                  className="ml-3 whitespace-nowrap font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                >
                  Clear Storage
                </motion.span>
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Sign Out Modal */}
      <SignOutModal
        isOpen={showSignOutModal}
        onClose={handleCancelSignOut}
        onConfirm={handleConfirmSignOut}
        isDemo={!user}
      />
    </>
  );
});
