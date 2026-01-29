"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { usePermissions } from "@/features/auth/hooks/useAuthorization";
import { type Permission } from "@/features/auth/lib/permissions";
import { SignOutModal } from "./SignOutModal";
import Logo from "@/components/icons/Logo";
import { menuItems } from "./Sidebar/config";
import { SidebarMenuItem } from "./Sidebar/SidebarMenuItem";

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
  const { signOut, user } = useAuth();
  const { hasPermission } = usePermissions();
  const isDark = theme === "dark";

  // Memoizar items visibles
  const visibleMenuItems = useMemo(
    () =>
      menuItems.filter((item) => {
        // If guest, show all (locked status handled in render)
        if (isGuest) return true;

        if (!item.scope) return true;
        return user ? hasPermission(item.scope as Permission) : true;
      }),
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
      `h-screen fixed left-0 top-0 z-50 flex flex-col backdrop-blur-xl border-r transition-colors duration-300 ${
        isDark
          ? "bg-black/80 border-cyan-500/20 shadow-[0_0_20px_rgba(0,255,255,0.05)]"
          : "bg-white/80 border-gray-200 shadow-xl"
      }`,
    [isDark],
  );

  return (
    <>
      <motion.div
        className={containerClassName}
        initial={{ width: "80px" }}
        animate={{ width: isHovered ? "240px" : "80px" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="h-20 flex items-center justify-center relative overflow-hidden px-4">
          <div
            className={`absolute inset-0 bg-linear-to-r opacity-50 ${
              isDark
                ? "from-cyan-500/10 to-transparent"
                : "from-blue-500/10 to-transparent"
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
              <div className="flex flex-col leading-none whitespace-nowrap">
                <span
                  className={`text-xl font-bold tracking-tight ${
                    isDark
                      ? "bg-linear-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent"
                      : "bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent"
                  }`}
                >
                  CELAEST
                </span>
                <span
                  className={`text-[10px] font-medium tracking-[0.21em] mt-0.5 ${
                    isDark ? "text-cyan-400/60" : "text-blue-500/60"
                  }`}
                >
                  DASHBOARD
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <nav className="flex-1 py-8 flex flex-col gap-2 px-4 overflow-hidden">
          {visibleMenuItems.map((item) => (
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
        </nav>

        {!isGuest && (
          <div
            className={`p-4 border-t ${
              isDark ? "border-white/5" : "border-gray-200"
            }`}
          >
            <button
              onClick={handleSignOutClick}
              className={`flex items-center w-full h-12 transition-colors rounded-xl px-3 ${
                isDark
                  ? "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                  : "text-gray-500 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              <LogOut size={20} />
              <motion.span
                className="ml-3 whitespace-nowrap font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
              >
                Sign Out
              </motion.span>
            </button>
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
