"use client";

import React from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { TabOverview } from "./product-tabs/TabOverview";
import { TabFeatures } from "./product-tabs/TabFeatures";
import { TabCompatibility } from "./product-tabs/TabCompatibility";
import { TabReviews } from "./product-tabs/TabReviews";

interface Product {
  id: number;
  description: string;
  stack?: string[];
  tags?: string[];
  features: string[];
}

interface ProductModalTabsProps {
  product: Product;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ProductModalTabs: React.FC<ProductModalTabsProps> = ({
  product,
  activeTab,
  setActiveTab,
}) => {
  const { theme } = useTheme();

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "features", label: "Features" },
    { id: "compatibility", label: "Compatibilidad" },
    { id: "reviews", label: "Reviews" },
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
            stack={product.stack}
            tags={product.tags}
          />
        )}

        {activeTab === "features" && (
          <TabFeatures features={product.features} />
        )}

        {activeTab === "compatibility" && <TabCompatibility />}

        {activeTab === "reviews" && <TabReviews />}
      </div>
    </div>
  );
};
