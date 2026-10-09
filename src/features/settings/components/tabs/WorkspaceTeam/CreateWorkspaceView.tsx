"use client";

import React, { useState } from "react";
import {
  Buildings,
  Sparkle,
  ArrowRight,
  CircleNotch,
  Crown,
  Users,
  Palette,
} from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { UpgradePlanModal } from "@/features/billing/components/modals/UpgradePlanModal";
import { useTranslations } from "next-intl";

/**
 * CreateWorkspaceView — Shown to users who don't own a workspace yet.
 * Allows Pro+ users to create their own organization/workspace.
 * Starter users see an upsell to upgrade.
 */
export function CreateWorkspaceView({ planTier }: { planTier: number }) {
  const { isDark } = useTheme();
  const { session } = useAuthStore();
  const { fetchOrgs } = useOrgStore();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const t = useTranslations("settings");

  const canCreate = planTier >= 2; // Pro or Enterprise

  const handleSlugify = (value: string) => {
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 50),
    );
  };

  const handleCreate = async () => {
    if (!session?.accessToken || !name.trim() || !slug.trim()) return;
    setIsCreating(true);
    try {
      await api.post(
        "/api/v1/user/workspace",
        { name: name.trim(), slug: slug.trim() },
        {
          token: session.accessToken,
        },
      );
      toast.success(t("workspace_created"));
      // Refresh orgs so the user lands in their new org
      await fetchOrgs(session.accessToken, true);
      window.location.reload();
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error?.code === "SLUG_EXISTS") {
        toast.error(t("slug_taken"));
      } else if (error?.code === "PLAN_TOO_LOW") {
        toast.error(t("upgrade_for_workspace"));
      } else if (error?.code === "ALREADY_HAS_WORKSPACE") {
        toast.error(t("already_has_workspace"));
      } else {
        toast.error(error?.message || t("workspace_create_error"));
      }
    } finally {
      setIsCreating(false);
    }
  };

  const benefits = [
    {
      icon: Users,
      label: t("invite_team"),
      desc: planTier >= 3 ? t("invite_unlimited") : t("invite_up_to"),
    },
    {
      icon: Palette,
      label: t("custom_branding"),
      desc: t("custom_branding_desc"),
    },
    {
      icon: Crown,
      label: t("full_admin_control"),
      desc: t("full_admin_desc"),
    },
  ];

  return (
    <div className="settings-glass-card rounded-2xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 border ${
            isDark
              ? "bg-white/[0.04] border-white/8 text-white"
              : "bg-gray-100 border-gray-200 text-gray-800"
          }`}
        >
          <Buildings className="w-7 h-7" />
        </div>
        <h3
          className={`text-xl font-bold font-jakarta mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {t("create_workspace")}
        </h3>
        <p
          className={`text-xs font-mono max-w-112 mx-auto ${isDark ? "text-white/40" : "text-gray-500"}`}
        >
          {t("create_workspace_desc")}
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {benefits.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className={`rounded-xl p-4 text-center border ${
              isDark
                ? "bg-white/[0.02] border-white/[0.05]"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <Icon
              className={`w-5 h-5 mx-auto mb-2 ${isDark ? "text-white/80" : "text-gray-700"}`}
            />
            <p
              className={`text-xs font-bold font-mono ${isDark ? "text-zinc-100" : "text-gray-900"}`}
            >
              {label}
            </p>
            <p
              className={`text-[11px] font-mono mt-1 ${isDark ? "text-white/40" : "text-gray-400"}`}
            >
              {desc}
            </p>
          </div>
        ))}
      </div>

      {canCreate ? (
        /* -- Create Form (Pro/Enterprise) -- */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
              >
                {t("workspace_name_label")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleSlugify(e.target.value)}
                placeholder={t("workspace_name_placeholder")}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                  isDark
                    ? "bg-white/[0.03] border-white/8 text-zinc-100 placeholder:text-zinc-500 focus:border-white/20"
                    : "bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400"
                } focus:outline-none`}
              />
            </div>

            <div>
              <label
                className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
              >
                {t("workspace_slug_label")}
              </label>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-mono ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  celaest.com/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                    )
                  }
                  placeholder={t("workspace_slug_placeholder")}
                  className={`flex-1 px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                    isDark
                      ? "bg-white/[0.03] border-white/8 text-white placeholder:text-zinc-600 focus:border-white/30"
                      : "bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400"
                  } focus:outline-none`}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={isCreating || !name.trim() || !slug.trim()}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-jakarta text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              isCreating || !name.trim() || !slug.trim()
                ? "opacity-40 cursor-not-allowed bg-white/5 text-zinc-500 border border-white/5"
                : "bg-white text-black hover:bg-neutral-200 active:scale-[0.98] shadow-md cursor-pointer"
            }`}
          >
            {isCreating ? (
              <>
                <CircleNotch className="w-4 h-4 animate-spin text-black" />
                {t("creating_workspace")}
              </>
            ) : (
              <>
                <Buildings className="w-4 h-4" />
                {t("create_workspace_btn")}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      ) : (
        /* -- Upsell (Starter) -- */
        <div
          className={`rounded-2xl p-6 text-center border ${
            isDark
              ? "bg-white/[0.02] border-white/[0.05]"
              : "bg-amber-50/50 border-amber-200"
          }`}
        >
          <Sparkle
            className={`w-6 h-6 mx-auto mb-3 ${isDark ? "text-amber-400" : "text-amber-600"}`}
          />
          <p
            className={`font-semibold mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}
          >
            {t("upgrade_to_pro")}
          </p>
          <p
            className={`text-sm mb-4 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
          >
            {t("workspace_plan_info")}
          </p>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="mt-4 mx-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-jakarta text-xs font-semibold uppercase tracking-wider transition-all duration-200 bg-white text-black hover:bg-neutral-200 shadow-md cursor-pointer"
          >
            <Crown className="w-4 h-4" />
            {t("upgrade_plan")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upgrade Plan Modal */}
      <UpgradePlanModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}
