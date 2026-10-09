import React from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { TabOverview } from "./product-tabs/TabOverview";
import { TabFeatures } from "./product-tabs/TabFeatures";
import { TabReviews } from "./product-tabs/TabReviews";
import { MarketplaceProduct } from "../../types";
import { useTranslations } from "next-intl";

export type ProductModalTabId = "overview" | "features" | "reviews";

interface ProductModalTabsProps {
  product: MarketplaceProduct;
  activeTab: ProductModalTabId;
  setActiveTab: (tab: ProductModalTabId) => void;
}

export const ProductModalTabs: React.FC<ProductModalTabsProps> = ({
  product,
  activeTab,
  setActiveTab,
}) => {
  const t = useTranslations("marketplace");
  const { theme } = useTheme();

  const tabs = [
    { id: "overview" as const, label: t("overview") },
    {
      id: "features" as const,
      label: `${t("features")}${product.features && product.features.length > 0 ? ` (${product.features.length})` : ""}`,
    },
    {
      id: "reviews" as const,
      label: `${t("reviews")}${product.rating_count ? ` (${product.rating_count})` : ""}`,
    },
  ];

  return (
    <div>
      <div
        className={`flex items-center gap-1 p-1 rounded-xl border ${
          theme === "dark"
            ? "bg-[#0D0D11] border-white/[0.06]"
            : "bg-gray-100 border-gray-200"
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer
              ${
                activeTab === tab.id
                  ? theme === "dark"
                    ? "bg-white text-black shadow-md shadow-black/40"
                    : "bg-white text-gray-900 shadow-sm"
                  : theme === "dark"
                    ? "text-white/50 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <TabOverview
            description={product.description}
            stack={product.technical_stack}
            tags={product.tags}
          />
        )}

        {activeTab === "features" && (
          <TabFeatures features={product.features} />
        )}

        {activeTab === "reviews" && <TabReviews productId={product.id} />}
      </div>
    </div>
  );
};
