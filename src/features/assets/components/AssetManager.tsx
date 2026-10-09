import React, { useState, useCallback, useRef } from "react";
import { User, Crown, SquaresFour, List, FolderOpen, Timer, Plus, Package, MagnifyingGlass } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useRole } from "@/features/auth/hooks/useAuthorization";
import { AssetAdminPortal } from "./AssetAdminPortal";
import { AssetCustomerCatalog } from "./AssetCustomerCatalog";
import { useAssets } from "../hooks/useAssets";
import { useCategories } from "../hooks/useCategories";
import { useTranslations } from "next-intl";

export const AssetManager: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { isAdmin } = useRole();
  const t = useTranslations("marketplace");
  const [viewMode, setViewMode] = useState<"admin" | "customer">("admin");
  const [adminTab, setAdminTab] = useState<
    "inventory" | "categories" | "analytics"
  >("inventory");
  const [analyticsPeriod, setAnalyticsPeriod] = useState("month");

  // Search & Category Filters (lifted to header)
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const { categories } = useCategories(true);

  const { activeAssets } = useAssets();

  // Clients always see customer view
  const effectiveView = isAdmin ? viewMode : "customer";

  const createFnRef = useRef<(() => void) | null>(null);
  const handleCreateRef = useCallback((fn: () => void) => {
    createFnRef.current = fn;
  }, []);

  const categoryCreateFnRef = useRef<(() => void) | null>(null);
  const handleCategoryCreateRef = useCallback((fn: () => void) => {
    categoryCreateFnRef.current = fn;
  }, []);

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      {/* Sleek luxury header — matching Orders, Licensing Hub, Invoices */}
      <header
        className={`shrink-0 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b backdrop-blur-xl transition-colors duration-200 ${
          isDark
            ? "bg-[#09090b]/80 border-white/6"
            : "bg-white/80 border-gray-200/80"
        }`}
      >
        {/* Left: Icon, Title, Subtitle */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
              isDark
                ? "bg-white/[0.04] border-white/8 text-white/70"
                : "bg-gray-100 border-gray-200 text-gray-700"
            }`}
          >
            <Package size={16} />
          </div>
          <div>
            <h1
              className={`text-sm sm:text-base font-semibold tracking-tight ${
                isDark ? "text-zinc-100" : "text-gray-900"
              }`}
            >
              {effectiveView === "admin"
                ? t("asset_manager")
                : t("product_catalog_title")}
            </h1>
            <p
              className={`text-[10px] sm:text-[11px] font-mono tracking-wider uppercase ${
                isDark ? "text-white/40" : "text-gray-400"
              }`}
            >
              {effectiveView === "admin"
                ? t("inventory_versioning")
                : t("browse_available_products")}
            </p>
          </div>
        </div>

        {/* Right: Actions, Tabs, Switchers */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Customer View: Category Filters & Search */}
          {effectiveView === "customer" && (
            <>
              {categories.length > 0 && (
                <div
                  className={`inline-flex items-center p-0.5 rounded-lg border max-w-xs sm:max-w-sm md:max-w-md overflow-x-auto custom-scrollbar ${
                    isDark
                      ? "bg-white/[0.02] border-white/8"
                      : "bg-gray-100 border-gray-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className={`flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      filter === "all"
                        ? isDark
                          ? "bg-white/10 text-white shadow-xs font-semibold"
                          : "bg-white text-gray-900 shadow-xs font-semibold"
                        : isDark
                          ? "text-white/40 hover:text-white/80 font-medium"
                          : "text-gray-500 hover:text-gray-900 font-medium"
                    }`}
                  >
                    <span>{t("all_categories")}</span>
                  </button>
                  {categories.map((cat) => {
                    const isSelected = filter === cat.id || filter === cat.name;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFilter(cat.id)}
                        className={`flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? isDark
                              ? "bg-white/10 text-white shadow-xs font-semibold"
                              : "bg-white text-gray-900 shadow-xs font-semibold"
                            : isDark
                              ? "text-white/40 hover:text-white/80 font-medium"
                              : "text-gray-500 hover:text-gray-900 font-medium"
                        }`}
                      >
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Integrated Search Input */}
              <div className="relative w-36 sm:w-48">
                <MagnifyingGlass
                  size={12}
                  className={`absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                    isDark ? "text-white/30" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder={t("search_assets")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-7 pr-2.5 py-1 rounded-lg text-[11px] font-mono border outline-none transition-colors ${
                    isDark
                      ? "bg-white/[0.04] border-white/8 text-white placeholder-white/30 focus:border-white/20"
                      : "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400"
                  }`}
                />
              </div>
            </>
          )}

          {/* Admin Tabs */}
          {effectiveView === "admin" && (
            <div
              className={`inline-flex p-0.5 rounded-lg border ${
                isDark
                  ? "bg-white/[0.02] border-white/8"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              <button
                onClick={() => setAdminTab("inventory")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  adminTab === "inventory"
                    ? isDark
                      ? "bg-white/10 text-white shadow-xs font-semibold"
                      : "bg-white text-gray-900 shadow-xs font-semibold"
                    : isDark
                      ? "text-white/40 hover:text-white/80 font-medium"
                      : "text-gray-500 hover:text-gray-900 font-medium"
                }`}
              >
                <List size={13} />
                <span>{t("inventory")}</span>
              </button>
              <button
                onClick={() => setAdminTab("analytics")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  adminTab === "analytics"
                    ? isDark
                      ? "bg-white/10 text-white shadow-xs font-semibold"
                      : "bg-white text-gray-900 shadow-xs font-semibold"
                    : isDark
                      ? "text-white/40 hover:text-white/80 font-medium"
                      : "text-gray-500 hover:text-gray-900 font-medium"
                }`}
              >
                <SquaresFour size={13} />
                <span>{t("analytics")}</span>
              </button>
              <button
                onClick={() => setAdminTab("categories")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  adminTab === "categories"
                    ? isDark
                      ? "bg-white/10 text-white shadow-xs font-semibold"
                      : "bg-white text-gray-900 shadow-xs font-semibold"
                    : isDark
                      ? "text-white/40 hover:text-white/80 font-medium"
                      : "text-gray-500 hover:text-gray-900 font-medium"
                }`}
              >
                <FolderOpen size={13} />
                <span>{t("categories_tab")}</span>
              </button>
            </div>
          )}

          {/* Define Category CTA */}
          {effectiveView === "admin" && adminTab === "categories" && (
            <button
              onClick={() => categoryCreateFnRef.current?.()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={14} weight="bold" />
              <span>{t("define_category")}</span>
            </button>
          )}

          {/* Analytics Period */}
          {effectiveView === "admin" && adminTab === "analytics" && (
            <div
              className={`inline-flex p-0.5 rounded-lg border ${
                isDark
                  ? "bg-white/[0.02] border-white/8"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              {[
                { label: t("time_7d"), value: "week" },
                { label: t("time_30d"), value: "month" },
                { label: t("time_90d"), value: "90d" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setAnalyticsPeriod(item.value)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    analyticsPeriod === item.value
                      ? isDark
                        ? "bg-white/10 text-white shadow-xs font-semibold"
                        : "bg-white text-gray-900 shadow-xs font-semibold"
                      : isDark
                        ? "text-white/40 hover:text-white/80 font-medium"
                        : "text-gray-500 hover:text-gray-900 font-medium"
                  }`}
                >
                  <Timer size={12} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Create Asset CTA */}
          {effectiveView === "admin" && adminTab === "inventory" && (
            <button
              onClick={() => createFnRef.current?.()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={14} weight="bold" />
              <span>{t("create_asset")}</span>
            </button>
          )}

          {/* View Mode Toggle */}
          {isAdmin && (
            <div
              className={`inline-flex p-0.5 rounded-lg border ${
                isDark
                  ? "bg-white/[0.02] border-white/8"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              <button
                onClick={() => setViewMode("customer")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  viewMode === "customer"
                    ? isDark
                      ? "bg-white/10 text-white shadow-xs font-semibold"
                      : "bg-white text-gray-900 shadow-xs font-semibold"
                    : isDark
                      ? "text-white/40 hover:text-white/80 font-medium"
                      : "text-gray-500 hover:text-gray-900 font-medium"
                }`}
              >
                <User size={13} />
                <span>{t("customer")}</span>
              </button>
              <button
                onClick={() => setViewMode("admin")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  viewMode === "admin"
                    ? isDark
                      ? "bg-white/10 text-white shadow-xs font-semibold"
                      : "bg-white text-gray-900 shadow-xs font-semibold"
                    : isDark
                      ? "text-white/40 hover:text-white/80 font-medium"
                      : "text-gray-500 hover:text-gray-900 font-medium"
                }`}
              >
                <Crown size={13} />
                <span>{t("admin")}</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content — Matching composition: px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 */}
      <div className="flex-1 min-h-0 w-full flex flex-col px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 overflow-hidden">
        {effectiveView === "admin" ? (
          <AssetAdminPortal activeTab={adminTab} analyticsPeriod={analyticsPeriod} onCreateRef={handleCreateRef} onCategoryCreateRef={handleCategoryCreateRef} />
        ) : (
          <AssetCustomerCatalog
            assets={activeAssets}
            searchQuery={searchQuery}
            filter={filter}
          />
        )}
      </div>
    </div>
  );
};

