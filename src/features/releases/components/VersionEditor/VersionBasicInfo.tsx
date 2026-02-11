import React, { memo } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { SettingsSelect } from "@/features/settings/components/SettingsSelect";
import { Version } from "../../types";

interface VersionBasicInfoProps {
  formData: {
    productId: string;
    assetName: string;
    versionNumber: string;
    status: Version["status"];
    compatibility: string;
  };
  assets?: { id: string; name: string }[];
  isEdit: boolean;
  onChange: (field: string, value: string) => void;
  autoFocusRef?: React.RefObject<HTMLInputElement | null>;
}

export const VersionBasicInfo: React.FC<VersionBasicInfoProps> = memo(
  ({ formData, assets, isEdit, onChange, autoFocusRef }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const assetOptions =
      assets?.map((a) => ({ value: a.id, label: a.name })) || [];

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            {!isEdit && assets && assets.length > 0 ? (
              <SettingsSelect
                label="Target Asset *"
                value={formData.productId}
                onChange={(val) => {
                  const asset = assets.find((a) => a.id === val);
                  onChange("productId", val);
                  if (asset) onChange("assetName", asset.name);
                }}
                options={assetOptions}
              />
            ) : (
              <>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Asset Name *
                </label>
                <input
                  ref={autoFocusRef}
                  type="text"
                  value={formData.assetName}
                  onChange={(e) => onChange("assetName", e.target.value)}
                  readOnly={isEdit}
                  required
                  placeholder="e.g., Advanced Financial Dashboard"
                  className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                    isEdit ? "opacity-60 cursor-not-allowed " : ""
                  } ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/30 focus:bg-white/10"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  }`}
                />
              </>
            )}
          </div>

          <div>
            <label
              className={`block text-sm font-semibold mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Version Number *
            </label>
            <input
              type="text"
              value={formData.versionNumber}
              onChange={(e) => onChange("versionNumber", e.target.value)}
              required
              placeholder="e.g., v2.1.0"
              className={`w-full px-4 py-3 rounded-xl border font-mono transition-colors ${
                isDark
                  ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/30 focus:bg-white/10"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <SettingsSelect
              label="Release Status"
              value={formData.status}
              onChange={(val) => onChange("status", val)}
              options={[
                { value: "beta", label: "Beta (Early access testing)" },
                { value: "stable", label: "Stable (Production ready)" },
                {
                  value: "deprecated",
                  label: "Deprecated (Legacy support only)",
                },
              ]}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-semibold mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Compatibility
            </label>
            <input
              type="text"
              value={formData.compatibility}
              onChange={(e) => onChange("compatibility", e.target.value)}
              placeholder="e.g., Excel 2016+ or Python 3.8+"
              className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                isDark
                  ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/30 focus:bg-white/10"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
            />
          </div>
        </div>
      </div>
    );
  },
);

VersionBasicInfo.displayName = "VersionBasicInfo";
