"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Palette, UploadSimple, FloppyDisk, ArrowCounterClockwise, CircleNotch } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

interface BrandingSettings {
  brand_primary_color: string;
  brand_secondary_color: string;
  brand_accent_color: string;
  brand_logo_url: string;
  brand_favicon_url: string;
  brand_company_name: string;
  [key: string]: string;
}

const defaultBranding: BrandingSettings = {
  brand_primary_color: "#6366f1",
  brand_secondary_color: "#8b5cf6",
  brand_accent_color: "#06b6d4",
  brand_logo_url: "",
  brand_favicon_url: "",
  brand_company_name: "",
};

interface WorkspaceBrandingProps {
  readOnly?: boolean;
}

export function WorkspaceBranding({
  readOnly = false,
}: WorkspaceBrandingProps) {
  const { isDark } = useTheme();
  const { currentOrg } = useOrgStore();
  const { session } = useAuthStore();
  const token = session?.accessToken;

  const [branding, setBranding] = useState<BrandingSettings>(defaultBranding);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token || !currentOrg?.id) return;
    setIsLoading(true);
    api
      .get<Record<string, unknown>>(
        `/api/v1/org/organizations/${currentOrg.id}/settings`,
        { token, orgId: currentOrg.id },
      )
      .then((settings) => {
        setBranding({
          brand_primary_color:
            (settings.brand_primary_color as string) ||
            defaultBranding.brand_primary_color,
          brand_secondary_color:
            (settings.brand_secondary_color as string) ||
            defaultBranding.brand_secondary_color,
          brand_accent_color:
            (settings.brand_accent_color as string) ||
            defaultBranding.brand_accent_color,
          brand_logo_url:
            (settings.brand_logo_url as string) ||
            defaultBranding.brand_logo_url,
          brand_favicon_url:
            (settings.brand_favicon_url as string) ||
            defaultBranding.brand_favicon_url,
          brand_company_name:
            (settings.brand_company_name as string) || currentOrg.name || "",
        });
      })
      .catch(() => {
        /* use defaults */
      })
      .finally(() => setIsLoading(false));
  }, [token, currentOrg?.id, currentOrg?.name]);

  const handleSave = async () => {
    if (readOnly) return;
    if (!token || !currentOrg?.id) return;
    setIsSaving(true);
    try {
      await api.put(
        `/api/v1/org/organizations/${currentOrg.id}/settings`,
        branding,
        { token, orgId: currentOrg.id },
      );
      toast.success("Branding settings saved!");
    } catch {
      toast.error("Failed to save branding settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (readOnly) return;
    setBranding(defaultBranding);
    toast.info("Branding reset to defaults");
  };

  const updateField = (key: keyof BrandingSettings, value: string) => {
    if (readOnly) return;
    setBranding((prev) => ({ ...prev, [key]: value }));
  };

  const colorFields: {
    key: keyof BrandingSettings;
    label: string;
    desc: string;
  }[] = [
    { key: "brand_primary_color", label: "Primary", desc: "Buttons & links" },
    {
      key: "brand_secondary_color",
      label: "Secondary",
      desc: "Accents & badges",
    },
    { key: "brand_accent_color", label: "Accent", desc: "Highlights & CTAs" },
  ];

  return (
    <div
      className={`rounded-2xl border p-6 transition-all duration-300 ${
        isDark
          ? "bg-black/40 backdrop-blur-xl border-white/10"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl ${
              isDark
                ? "bg-purple-500/10 text-purple-400"
                : "bg-purple-100 text-purple-600"
            }`}
          >
            <Palette size={20} />
          </div>
          <div>
            <h3
              className={`text-sm font-black uppercase tracking-wider ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Branding & White Label
            </h3>
            <p
              className={`text-xs mt-0.5 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Customize your organization&apos;s visual identity
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!readOnly && (
            <>
              <button
                onClick={handleReset}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  isDark
                    ? "text-gray-500 hover:text-white hover:bg-white/5"
                    : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ArrowCounterClockwise size={12} /> Reset
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${
                  isDark
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30"
                    : "bg-purple-600 text-white hover:bg-purple-500"
                }`}
              >
                {isSaving ? (
                  <CircleNotch size={12} className="animate-spin" />
                ) : (
                  <FloppyDisk size={12} />
                )}
                SAVE BRANDING
              </button>
            </>
          )}
          {readOnly && (
            <span className="text-[10px] bg-gray-500/10 text-gray-500 px-2 py-1 rounded uppercase tracking-wider font-black">
              View Only
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <CircleNotch className="w-6 h-6 animate-spin text-purple-500" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Company Name */}
          <div>
            <label
              className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Display Name
            </label>
            <input
              type="text"
              value={branding.brand_company_name}
              onChange={(e) =>
                updateField("brand_company_name", e.target.value)
              }
              disabled={readOnly}
              placeholder="Your Company Name"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all ${
                isDark
                  ? "bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-purple-500/50"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-400"
              } outline-none ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
            />
          </div>

          {/* Color Pickers */}
          <div>
            <label
              className={`block text-[10px] font-black uppercase tracking-widest mb-3 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Brand Colors
            </label>
            <div className="grid grid-cols-3 gap-4">
              {colorFields.map(({ key, label, desc }) => (
                <div
                  key={key}
                  className={`p-4 rounded-xl border transition-all ${
                    isDark
                      ? "bg-white/5 border-white/10"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="color"
                      value={branding[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                      disabled={readOnly}
                      className={`w-8 h-8 rounded-lg border-0 bg-transparent ${readOnly ? "cursor-not-allowed" : "cursor-pointer"}`}
                    />
                    <div>
                      <div
                        className={`text-xs font-bold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {label}
                      </div>
                      <div
                        className={`text-[10px] ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {desc}
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={branding[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                    disabled={readOnly}
                    className={`w-full px-3 py-1.5 rounded-lg border text-xs font-mono uppercase ${
                      isDark
                        ? "bg-black/40 border-white/10 text-gray-400"
                        : "bg-white border-gray-200 text-gray-600"
                    } outline-none ${readOnly ? "cursor-not-allowed" : ""}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Preview Strip */}
          <div>
            <label
              className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Color Preview
            </label>
            <div className="flex rounded-xl overflow-hidden h-8">
              <div
                className="flex-1 transition-colors"
                style={{ backgroundColor: branding.brand_primary_color }}
              />
              <div
                className="flex-1 transition-colors"
                style={{ backgroundColor: branding.brand_secondary_color }}
              />
              <div
                className="flex-1 transition-colors"
                style={{ backgroundColor: branding.brand_accent_color }}
              />
            </div>
          </div>

          {/* Logo URLs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                <UploadSimple size={10} className="inline mr-1" />
                Logo URL
              </label>
              <input
                type="text"
                value={branding.brand_logo_url}
                onChange={(e) => updateField("brand_logo_url", e.target.value)}
                disabled={readOnly}
                placeholder="https://your-cdn.com/logo.png"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-purple-500/50"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-400"
                } outline-none ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
              />
              {branding.brand_logo_url && (
                <div
                  className={`mt-2 p-3 rounded-lg border ${
                    isDark
                      ? "bg-white/5 border-white/10"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <Image
                    src={branding.brand_logo_url}
                    alt="Logo preview"
                    width={200}
                    height={40}
                    className="max-h-10 object-contain w-auto"
                    unoptimized
                  />
                </div>
              )}
            </div>
            <div>
              <label
                className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                <UploadSimple size={10} className="inline mr-1" />
                Favicon URL
              </label>
              <input
                type="text"
                value={branding.brand_favicon_url}
                onChange={(e) =>
                  updateField("brand_favicon_url", e.target.value)
                }
                disabled={readOnly}
                placeholder="https://your-cdn.com/favicon.ico"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-purple-500/50"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-400"
                } outline-none ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
