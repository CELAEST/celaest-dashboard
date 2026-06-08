import React, { memo, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Globe, Image as ImageIcon, Palette, CircleNotch } from "@phosphor-icons/react";
import NextImage from "next/image";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  WorkspaceProfileFormData,
  workspaceProfileSchema,
} from "@/lib/validation/schemas/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { settingsApi } from "../../../api/settings.api";
import { organizationsApi } from "@/features/organizations/api/organizations.api";
import { useTranslations } from "next-intl";

interface WorkspaceProfileProps {
  readOnly?: boolean;
}

export const WorkspaceProfile: React.FC<WorkspaceProfileProps> = memo(
  ({ readOnly = false }) => {
    const { isDark } = useTheme();
    const { currentOrg: org, fetchOrgs } = useOrgStore();
    const { session } = useAuthStore();
    const t = useTranslations("settings");
    const [isFetchingSettings, setIsFetchingSettings] = useState(false);
    const colorPickerRef = React.useRef<HTMLInputElement>(null);

    const form = useForm<WorkspaceProfileFormData>({
      resolver: zodResolver(workspaceProfileSchema),
      defaultValues: {
        workspaceName: org?.name || "",
        slug: org?.slug || "",
        logoUrl: "",
        primaryColor: "",
      },
      mode: "onBlur",
    });

    const { isSubmitting, errors } = form.formState;
    const { reset, watch } = form;

    const currentLogoUrl = watch("logoUrl");
    const currentPrimaryColor = watch("primaryColor") || "#0ea5e9"; // default cyan-500

    // Sync basic org data and fetch extended settings
    useEffect(() => {
      let mounted = true;

      const loadSettings = async () => {
        if (!org?.id || !session?.accessToken) return;

        setIsFetchingSettings(true);
        try {
          const settingsResponse = await organizationsApi.getSettings(
            session.accessToken,
            org.id,
          );
          const settings = (settingsResponse as Record<string, string>) || {};

          if (mounted) {
            reset({
              workspaceName: org.name,
              slug: org.slug,
              logoUrl: settings.logo_url || "",
              primaryColor: settings.primary_color || "",
            });
          }
        } catch {
          // Fallback if settings fail
          if (mounted) {
            reset({
              workspaceName: org.name,
              slug: org.slug,
              logoUrl: "",
              primaryColor: "",
            });
          }
        } finally {
          if (mounted) setIsFetchingSettings(false);
        }
      };

      if (org) {
        loadSettings();
      }

      return () => {
        mounted = false;
      };
    }, [org, session, reset]);

    const onSubmit = async (data: WorkspaceProfileFormData) => {
      if (readOnly) return;
      if (!org?.id || !session?.accessToken) return;
      try {
        // 1. Update basic org info (name, slug)
        await settingsApi.updateOrganization(
          org.id,
          {
            name: data.workspaceName,
            slug: data.slug,
          },
          session.accessToken,
        );

        // 2. Update extended org settings (logo, theme)
        await organizationsApi.updateSettings(session.accessToken, org.id, {
          logo_url: data.logoUrl || null,
          primary_color: data.primaryColor || null,
        } as Record<string, unknown>);

        await fetchOrgs(session.accessToken, true);
        toast.success(t("workspace_updated"));
      } catch {
        toast.error(t("workspace_update_error"));
      }
    };

    return (
      <div
        className={`settings-glass-card rounded-2xl p-6 transition-all ${readOnly ? "opacity-90" : ""}`}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3
              className={`text-lg font-bold flex items-center gap-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <Globe className="w-5 h-5 text-cyan-500" />
              {t("workspace_profile")}
              {readOnly && (
                <span className="text-[10px] bg-gray-500/10 text-gray-500 px-2 py-0.5 rounded uppercase tracking-wider font-black">
                  {t("view_only")}
                </span>
              )}
            </h3>
            <p
              className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              {t("workspace_profile_desc")}
            </p>
          </div>
          {isFetchingSettings && (
            <CircleNotch className="w-5 h-5 animate-spin text-cyan-500" />
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Section: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="workspaceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("workspace_name")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("my_workspace")}
                        className="h-[42px] rounded-xl"
                        {...field}
                        disabled={readOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <label
                  className={`text-xs uppercase tracking-wider mb-2 block font-bold ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {t("workspace_url")}
                </label>
                <div className="flex">
                  <span
                    className={`flex items-center px-4 rounded-l-xl border-y border-l text-sm transition-colors ${
                      isDark
                        ? "bg-white/5 border-white/10 text-gray-500"
                        : "bg-gray-50 border-gray-200 text-gray-400"
                    } ${errors.slug ? (isDark ? "border-red-500/50" : "border-red-400") : ""}`}
                  >
                    celaest.io/
                  </span>
                  <Controller
                    control={form.control}
                    name="slug"
                    render={({ field, fieldState: { error } }) => (
                      <input
                        {...field}
                        type="text"
                        disabled={readOnly}
                        className={`
                        settings-input w-full rounded-r-xl px-4 py-2.5 border-y border-r text-sm
                        focus:outline-none focus:ring-2 focus:ring-opacity-50
                        ${
                          error
                            ? isDark
                              ? "border-red-500/50 focus:ring-red-500/30 bg-red-500/5"
                              : "border-red-400 focus:ring-red-500/30 bg-red-50"
                            : isDark
                              ? "border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                              : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50"
                        }
                      `}
                        placeholder="slug"
                      />
                    )}
                  />
                </div>
                {errors.slug && (
                  <p
                    className={`mt-1 text-xs font-medium ${
                      isDark ? "text-red-400" : "text-red-500"
                    }`}
                  >
                    {errors.slug.message}
                  </p>
                )}
              </div>
            </div>

            <div
              className={`h-px w-full ${isDark ? "bg-white/5" : "bg-black/5"}`}
            />

            {/* Section: Branding */}
            <div>
              <h4
                className={`text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                <ImageIcon size={14} /> {t("brand_identity")}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("brand_logo_url")}</FormLabel>
                      <div className="flex gap-4 items-start">
                        <div
                          className={`w-12 h-12 rounded-xl border shrink-0 overflow-hidden flex items-center justify-center ${isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"}`}
                        >
                          {currentLogoUrl && !errors.logoUrl ? (
                            <NextImage
                              src={currentLogoUrl}
                              alt="Logo Preview"
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                              unoptimized
                            />
                          ) : (
                            <Globe
                              size={20}
                              className={
                                isDark ? "text-gray-600" : "text-gray-400"
                              }
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="https://example.com/logo.png"
                              className="h-[42px] rounded-xl"
                              {...field}
                              disabled={readOnly}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("primary_action_color")}</FormLabel>
                      <div className="flex gap-4 items-start">
                        <input
                          type="color"
                          ref={colorPickerRef}
                          value={field.value || "#0ea5e9"}
                          onChange={(e) => field.onChange(e.target.value)}
                          disabled={readOnly}
                          className="sr-only hidden"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!readOnly) colorPickerRef.current?.click();
                          }}
                          disabled={readOnly}
                          className={`w-12 h-12 rounded-xl border shrink-0 flex items-center justify-center shadow-inner transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                            isDark ? "border-white/10" : "border-gray-200"
                          } ${readOnly ? "cursor-not-allowed opacity-50" : ""}`}
                          style={{ backgroundColor: currentPrimaryColor }}
                          title={t("choose_color")}
                        >
                          <Palette
                            size={20}
                            className="text-white mix-blend-difference opacity-70"
                          />
                        </button>
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="#0ea5e9"
                              className="h-[42px] rounded-xl"
                              {...field}
                              disabled={readOnly}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {!readOnly && (
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || isFetchingSettings}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <CircleNotch size={16} className="animate-spin" /> {t("saving")}
                    </>
                  ) : (
                    t("save_configuration")
                  )}
                </button>
              </div>
            )}
          </form>
        </Form>
      </div>
    );
  },
);

WorkspaceProfile.displayName = "WorkspaceProfile";
