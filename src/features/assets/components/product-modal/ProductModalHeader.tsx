import React from "react";
import { X } from "lucide-react";
import { Asset } from "../../hooks/useAssets";
import { AssetTypeIcon } from "../shared/AssetTypeIcon";
import { getAssetTypeLabel } from "../../utils/assetUtils";

interface ProductModalHeaderProps {
  product: Asset;
  isDark: boolean;
  onClose: () => void;
}

export const ProductModalHeader: React.FC<ProductModalHeaderProps> = ({
  product,
  isDark,
  onClose,
}) => {
  return (
    <div className="relative h-64 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${product.thumbnail})` }}
      />
      <div
        className={`absolute inset-0 bg-linear-to-t ${
          isDark ? "from-gray-900 to-transparent" : "from-white to-transparent"
        }`}
      />

      <button
        onClick={onClose}
        className={`absolute top-6 right-6 p-2 rounded-lg backdrop-blur-md transition-colors ${
          isDark
            ? "bg-black/60 hover:bg-black/80 text-white border border-white/20"
            : "bg-white/90 hover:bg-white text-gray-900 border border-gray-200"
        }`}
      >
        <X size={24} />
      </button>

      {/* Type Badge */}
      <div className="absolute top-6 left-6">
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md ${
            isDark
              ? "bg-black/60 border border-white/20"
              : "bg-white/90 border border-gray-200"
          }`}
        >
          <AssetTypeIcon type={product.type} size={24} />
          <span
            className={`text-sm font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {getAssetTypeLabel(product.type)}
          </span>
        </div>
      </div>
    </div>
  );
};
