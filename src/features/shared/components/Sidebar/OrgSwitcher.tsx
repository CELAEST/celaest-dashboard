"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Building2, ChevronDown, Check, Plus } from "lucide-react";
import {
  useOrgStore,
  Organization,
} from "@/features/shared/stores/useOrgStore";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { usersApi } from "@/features/users/api/users.api";
import { logger } from "@/lib/logger";

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Don't show if 0 or 1 visible orgs
  if (organizations.length <= 1) return null;

  const handleSelect = async (org: Organization) => {
    if (org.id === currentOrg?.id) {
      setIsOpen(false);
      return;
    }

    setCurrentOrg(org);
    setIsOpen(false);

    toast.success(`Contexto cambiado`, {
      description: `Operando en workspace: ${org.name}`,
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
    <div ref={dropdownRef} className="relative px-3 mb-2">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 rounded-xl p-2 transition-colors ${
          isDark
            ? "hover:bg-white/5 text-white"
            : "hover:bg-gray-100 text-gray-900"
        }`}
      >
        {/* Org avatar */}
        <div
          className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${
            isDark
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              : "bg-blue-100 text-blue-700 border border-blue-200"
          }`}
        >
          {currentOrg ? (
            getOrgInitials(currentOrg.name)
          ) : (
            <Building2 size={16} />
          )}
        </div>

        {/* Org name (visible when expanded) */}
        <motion.div
          className="flex-1 min-w-0 text-left overflow-hidden"
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm font-semibold truncate">
            {currentOrg?.name || "Select Workspace"}
          </p>
          <p
            className={`text-[10px] truncate ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            {currentOrg?.role || "member"}
          </p>
        </motion.div>

        {/* Chevron (visible when expanded) */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown
            size={14}
            className={`transition-transform ${isOpen ? "rotate-180" : ""} ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          />
        </motion.div>
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
              {organizations.map((org: Organization) => (
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
                    className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                      currentOrg?.id === org.id
                        ? isDark
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "bg-blue-100 text-blue-700"
                        : isDark
                          ? "bg-white/10 text-gray-400"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {getOrgInitials(org.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{org.name}</p>
                    <p
                      className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      {org.role || "member"}
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
              <a
                href="/settings?tab=workspace"
                className={`w-full flex items-center gap-2 rounded-lg p-2.5 text-sm transition-colors ${
                  isDark
                    ? "text-gray-400 hover:text-cyan-400 hover:bg-white/5"
                    : "text-gray-500 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <Plus size={14} />
                <span>Create workspace</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
