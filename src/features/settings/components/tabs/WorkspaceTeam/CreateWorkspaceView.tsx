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
      toast.success("Workspace created! Redirecting...");
      // Refresh orgs so the user lands in their new org
      await fetchOrgs(session.accessToken, true);
      window.location.reload();
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error?.code === "SLUG_EXISTS") {
        toast.error("This slug is already taken. Try another one.");
      } else if (error?.code === "PLAN_TOO_LOW") {
        toast.error("Upgrade to Pro to create a workspace.");
      } else if (error?.code === "ALREADY_HAS_WORKSPACE") {
        toast.error("You already have a workspace.");
      } else {
        toast.error(error?.message || "Failed to create workspace");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const benefits = [
    {
      icon: Users,
      label: "Invite team members",
      desc: planTier >= 3 ? "Unlimited" : "Up to 15",
    },
    {
      icon: Palette,
      label: "Custom branding",
      desc: "Logo, colors & identity",
    },
    {
      icon: Crown,
      label: "Full admin control",
      desc: "Manage roles & permissions",
    },
  ];

  return (
    <div className="settings-glass-card rounded-2xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
            isDark
              ? "bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
              : "bg-linear-to-br from-cyan-50 to-blue-50 border border-cyan-200"
          }`}
        >
          <Buildings className="w-8 h-8 text-cyan-500" />
        </div>
        <h3
          className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Create Your Workspace
        </h3>
        <p
          className={`text-sm max-w-md mx-auto ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          Set up your own workspace to collaborate with your team, customize
          branding, and manage everything from one place.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {benefits.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className={`rounded-xl p-4 text-center ${
              isDark
                ? "bg-white/5 border border-white/10"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <Icon
              className={`w-5 h-5 mx-auto mb-2 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
            />
            <p
              className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {label}
            </p>
            <p
              className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              {desc}
            </p>
          </div>
        ))}
      </div>

      {canCreate ? (
        /* -- Create Form (Pro/Enterprise) -- */
        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Workspace Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleSlugify(e.target.value)}
              placeholder="My Company"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                isDark
                  ? "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-500"
                  : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-cyan-500"
              } focus:outline-none focus:ring-1 focus:ring-cyan-500/30`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Workspace Slug
            </label>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}
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
                placeholder="my-company"
                className={`flex-1 px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-500"
                    : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-cyan-500"
                } focus:outline-none focus:ring-1 focus:ring-cyan-500/30`}
              />
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={isCreating || !name.trim() || !slug.trim()}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isCreating || !name.trim() || !slug.trim()
                ? "opacity-50 cursor-not-allowed bg-cyan-800 text-cyan-300"
                : "flex items-center gap-3 px-6 py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:pointer-events-none group"
            }`}
          >
            {isCreating ? (
              <>
                <CircleNotch className="w-4 h-4 animate-spin" />
                Creating workspace...
              </>
            ) : (
              <>
                <Buildings className="w-4 h-4" />
                Create Workspace
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      ) : (
        /* -- Upsell (Starter) -- */
        <div
          className={`rounded-xl p-6 text-center ${
            isDark
              ? "bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
              : "bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200"
          }`}
        >
          <Sparkle
            className={`w-6 h-6 mx-auto mb-3 ${isDark ? "text-amber-400" : "text-amber-600"}`}
          />
          <p
            className={`font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Upgrade to Pro to create a workspace
          </p>
          <p
            className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Workspaces require a Pro ($29/mo) or Enterprise ($99/mo) plan.
          </p>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-linear-to-br from-cyan-600 to-blue-700 text-white hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25 cursor-pointer"
          >
            <Crown className="w-4 h-4" />
            Upgrade Plan
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
