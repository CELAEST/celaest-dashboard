"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Palette, UploadSimple, FloppyDisk, ArrowCounterClockwise, CircleNotch } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("settings");

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
      toast.success(t("branding_saved"));
    } catch {
      toast.error(t("branding_save_error"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (readOnly) return;
    setBranding(defaultBranding);
    toast.info(t("branding_reset_toast"));
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
    { key: "brand_primary_color", label: t("brand_primary"), desc: t("brand_primary_desc") },
    {
      key: "brand_secondary_color",
      label: t("brand_secondary"),
      desc: t("brand_secondary_desc"),
    },
    { key: "brand_accent_color", label: t("brand_accent"), desc: t("brand_accent_desc") },
  ];

  return (
    <div className="settings-glass-card rounded-2xl p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors shrink-0 ${
              isDark
                ? "bg-white/[0.04] border-white/8 text-white/70"
                : "bg-gray-100 border-gray-200 text-gray-700"
            }`}
          >
            <Palette size={20} />
          </div>
          <div>
            <h3
              className={`text-base font-bold font-jakarta flex items-center gap-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("branding_settings")}
            </h3>
            <p
              className={`text-xs mt-0.5 font-mono ${
                isDark ? "text-white/40" : "text-gray-400"
              }`}
            >
              {t("branding_settings_desc")}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          {!readOnly && (
            <>
              <button
                onClick={handleReset}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isDark
                    ? "border-white/8 bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <ArrowCounterClockwise size={12} /> {t("reset_defaults")}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-neutral-200 active:scale-[0.98] transition-all cursor-pointer shadow-md font-jakarta uppercase tracking-wider"
              >
                {isSaving ? (
                  <CircleNotch size={12} className="animate-spin text-black" />
                ) : (
                  <FloppyDisk size={12} />
                )}
                {t("save_branding")}
              </button>
            </>
          )}
          {readOnly && (
            <span className="text-[10px] bg-white/[0.04] border border-white/8 text-white/50 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono ml-auto sm:ml-0">
              {t("view_only")}
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <CircleNotch className="w-6 h-6 animate-spin text-white/80" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Company Name */}
          <div>
            <label
              className={`block text-[10px] font-mono uppercase tracking-wider font-bold mb-2 ${
                isDark ? "text-white/40" : "text-gray-400"
              }`}
            >
              {t("display_name")}
            </label>
            <input
              type="text"
              value={branding.brand_company_name}
              onChange={(e) =>
                updateField("brand_company_name", e.target.value)
              }
              disabled={readOnly}
              placeholder={t("display_name_placeholder")}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all ${
                isDark
                  ? "bg-white/[0.03] border-white/8 text-zinc-100 placeholder:text-zinc-500 focus:border-white/20"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400"
              } outline-none ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
            />
          </div>

          {/* Color Pickers */}
          <div>
            <label
              className={`block text-[10px] font-mono uppercase tracking-wider font-bold mb-3 ${
                isDark ? "text-white/40" : "text-gray-400"
              }`}
            >
              {t("brand_colors")}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {colorFields.map(({ key, label, desc }) => (
                <div
                  key={key}
                  className={`p-4 rounded-xl border transition-all ${
                    isDark
                      ? "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12]"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="color"
                      value={branding[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                      disabled={readOnly}
                      className={`w-8 h-8 rounded-lg border-0 bg-transparent shrink-0 ${readOnly ? "cursor-not-allowed" : "cursor-pointer"}`}
                    />
                    <div>
                      <div
                        className={`text-xs font-bold font-mono ${
                          isDark ? "text-zinc-100" : "text-gray-900"
                        }`}
                      >
                        {label}
                      </div>
                      <div
                        className={`text-[10px] font-mono ${
                          isDark ? "text-white/40" : "text-gray-400"
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
                        ? "bg-white/[0.03] border-white/8 text-zinc-200"
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
              className={`block text-[10px] font-mono uppercase tracking-wider font-bold mb-2 ${
                isDark ? "text-white/40" : "text-gray-400"
              }`}
            >
              {t("color_preview")}
            </label>
            <div className="flex rounded-xl overflow-hidden h-8 border border-white/8">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-[10px] font-mono uppercase tracking-wider font-bold mb-2 ${
                  isDark ? "text-white/40" : "text-gray-400"
                }`}
              >
                <UploadSimple size={10} className="inline mr-1" />
                {t("logo_url")}
              </label>
              <input
                type="text"
                value={branding.brand_logo_url}
                onChange={(e) => updateField("brand_logo_url", e.target.value)}
                disabled={readOnly}
                placeholder={t("logo_url_placeholder")}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all ${
                  isDark
                    ? "bg-white/[0.03] border-white/8 text-zinc-100 placeholder:text-zinc-500 focus:border-white/20"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400"
                } outline-none ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
              />
              {branding.brand_logo_url && (
                <div
                  className={`mt-2 p-3 rounded-xl border ${
                    isDark
                      ? "bg-white/[0.02] border-white/[0.05]"
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
                className={`block text-[10px] font-mono uppercase tracking-wider font-bold mb-2 ${
                  isDark ? "text-white/40" : "text-gray-400"
                }`}
              >
                <UploadSimple size={10} className="inline mr-1" />
                {t("favicon_url")}
              </label>
              <input
                type="text"
                value={branding.brand_favicon_url}
                onChange={(e) =>
                  updateField("brand_favicon_url", e.target.value)
                }
                disabled={readOnly}
                placeholder={t("favicon_url_placeholder")}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all ${
                  isDark
                    ? "bg-white/[0.03] border-white/8 text-zinc-100 placeholder:text-zinc-500 focus:border-white/20"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400"
                } outline-none ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
