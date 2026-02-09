import React from "react";
import { useFormContext } from "react-hook-form";
import { FileSpreadsheet, Code, Globe } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { SettingsSelect } from "../../settings/components/SettingsSelect";
import { AssetFormValues } from "../hooks/useAssetForm";
import { AssetImageUploader } from "./AssetImageUploader";

const CATEGORY_OPTIONS = [
  { value: "Finance", label: "Finance" },
  { value: "Automation", label: "Automation" },
  { value: "Operations", label: "Operations" },
  { value: "Sales", label: "Sales" },
  { value: "Marketing", label: "Marketing" },
  { value: "Analytics", label: "Analytics" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft (Hidden from marketplace)" },
  { value: "active", label: "Active (Visible to customers)" },
  { value: "archived", label: "Archived (Legacy version)" },
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

  const selectedType = watch("type");
  const watchExternalUrl = watch("external_url");
  const watchThumbnailUrl = watch("thumbnail_url");

  // Use watchExternalUrl in a subtle way to avoid unused warning if needed,
  // or just ensure uploader logic stays intact.
  const hasExternalUrl = !!watchExternalUrl;

  return (
    <div className="space-y-8">
      {/* Asset Type */}
      <div>
        <label
          className={`block text-xs uppercase tracking-wider font-bold mb-3 ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Asset Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              value: "excel",
              label: "Excel Macro",
              icon: FileSpreadsheet,
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
                      ? "bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/10"
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
              isDark ? "text-gray-500" : "text-gray-400"
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
                ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/30 focus:bg-white/10"
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
            value={watch("category")}
            onChange={(val) => setValue("category", val)}
            options={CATEGORY_OPTIONS}
            placeholder="Select category"
          />
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      {/* External URL */}
      <div>
        <label
          htmlFor="external_url"
          className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
            isDark ? "text-gray-500" : "text-gray-400"
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
                ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/30 focus:bg-white/10"
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
      </div>

      {/* Product Image / Thumbnail */}
      <div className="space-y-4">
        <label
          className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
            isDark ? "text-gray-500" : "text-gray-400"
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
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label
            htmlFor="price"
            className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Sale Price *
          </label>
          <div className="relative">
            <span
              className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium ${
                isDark ? "text-gray-500" : "text-gray-400"
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
                  ? "bg-white/5 border-white/10 text-white focus:border-cyan-500/30 focus:bg-white/10"
                  : "bg-white border-gray-200 text-gray-900 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              } ${errors.price ? "border-red-500" : ""}`}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="operationalCost"
            className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Operational Cost
          </label>
          <div className="relative">
            <span
              className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              $
            </span>
            <input
              id="operationalCost"
              type="number"
              step="0.01"
              {...register("operationalCost", { valueAsNumber: true })}
              className={`w-full pl-8 pr-4 py-3 rounded-lg border transition-all outline-none ${
                isDark
                  ? "bg-white/5 border-white/10 text-white focus:border-cyan-500/30 focus:bg-white/10"
                  : "bg-white border-gray-200 text-gray-900 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              } ${errors.operationalCost ? "border-red-500" : ""}`}
            />
          </div>
        </div>
        <div>
          <label
            className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Net Margin
          </label>
          <div
            className={`px-4 py-3.5 rounded-lg border flex items-center ${
              isDark
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            <div className="font-bold">
              ${(watch("price") - watch("operationalCost")).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div>
        <SettingsSelect
          label="Publish Status"
          value={watch("status")}
          onChange={(val) =>
            setValue("status", val as "active" | "draft" | "archived")
          }
          options={STATUS_OPTIONS}
        />
      </div>

      {/* Details */}
      <div>
        <label
          htmlFor="description"
          className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
            isDark ? "text-gray-500" : "text-gray-400"
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
              ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/30 focus:bg-white/10"
              : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          }`}
        />
      </div>

      {/* Features - New Field */}
      <div>
        <label
          htmlFor="features"
          className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
            isDark ? "text-gray-500" : "text-gray-400"
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
              ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/30 focus:bg-white/10"
              : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          }`}
        />
      </div>

      <div>
        <label
          htmlFor="requirements"
          className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
            isDark ? "text-gray-500" : "text-gray-400"
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
              ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/30 focus:bg-white/10"
              : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          }`}
        />
      </div>
    </div>
  );
};
