"use client";

import React, { useState } from "react";
import { SidenavStudioShowcase } from "./SidenavStudioShowcase";
import { TokyoMarketplaceShowcase } from "./TokyoMarketplaceShowcase";
import { ActionUtilityStudioShowcase } from "./ActionUtilityStudioShowcase";
import { ProductDetailStudioShowcase } from "./ProductDetailStudioShowcase";
import { PurchaseFlowStudioShowcase } from "./PurchaseFlowStudioShowcase";
import { UpgradePlanStudioShowcase } from "./UpgradePlanStudioShowcase";
import { TableStudioShowcase } from "./TableStudioShowcase";
import { LicensingStudioShowcase } from "./LicensingStudioShowcase";
import { ReleaseStudioShowcase } from "./ReleaseStudioShowcase";
import { ErrorStudioShowcase } from "./ErrorStudioShowcase";
import { SettingsStudioShowcase } from "./SettingsStudioShowcase";
import { Funnel, SquaresFour, SlidersHorizontal, Eye, ShoppingCart, Sparkle, Table, Key, ArrowsClockwise, WarningOctagon, Gear } from "@phosphor-icons/react";

export function LabView() {
  const [activeTab, setActiveTab] = useState<"settings" | "errors" | "releases" | "licensing" | "tables" | "upgrade" | "checkout" | "modal" | "actions" | "sidenav" | "cards">("settings");

  return (
    <div className="w-full h-full flex flex-col bg-[#030303] text-white overflow-y-auto no-scrollbar font-sans p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-start gap-6">
        {/* Selector de Estudio en el Lab */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#0C0C0E] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "settings"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Gear size={14} weight="bold" />
              <span>Configuración Studio ★</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("errors")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "errors"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <WarningOctagon size={14} weight="bold" />
              <span>Monitor de Errores Studio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("releases")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "releases"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <ArrowsClockwise size={14} weight="bold" />
              <span>Releases & Updates Studio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("licensing")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "licensing"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Key size={14} weight="bold" />
              <span>Licencias Hub Studio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("tables")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "tables"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Table size={14} weight="bold" />
              <span>Tablas Enterprise Studio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("upgrade")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "upgrade"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Sparkle size={14} weight="fill" />
              <span>Planes Upgrade Studio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("checkout")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "checkout"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <ShoppingCart size={14} weight="bold" />
              <span>Modal Adquirir Studio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("modal")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "modal"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Eye size={14} weight="bold" />
              <span>Ver Detalles Studio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("actions")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "actions"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <SlidersHorizontal size={14} weight="bold" />
              <span>Planes & Cupones</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("sidenav")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "sidenav"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Funnel size={14} weight="bold" />
              <span>Sidenav Studio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("cards")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "cards"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <SquaresFour size={14} weight="bold" />
              <span>Cards Tokyo</span>
            </button>
          </div>
        </div>

        {activeTab === "settings" ? (
          <SettingsStudioShowcase />
        ) : activeTab === "errors" ? (
          <ErrorStudioShowcase />
        ) : activeTab === "releases" ? (
          <ReleaseStudioShowcase />
        ) : activeTab === "licensing" ? (
          <LicensingStudioShowcase />
        ) : activeTab === "tables" ? (
          <TableStudioShowcase />
        ) : activeTab === "upgrade" ? (
          <UpgradePlanStudioShowcase />
        ) : activeTab === "checkout" ? (
          <PurchaseFlowStudioShowcase />
        ) : activeTab === "modal" ? (
          <ProductDetailStudioShowcase />
        ) : activeTab === "actions" ? (
          <ActionUtilityStudioShowcase />
        ) : activeTab === "sidenav" ? (
          <SidenavStudioShowcase />
        ) : (
          <TokyoMarketplaceShowcase />
        )}
      </div>
    </div>
  );
}


