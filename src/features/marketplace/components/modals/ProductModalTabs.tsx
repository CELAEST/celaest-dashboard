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
    { id: "features" as const, label: t("features") },
    { id: "reviews" as const, label: t("reviews") },
  ];

  return (
    <div>
      <div
        className={`flex gap-1 p-1 rounded-xl ${
          theme === "dark" ? "bg-white/5" : "bg-gray-100"
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all
              ${
                activeTab === tab.id
                  ? theme === "dark"
                    ? "bg-white/10 text-white"
                    : "bg-white text-gray-900 shadow-sm"
                  : theme === "dark"
                    ? "text-gray-400 hover:text-white"
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
