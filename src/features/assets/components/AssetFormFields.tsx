import React from "react";
import { useFormContext } from "react-hook-form";
import { FileCsv, Code, Globe, GithubLogo } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { SettingsSelect } from "../../settings/components/SettingsSelect";
import { AssetFormValues } from "../hooks/useAssetForm";
import { AssetImageUploader } from "./AssetImageUploader";
import { useCategories } from "../hooks/useCategories";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft (Hidden from marketplace)" },
  { value: "published", label: "Published (Visible in marketplace)" },
  { value: "archived", label: "Archived (No longer available)" },
];

interface AssetFormFieldsProps {
  isUploading?: boolean;
  uploadProgress?: number;
}

export const AssetFormFields: React.FC<AssetFormFieldsProps> = ({
  isUploading = false,
  uploadProgress = 0,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<AssetFormValues>();

  const { categories, isLoading: isLoadingCategories } = useCategories();
  const selectedType = watch("type");
  const watchExternalUrl = watch("external_url");
  const watchThumbnailUrl = watch("thumbnail_url");
  const watchCategoryId = watch("category_id");

  const categoryOptions = React.useMemo(() => {
    return categories.map((c) => ({
      value: c.id,
      label: c.name,
    }));
  }, [categories]);

  // Use watchExternalUrl in a subtle way to avoid unused warning if needed,
  // or just ensure uploader logic stays intact.
  const hasExternalUrl = !!watchExternalUrl;

  return (
    <div className="space-y-8">
      {/* Asset TextT */}
      <div>
        <label
          className={`block text-xs uppercase tracking-wider font-bold mb-3 ${
            isDark ? "text-gray-300" : "text-gray-400"
          }`}
        >
          Asset TextT
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              value: "excel",
              label: "Excel Macro",
              icon: FileCsv,
            },
            { value: "script", label: "Script/Code", icon: Code },
            { value: "google-sheet", label: "Google Sheet", icon: Globe },
          ].map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() =>
                  setValue(
                    "type",
                    type.value as "excel" | "script" | "google-sheet",
                  )
                }
                className={`p-4 rounded-xl border transition-all relative overflow-hidden group ${
                  isSelected
                    ? isDark
                      ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                      : "bg-blue-50 border-blue-500 text-blue-700 shadow-md"
                    : isDark
                      ? "bg-white/8 border-white/13 text-gray-400 hover:border-white/20 hover:bg-white/12"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <Icon
                    size={24}
                    className={`transition-colors ${
                      isSelected
                        ? "opacity-100"
                        : "opacity-50 group-hover:opacity-100"
                    }`}
                  />
                  <div className="text-xs font-bold">{type.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
              isDark ? "text-gray-300" : "text-gray-400"
            }`}
          >
            Asset Name *
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
              isDark
                ? "bg-white/8 border-white/13 text-white placeholder-gray-400 focus:border-cyan-500/30 focus:bg-white/12"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            } ${errors.name ? "border-red-500" : ""}`}
            placeholder="e.g., Advanced Financial Dashboard"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <SettingsSelect
            label="Category *"
            value={watchCategoryId}
            onChange={(val) => setValue("category_id", val)}
            options={categoryOptions}
            placeholder={isLoadingCategories ? "Loading..." : "Select category"}
            disabled={isLoadingCategories}
          />
          {errors.category_id && (
            <p className="text-red-500 text-xs mt-1">
              {errors.category_id.message}
            </p>
          )}
        </div>
      </div>

      {/* External URL */}
      <div>
        <label
          htmlFor="external_url"
          className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
            isDark ? "text-gray-300" : "text-gray-400"
          }`}
        >
          Automation / External Link (Optional)
        </label>
        <div className="relative">
          <Globe
            size={18}
            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
              hasExternalUrl
                ? "text-cyan-500"
                : isDark
                  ? "text-gray-500"
                  : "text-gray-400"
            }`}
          />
          <input
            id="external_url"
            type="text"
            {...register("external_url")}
            className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all outline-none ${
              isDark
                ? "bg-white/8 border-white/13 text-white placeholder-gray-400 focus:border-cyan-500/30 focus:bg-white/12"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            } ${errors.external_url ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]" : ""}`}
            placeholder="e.g., https://docs.google.com/spreadsheets/d/..."
          />
        </div>
        {errors.external_url && (
          <p className="text-red-500 text-xs mt-1 font-medium">
            {errors.external_url.message}
          </p>
        )}
        <p
          className={`text-[10px] mt-2 ml-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}
        >
          If this is a Google Sheet or external web tool, provide the direct
          link here.
        </p>

        {/* GitHub Repository */}
        <div>
          <label
            htmlFor="github_repository"
            className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
              isDark ? "text-gray-300" : "text-gray-400"
            }`}
          >
            GitHub Repository (Private Distribution)
          </label>
          <div className="relative">
            <GithubLogo
              size={18}
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                watch("github_repository")
                  ? "text-cyan-500"
                  : isDark
                    ? "text-gray-500"
                    : "text-gray-400"
              }`}
            />
            <input
              id="github_repository"
              type="text"
              {...register("github_repository")}
              className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all outline-none ${
                isDark
                  ? "bg-white/8 border-white/13 text-white placeholder-gray-400 focus:border-cyan-500/30 focus:bg-white/12"
                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              }`}
              placeholder="e.g. owner/repo"
            />
          </div>
          <p
            className={`text-[10px] mt-2 ml-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}
          >
            Format: owner/repo. Used for secure release distribution via GitHub
            API.
          </p>
        </div>
      </div>

      {/* Product Image / Thumbnail */}
      <div className="space-y-4">
        <label
          className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
            isDark ? "text-gray-300" : "text-gray-400"
          }`}
        >
          Product Thumbnail / Image
        </label>
        <AssetImageUploader
          url={watchThumbnailUrl}
          file={watch("pending_image")}
          onFileChange={(file) => setValue("pending_image", file)}
          onUrlChange={(url) => setValue("thumbnail_url", url)}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          isDark={isDark}
        />
        <p
          className={`text-[10px] ml-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}
        >
          This image will be displayed in the Marketplace and your inventory
          list.
        </p>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="price"
            className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
              isDark ? "text-gray-300" : "text-gray-400"
            }`}
          >
            Sale Price *
          </label>
          <div className="relative">
            <span
              className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium ${
                isDark ? "text-gray-300" : "text-gray-400"
              }`}
            >
              $
            </span>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className={`w-full pl-8 pr-4 py-3 rounded-lg border transition-all outline-none ${
                isDark
                  ? "bg-white/8 border-white/13 text-white focus:border-cyan-500/30 focus:bg-white/12"
                  : "bg-white border-gray-200 text-gray-900 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              } ${errors.price ? "border-red-500" : ""}`}
            />
          </div>
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="currency"
            className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
              isDark ? "text-gray-300" : "text-gray-400"
            }`}
          >
            Currency
          </label>
          <input
            id="currency"
            type="text"
            defaultValue="USD"
            disabled
            className={`w-full px-4 py-3 rounded-lg border transition-all outline-none opacity-50 cursor-not-allowed ${
              isDark
                ? "bg-white/5 border-white/8 text-gray-400"
                : "bg-gray-100 border-gray-200 text-gray-500"
            }`}
          />
        </div>
      </div>

      {/* Status & Visibility */}
      <div className="space-y-4">
        <SettingsSelect
          label="Publish Status"
          value={watch("status")}
          onChange={(val) =>
            setValue("status", val as "draft" | "published" | "archived")
          }
          options={STATUS_OPTIONS}
        />

        {/* Marketplace Visibility Toggle */}
        <div
          className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
            watch("is_public")
              ? isDark
                ? "bg-cyan-500/10 border-cyan-500/30"
                : "bg-blue-50 border-blue-300"
              : isDark
                ? "bg-white/8 border-white/13"
                : "bg-gray-50 border-gray-200"
          }`}
        >
          <div>
            <p
              className={`text-sm font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Marketplace Visibility
            </p>
            <p
              className={`text-xs mt-0.5 ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              {watch("is_public")
                ? "This product is visible in the public marketplace"
                : "This product is only visible to your organization"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setValue("is_public", !watch("is_public"))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              watch("is_public")
                ? isDark
                  ? "bg-cyan-500"
                  : "bg-blue-600"
                : isDark
                  ? "bg-white/20"
                  : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                watch("is_public") ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Details */}
      <div>
        <label
          htmlFor="description"
          className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
            isDark ? "text-gray-300" : "text-gray-400"
          }`}
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={4}
          placeholder="Detailed description of the asset, features, and use cases..."
          className={`w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none ${
            isDark
              ? "bg-white/8 border-white/13 text-white placeholder-gray-400 focus:border-cyan-500/30 focus:bg-white/12"
              : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          }`}
        />
      </div>

      {/* Features - New Field */}
      <div>
        <label
          htmlFor="features"
          className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
            isDark ? "text-gray-300" : "text-gray-400"
          }`}
        >
          Key Features (One per line)
        </label>
        <textarea
          id="features"
          {...register("features")}
          rows={4}
          placeholder="Automated reporting&#10;Multi-currency support&#10;Budget vs Actual..."
          className={`w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none ${
            isDark
              ? "bg-white/8 border-white/13 text-white placeholder-gray-400 focus:border-cyan-500/30 focus:bg-white/12"
              : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          }`}
        />
      </div>

      <div>
        <label
          htmlFor="requirements"
          className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
            isDark ? "text-gray-300" : "text-gray-400"
          }`}
        >
          Technical Requirements (One per line)
        </label>
        <textarea
          id="requirements"
          {...register("requirements")}
          rows={3}
          placeholder="Excel 2016 or higher&#10;Windows 10+&#10;Macros enabled..."
          className={`w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none ${
            isDark
              ? "bg-white/8 border-white/13 text-white placeholder-gray-400 focus:border-cyan-500/30 focus:bg-white/12"
              : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          }`}
        />
      </div>

      {/* Tags & Tech Stack */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="tags"
            className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
              isDark ? "text-gray-300" : "text-gray-400"
            }`}
          >
            MagnifyingGlass Tags (One per line)
          </label>
          <textarea
            id="tags"
            {...register("tags")}
            rows={3}
            placeholder="Finanzas&#10;Excel&#10;Automatización..."
            className={`w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none ${
              isDark
                ? "bg-white/8 border-white/13 text-white placeholder-gray-400 focus:border-cyan-500/30 focus:bg-white/12"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            }`}
          />
        </div>
        <div>
          <label
            htmlFor="technical_stack"
            className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
              isDark ? "text-gray-300" : "text-gray-400"
            }`}
          >
            Technical Stack (One per line)
          </label>
          <textarea
            id="technical_stack"
            {...register("technical_stack")}
            rows={3}
            placeholder="VBA&#10;TypeScript&#10;PostgreSQL..."
            className={`w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none ${
              isDark
                ? "bg-white/8 border-white/13 text-white placeholder-gray-400 focus:border-cyan-500/30 focus:bg-white/12"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            }`}
          />
        </div>
      </div>

      {/* Minimum Plan Tier */}
      <div>
        <label
          className={`block text-xs uppercase tracking-wider font-bold mb-3 ${
            isDark ? "text-gray-300" : "text-gray-500"
          }`}
        >
          Minimum Required Plan Tier
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {(
            [
              { value: 0, label: "Free", sub: "All users" },
              { value: 1, label: "Basic", sub: "Tier 1" },
              { value: 2, label: "Pro", sub: "Tier 2" },
              { value: 3, label: "Enterprise", sub: "Tier 3" },
              { value: 4, label: "Private", sub: "Restricted" },
            ] as const
          ).map((tier) => {
            const selected = watch("min_plan_tier") === tier.value;
            return (
              <button
                key={tier.value}
                type="button"
                onClick={() => setValue("min_plan_tier", tier.value)}
                className={`flex flex-col items-center gap-0.5 py-2.5 px-1 rounded-lg border text-center transition-all duration-150 cursor-pointer ${
                  selected
                    ? isDark
                      ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
                      : "bg-cyan-50 border-cyan-400 text-cyan-700"
                    : isDark
                      ? "bg-white/4 border-white/8 text-gray-400 hover:border-white/15 hover:text-gray-200"
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <span className={`text-[11px] font-bold leading-none ${selected ? "" : ""}`}>
                  {tier.label}
                </span>
                <span className={`text-[9px] leading-none mt-0.5 ${
                  selected
                    ? isDark ? "text-cyan-400/70" : "text-cyan-500/80"
                    : isDark ? "text-gray-600" : "text-gray-400"
                }`}>
                  {tier.sub}
                </span>
              </button>
            );
          })}
        </div>
        <input type="hidden" {...register("min_plan_tier", { valueAsNumber: true })} />
      </div>
    </div>
  );
};
