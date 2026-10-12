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
        className={`shrink-0 px-3 sm:px-6 py-2.5 sm:py-3.5 flex flex-col gap-2.5 sm:gap-3 border-b backdrop-blur-xl transition-colors duration-200 ${
          isDark
            ? "bg-[#09090b]/80 border-white/6"
            : "bg-white/80 border-gray-200/80"
        }`}
      >
        {/* Top Row: Icon, Title & Desktop Controls / Mode Toggle */}
        <div className="flex items-center justify-between gap-3 w-full min-w-0">
          {/* Left: Icon, Title, Subtitle */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                isDark
                  ? "bg-white/[0.04] border-white/8 text-white/70"
                  : "bg-gray-100 border-gray-200 text-gray-700"
              }`}
            >
              <Package size={15} className="sm:scale-110" />
            </div>
            <div className="min-w-0">
              <h1
                className={`text-xs sm:text-base font-semibold tracking-tight truncate ${
                  isDark ? "text-zinc-100" : "text-gray-900"
                }`}
              >
                {effectiveView === "admin"
                  ? t("asset_manager")
                  : t("product_catalog_title")}
              </h1>
              <p
                className={`text-[9px] sm:text-[11px] font-mono tracking-wider uppercase truncate hidden sm:block ${
                  isDark ? "text-white/40" : "text-gray-400"
                }`}
              >
                {effectiveView === "admin"
                  ? t("inventory_versioning")
                  : t("browse_available_products")}
              </p>
            </div>
          </div>

          {/* Right: Desktop Controls & Mode Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Desktop Customer View: Categories & Search inline */}
            {effectiveView === "customer" && (
              <div className="hidden md:flex items-center gap-2.5">
                {/* Categories inline (desktop) */}
                {categories.length > 0 && (
                  <div
                    className={`inline-flex items-center p-0.5 rounded-lg border max-w-sm lg:max-w-md xl:max-w-lg overflow-x-auto no-scrollbar ${
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

                {/* Integrated Search Input (desktop) */}
                <div className="relative w-44 lg:w-56">
                  <MagnifyingGlass
                    size={13}
                    className={`absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                      isDark ? "text-white/30" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder={t("search_assets")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-7 pr-7 py-1 rounded-lg text-[11px] font-mono border outline-none transition-colors ${
                      isDark
                        ? "bg-white/[0.04] border-white/8 text-white placeholder-white/30 focus:border-white/20"
                        : "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400"
                    }`}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs font-mono"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Desktop Admin Tabs & Controls */}
            {effectiveView === "admin" && (
              <div className="hidden sm:flex items-center gap-2">
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

                {/* Define Category CTA */}
                {adminTab === "categories" && (
                  <button
                    onClick={() => categoryCreateFnRef.current?.()}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
                  >
                    <Plus size={14} weight="bold" />
                    <span>{t("define_category")}</span>
                  </button>
                )}

                {/* Analytics Period */}
                {adminTab === "analytics" && (
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
                {adminTab === "inventory" && (
                  <button
                    onClick={() => createFnRef.current?.()}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
                  >
                    <Plus size={14} weight="bold" />
                    <span>{t("create_asset")}</span>
                  </button>
                )}
              </div>
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
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    viewMode === "customer"
                      ? isDark
                        ? "bg-white/10 text-white shadow-xs font-semibold"
                        : "bg-white text-gray-900 shadow-xs font-semibold"
                      : isDark
                        ? "text-white/40 hover:text-white"
                        : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <User size={12} />
                  <span className="hidden sm:inline">{t("customer")}</span>
                </button>
                <button
                  onClick={() => setViewMode("admin")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    viewMode === "admin"
                      ? isDark
                        ? "bg-white/10 text-white shadow-xs font-semibold"
                        : "bg-white text-gray-900 shadow-xs font-semibold"
                      : isDark
                        ? "text-white/40 hover:text-white"
                        : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Crown size={12} />
                  <span className="hidden sm:inline">{t("admin")}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Customer View (<md): Full-Width Search Bar + Smooth Horizontal Category Pills */}
        {effectiveView === "customer" && (
          <div className="flex flex-col gap-2 md:hidden w-full pt-0.5">
            {/* Search Input: Spans full width cleanly */}
            <div className="relative w-full">
              <MagnifyingGlass
                size={13}
                className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                  isDark ? "text-white/30" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder={t("search_assets")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-8.5 pr-8 py-1.5 rounded-xl text-xs font-mono border outline-none transition-colors ${
                  isDark
                    ? "bg-white/[0.04] border-white/8 text-white placeholder-white/30 focus:border-white/20"
                    : "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400"
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs font-mono"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Pills: Edge-to-edge smooth swipe with no-scrollbar */}
            {categories.length > 0 && (
              <div
                className={`w-full inline-flex items-center p-1 rounded-xl border overflow-x-auto no-scrollbar gap-1 ${
                  isDark
                    ? "bg-white/[0.02] border-white/8"
                    : "bg-gray-100 border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`flex items-center px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
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
                      className={`flex items-center px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
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
          </div>
        )}

        {/* Mobile Admin Tabs (<sm) */}
        {effectiveView === "admin" && (
          <div className="flex sm:hidden flex-col gap-2 w-full pt-0.5">
            <div
              className={`w-full inline-flex p-0.5 rounded-lg border overflow-x-auto no-scrollbar ${
                isDark
                  ? "bg-white/[0.02] border-white/8"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              <button
                onClick={() => setAdminTab("inventory")}
                className={`flex-1 flex items-center justify-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  adminTab === "inventory"
                    ? isDark
                      ? "bg-white/10 text-white shadow-xs font-semibold"
                      : "bg-white text-gray-900 shadow-xs font-semibold"
                    : isDark
                      ? "text-white/40 hover:text-white/80"
                      : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <List size={12} />
                <span>{t("inventory")}</span>
              </button>
              <button
                onClick={() => setAdminTab("analytics")}
                className={`flex-1 flex items-center justify-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  adminTab === "analytics"
                    ? isDark
                      ? "bg-white/10 text-white shadow-xs font-semibold"
                      : "bg-white text-gray-900 shadow-xs font-semibold"
                    : isDark
                      ? "text-white/40 hover:text-white/80"
                      : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <SquaresFour size={12} />
                <span>{t("analytics")}</span>
              </button>
              <button
                onClick={() => setAdminTab("categories")}
                className={`flex-1 flex items-center justify-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  adminTab === "categories"
                    ? isDark
                      ? "bg-white/10 text-white shadow-xs font-semibold"
                      : "bg-white text-gray-900 shadow-xs font-semibold"
                    : isDark
                      ? "text-white/40 hover:text-white/80"
                      : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <FolderOpen size={12} />
                <span>{t("categories_tab")}</span>
              </button>
            </div>

            {/* Admin Mobile CTAs */}
            {adminTab === "categories" && (
              <button
                onClick={() => categoryCreateFnRef.current?.()}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
              >
                <Plus size={14} weight="bold" />
                <span>{t("define_category")}</span>
              </button>
            )}
            {adminTab === "inventory" && (
              <button
                onClick={() => createFnRef.current?.()}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
              >
                <Plus size={14} weight="bold" />
                <span>{t("create_asset")}</span>
              </button>
            )}
          </div>
        )}
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

