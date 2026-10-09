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
        className={`w-full flex items-center rounded-xl transition-colors duration-200 ${
          isExpanded ? "gap-3 p-2" : "h-12 justify-center p-0"
        } ${
          isDark
            ? `text-zinc-100 ${isOpen ? "bg-white/[0.04]" : "hover:bg-white/[0.04]"}`
            : `text-zinc-900 ${isOpen ? "bg-zinc-100" : "hover:bg-zinc-100"}`
        }`}
      >
        {/* Org avatar */}
        <div
          className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xs font-mono font-bold overflow-hidden transition-colors ${
            isDark
              ? "bg-white/[0.05] border border-white/8 text-zinc-100 shadow-xs"
              : "bg-zinc-100 border border-zinc-200 text-zinc-800 shadow-xs"
          }`}
        >
          {currentOrg?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
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

        {/* Org name + chevron only render when expanded */}
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
              <p
                className={`text-sm font-semibold truncate ${
                  isDark ? "text-zinc-100" : "text-zinc-900"
                }`}
              >
                {currentOrg?.name || t("select_workspace")}
              </p>
              <p
                className={`text-[10px] font-mono uppercase tracking-wider truncate ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`}
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
                weight="bold"
                className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
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
            className={`absolute left-3 right-3 top-full mt-2 rounded-2xl border shadow-2xl z-100 overflow-hidden backdrop-blur-2xl ${
              isDark
                ? "bg-[#09090b]/95 border-white/8 shadow-2xl shadow-black/90"
                : "bg-white/95 border-zinc-200 shadow-xl shadow-zinc-900/10"
            }`}
          >
            <div className="p-1.5 max-h-64 overflow-y-auto space-y-1">
              {visibleOrgs.map((org: Organization) => {
                const isSelected = currentOrg?.id === org.id;
                return (
                  <button
                    key={org.id}
                    onClick={() => handleSelect(org)}
                    className={`w-full flex items-center gap-3 rounded-xl p-2.5 transition-colors text-left ${
                      isSelected
                        ? isDark
                          ? "bg-zinc-800/40 border border-white/8 text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                          : "bg-zinc-100 border border-zinc-200/80 text-zinc-900"
                        : isDark
                          ? "border border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                          : "border border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                    }`}
                  >
                    <div
                      className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold overflow-hidden transition-colors ${
                        isSelected
                          ? isDark
                            ? "bg-white/[0.08] border border-white/15 text-white"
                            : "bg-zinc-200/80 border border-zinc-300 text-zinc-900"
                          : isDark
                            ? "bg-white/[0.03] border border-white/6 text-zinc-400"
                            : "bg-zinc-100 border border-zinc-200 text-zinc-500"
                      }`}
                    >
                      {org.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
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
                      <p
                        className={`text-sm font-medium truncate ${
                          isSelected
                            ? isDark
                              ? "text-zinc-100 font-semibold"
                              : "text-zinc-900 font-semibold"
                            : isDark
                              ? "text-zinc-300"
                              : "text-zinc-700"
                        }`}
                      >
                        {org.name}
                      </p>
                      <p
                        className={`text-[10px] font-mono uppercase tracking-wider ${
                          isDark ? "text-zinc-500" : "text-zinc-400"
                        }`}
                      >
                        {org.role || t("member")}
                      </p>
                    </div>
                    {isSelected && (
                      <Check
                        size={14}
                        weight="bold"
                        className={isDark ? "text-zinc-100 shrink-0" : "text-zinc-900 shrink-0"}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Create workspace link */}
            <div
              className={`border-t p-1.5 mt-1 ${isDark ? "border-white/6" : "border-zinc-200/80"}`}
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
                className={`w-full flex items-center gap-2.5 rounded-xl p-2.5 text-xs font-mono font-medium transition-colors ${
                  isDark
                    ? "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                <Plus size={14} weight="bold" />
                <span>{t("create_workspace")}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
