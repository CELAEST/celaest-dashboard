"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  ShoppingCart,
  Settings,
  Activity,
  LogOut,
  Shield,
  CreditCard,
  FolderOpen,
  GitBranch,
  UserCog,
  TrendingUp,
  AlertTriangle,
  LucideIcon,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import Logo from "@/components/icons/Logo";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  scope: string | null;
}

// Items del menú definidos fuera del componente
const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Control Center",
    scope: null,
  },
  {
    id: "marketplace",
    icon: ShoppingCart,
    label: "Marketplace",
    scope: "marketplace:purchase",
  },
  {
    id: "catalog",
    icon: FolderOpen,
    label: "Asset Manager",
    scope: "templates:write",
  },
  {
    id: "releases",
    icon: GitBranch,
    label: "Releases",
    scope: "releases:read",
  },
  { id: "licensing", icon: Shield, label: "Licensing", scope: null },
  {
    id: "roi",
    icon: TrendingUp,
    label: "ROI Dashboard",
    scope: "analytics:read",
  },
  {
    id: "errors",
    icon: AlertTriangle,
    label: "Error Monitor",
    scope: "analytics:read",
  },
  { id: "billing", icon: CreditCard, label: "Billing", scope: "billing:read" },
  {
    id: "analytics",
    icon: Activity,
    label: "Analytics",
    scope: "analytics:read",
  },
  {
    id: "users",
    icon: UserCog,
    label: "User Management",
    scope: "users:manage",
  },
  { id: "settings", icon: Settings, label: "Settings", scope: null },
];

// Componente de item de menú memoizado
const SidebarMenuItem = React.memo(function SidebarMenuItem({
  item,
  isActive,
  isHovered,
  isDark,
  onClick,
}: {
  item: MenuItem;
  isActive: boolean;
  isHovered: boolean;
  isDark: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  const buttonClassName = useMemo(
    () =>
      `group relative flex items-center h-12 rounded-xl transition-all duration-300 ${
        isActive
          ? isDark
            ? "bg-cyan-500/10 text-cyan-400"
            : "bg-blue-50 text-blue-600"
          : isDark
          ? "text-gray-400 hover:text-white hover:bg-white/5"
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
      }`,
    [isActive, isDark]
  );

  return (
    <button onClick={onClick} className={buttonClassName}>
      <div
        className={`absolute left-0 w-1 h-full rounded-r-full transition-opacity duration-300 ${
          isDark ? "bg-cyan-400" : "bg-blue-600"
        }`}
        style={{ opacity: isActive ? 1 : 0 }}
      />

      <div className="min-w-[48px] flex items-center justify-center">
        <Icon
          size={22}
          className={`transition-all duration-300 ${
            isActive && isDark
              ? "drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]"
              : ""
          }`}
        />
      </div>

      <motion.span
        className="whitespace-nowrap font-medium tracking-wide text-sm"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
        transition={{ duration: 0.2 }}
      >
        {item.label}
      </motion.span>

      {isActive && isHovered && (
        <motion.div
          layoutId="activeGlow"
          className={`absolute inset-0 rounded-xl -z-10 ${
            isDark ? "bg-cyan-400/5" : "bg-blue-600/5"
          }`}
        />
      )}
    </button>
  );
});

export const Sidebar = React.memo(function Sidebar({
  activeTab,
  setActiveTab,
}: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const { signOut, hasScope, user } = useAuth();
  const isDark = theme === "dark";

  // Memoizar items visibles
  const visibleMenuItems = useMemo(
    () =>
      menuItems.filter((item) => {
        if (!item.scope) return true;
        return user
          ? hasScope(item.scope as Parameters<typeof hasScope>[0])
          : true;
      }),
    [user, hasScope]
  );

  // Callbacks memoizados
  const handleSignOut = useCallback(async () => {
    if (user) {
      if (confirm("Are you sure you want to sign out?")) {
        await signOut();
      }
    } else {
      if (confirm("Restart demo?")) {
        window.location.reload();
      }
    }
  }, [user, signOut]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // Clases memoizadas
  const containerClassName = useMemo(
    () =>
      `h-screen fixed left-0 top-0 z-50 flex flex-col backdrop-blur-xl border-r transition-colors duration-300 ${
        isDark
          ? "bg-black/80 border-cyan-500/20 shadow-[0_0_20px_rgba(0,255,255,0.05)]"
          : "bg-white/80 border-gray-200 shadow-xl"
      }`,
    [isDark]
  );

  return (
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
          className="relative z-10 flex items-center gap-3 w-full justify-center"
          animate={{ marginLeft: isHovered ? "-12px" : "0px" }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="shrink-0 w-10 h-10"
            animate={{ scale: isHovered ? 1 : 1.1 }}
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
            isDark={isDark}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </nav>

      <div
        className={`p-4 border-t ${
          isDark ? "border-white/5" : "border-gray-200"
        }`}
      >
        <button
          onClick={handleSignOut}
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
    </motion.div>
  );
});
