"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Buildings, CaretDown, Check, Plus } from "@phosphor-icons/react";
import {
  useOrgStore,
  Organization,
} from "@/features/shared/stores/useOrgStore";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { usersApi } from "@/features/users/api/users.api";
import { logger } from "@/lib/logger";
import { useBilling } from "@/features/billing/hooks/useBilling";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface OrgSwitcherProps {
  isExpanded: boolean;
}

/**
 * OrgSwitcher — Dropdown to switch between organizations.
 * Shows current org name when sidebar is expanded, icon-only when collapsed.
 * Only visible if user belongs to 2+ orgs.
 */
export function OrgSwitcher({ isExpanded }: OrgSwitcherProps) {
  const { isDark } = useTheme();
  const { currentOrg, organizations, setCurrentOrg } = useOrgStore();
  const { session } = useAuthStore();
  const { plan } = useBilling();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("sidebar");

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hide the Celaest home org from the switcher when the user already owns a
  // real workspace. The home org is implicit (all content lives there as a
  // fallback) and showing it next to a user's own workspaces is noisy.
  // Membership is preserved server-side — this filter is design-only.
  const isHomeOrg = (org: Organization) =>
    org.is_system_default === true ||
    (org.slug ?? "").toLowerCase().startsWith("celaest");

  const visibleOrgs = useMemo(() => {
    const ownsNonHome = organizations.some(
      (o) => o.role === "owner" && !isHomeOrg(o),
    );
    if (!ownsNonHome) return organizations;
    return organizations.filter((o) => !isHomeOrg(o));
  }, [organizations]);

  // Always render the switcher when there is at least one visible org so the
  // current workspace label is shown in the sidebar even for users that only
  // belong to Celaest. We only bail out when there is literally nothing to
  // display (e.g. data still loading).
  if (visibleOrgs.length === 0) return null;

  const handleSelect = async (org: Organization) => {
    if (org.id === currentOrg?.id) {
      setIsOpen(false);
      return;
    }

    setCurrentOrg(org);
    setIsOpen(false);

    toast.success(t("context_changed"), {
      description: t("operating_in_workspace", { orgName: org.name }),
      duration: 3000,
    });

    // Perisist to backend if session exists
    if (session?.accessToken) {
      try {
        await usersApi.updateMe(
          { organization_id: org.id },
          session.accessToken,
        );
        logger.debug("Workspace selection persisted to backend:", org.id);
      } catch (error) {
        logger.error(
          "Failed to persist workspace selection to backend:",
          error,
        );
      }
    }
  };

  const getOrgInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div ref={dropdownRef} className="relative px-3 mt-4 mb-0">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center rounded-xl transition-colors ${
          isExpanded ? "gap-3 p-2" : "h-12 justify-center p-0"
        } ${
          isDark
            ? "hover:bg-white/5 text-white"
            : "hover:bg-gray-100 text-gray-900"
        }`}
      >
        {/* Org avatar */}
        <div
          className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold overflow-hidden ${
            !currentOrg?.primary_color
              ? isDark
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "bg-blue-100 text-blue-700 border border-blue-200"
              : "border"
          }`}
          style={
            currentOrg?.primary_color
              ? {
                  backgroundColor: `${currentOrg.primary_color}20`,
                  color: currentOrg.primary_color,
                  borderColor: `${currentOrg.primary_color}30`,
                }
              : undefined
          }
        >
          {currentOrg?.logo_url ? (
            <img
              src={currentOrg.logo_url}
              alt={currentOrg.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : currentOrg ? (
            getOrgInitials(currentOrg.name)
          ) : (
            <Buildings size={16} />
          )}
        </div>

        {/* Org name + chevron only render when expanded.
            When collapsed they would still claim layout width because of
            `flex-1` (animated width:0 doesn't override flex-grow), shifting
            the avatar to the left and breaking the visual symmetry with the
            menu items below. Conditional render keeps the avatar perfectly
            centered by the button's justify-center. */}
        {isExpanded && (
          <>
            {/* Org name */}
            <motion.div
              className="flex-1 min-w-0 text-left overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm font-semibold truncate">
                {currentOrg?.name || t("select_workspace")}
              </p>
              <p
                className={`text-[10px] truncate ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                {currentOrg?.role || t("member")}
              </p>
            </motion.div>

            {/* Chevron */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CaretDown
                size={14}
                className={`transition-transform ${isOpen ? "rotate-180" : ""} ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
            </motion.div>
          </>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute left-3 right-3 top-full mt-1 rounded-xl border shadow-xl z-100 overflow-hidden ${
              isDark
                ? "bg-gray-900 border-white/10 shadow-black/40"
                : "bg-white border-gray-200 shadow-gray-200/60"
            }`}
          >
            <div className="p-1.5 max-h-64 overflow-y-auto">
              {visibleOrgs.map((org: Organization) => (
                <button
                  key={org.id}
                  onClick={() => handleSelect(org)}
                  className={`w-full flex items-center gap-3 rounded-lg p-2.5 transition-colors text-left ${
                    currentOrg?.id === org.id
                      ? isDark
                        ? "bg-cyan-500/10 text-cyan-400"
                        : "bg-blue-50 text-blue-700"
                      : isDark
                        ? "text-gray-300 hover:bg-white/5"
                        : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold overflow-hidden ${
                      !org.primary_color
                        ? currentOrg?.id === org.id
                          ? isDark
                            ? "bg-cyan-500/20 text-cyan-400"
                            : "bg-blue-100 text-blue-700"
                          : isDark
                            ? "bg-white/10 text-gray-400"
                            : "bg-gray-100 text-gray-500"
                        : ""
                    }`}
                    style={
                      org.primary_color
                        ? {
                            backgroundColor: `${org.primary_color}20`,
                            color: org.primary_color,
                          }
                        : undefined
                    }
                  >
                    {org.logo_url ? (
                      <img
                        src={org.logo_url}
                        alt={org.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      getOrgInitials(org.name)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{org.name}</p>
                    <p
                      className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      {org.role || t("member")}
                    </p>
                  </div>
                  {currentOrg?.id === org.id && (
                    <Check
                      size={14}
                      className={isDark ? "text-cyan-400" : "text-blue-600"}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Create workspace link */}
            <div
              className={`border-t p-1.5 ${isDark ? "border-white/10" : "border-gray-100"}`}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (!plan) {
                    toast.info(t("upgrade_required"), {
                      description: t("upgrade_required_desc"),
                      duration: 4000,
                    });
                    // Lleva al usuario a ver los planes
                    router.push("/?tab=billing");
                  } else {
                    // Tiene plan, lo llevamos a la pestaña de settings -> workspace
                    router.push("/?tab=settings&section=workspace");
                  }
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 rounded-lg p-2.5 text-sm transition-colors ${
                  isDark
                    ? "text-gray-400 hover:text-cyan-400 hover:bg-white/5"
                    : "text-gray-500 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <Plus size={14} />
                <span>{t("create_workspace")}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
