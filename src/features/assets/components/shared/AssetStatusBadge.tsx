import React from "react";
import { Asset } from "../../hooks/useAssets";

interface AssetStatusBadgeProps {
  status: Asset["status"];
  isDark: boolean;
  className?: string;
}

export const AssetStatusBadge: React.FC<AssetStatusBadgeProps> = ({
  status,
  isDark,
  className = "",
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return isDark
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          : "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "draft":
        return isDark
          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
          : "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "archived":
        return isDark
          ? "bg-gray-500/10 text-gray-400 border-gray-500/20"
          : "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border uppercase ${getStatusColor()} ${className}`}
    >
      {status}
    </span>
  );
};
