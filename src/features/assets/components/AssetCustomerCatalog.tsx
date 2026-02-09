"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence } from "motion/react";
import {
  Search,
  Code,
  Globe,
  Box,
  Music,
  Image as ImageIcon,
  Zap,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { ProductDetailModal } from "./ProductDetailModal";
import { Asset } from "../services/assets.service";
import { MarketplaceCard } from "./MarketplaceCard";

// Rich Mock Data for the Marketplace Demo
const MOCK_MARKETPLACE_ASSETS = [
  {
    id: "m1",
    name: "Neon City 3D Kit",
    category: "3D Models",
    price: 89.99,
    type: "3d-model",
    version: "2.1.0",
    rating: 4.9,
    reviews: 128,
    downloads: 3420,
    thumbnail:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop",
    isPurchased: false,
    roi: "95%",
    description:
      "Complete modular kit for building cyberpunk cities. Includes 200+ assets.",
    specs: [
      { label: "Format", value: ".FBX / .OBJ", icon: <Box size={14} /> },
      { label: "Polys", value: "High / Low", icon: <Zap size={14} /> },
    ],
    trendData: [
      { value: 40 },
      { value: 65 },
      { value: 50 },
      { value: 80 },
      { value: 95 },
    ],
    features: ["Modular Streets", "Holographic Signs", "Volumetric Fog"],
    requirements: ["Unreal Engine 5", "8GB VRAM"],
    operationalCost: 0,
    status: "active",
    fileSize: "2.4 GB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "m2",
    name: "AI Trading Bot Script",
    category: "Scripts",
    price: 149.0,
    type: "script",
    version: "1.0.5",
    rating: 4.7,
    reviews: 56,
    downloads: 890,
    thumbnail:
      "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2070&auto=format&fit=crop",
    isPurchased: true,
    roi: "120%",
    description:
      "Advanced Python script for automated crypto trading with configurable strategies.",
    specs: [
      { label: "Lang", value: "Python 3.9", icon: <Code size={14} /> },
      { label: "License", value: "Commercial", icon: <Globe size={14} /> },
    ],
    trendData: [
      { value: 30 },
      { value: 40 },
      { value: 35 },
      { value: 60 },
      { value: 70 },
    ],
    features: ["Auto-Rebalancing", "Stop-Loss", "Backtesting"],
    requirements: ["Python 3.9+", "API Keys"],
    operationalCost: 10,
    status: "active",
    fileSize: "15 MB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "m3",
    name: "Cinematic Soundscapes",
    category: "Audio",
    price: 29.99,
    type: "audio",
    version: "3.0",
    rating: 4.8,
    reviews: 210,
    downloads: 5600,
    thumbnail:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop",
    isPurchased: false,
    roi: "N/A",
    description:
      "Royalty-free ambient textures and drones for film and game production.",
    specs: [
      { label: "Format", value: "WAV 24bit", icon: <Music size={14} /> },
      { label: "Tracks", value: "50+", icon: <Zap size={14} /> },
    ],
    trendData: [
      { value: 20 },
      { value: 25 },
      { value: 30 },
      { value: 28 },
      { value: 45 },
    ],
    features: ["Seamless Loops", "Dolby Atmos Ready", "Royalty Free"],
    requirements: ["Any DAW"],
    operationalCost: 0,
    status: "active",
    fileSize: "1.2 GB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "m4",
    name: "Pro UI Kit - Glassmorphism",
    category: "Templates",
    price: 45.0,
    type: "template",
    version: "1.2",
    rating: 5.0,
    reviews: 85,
    downloads: 1200,
    thumbnail:
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&auto=format&fit=crop",
    isPurchased: false,
    roi: "200%",
    description:
      "The extensive UI kit used to build this very dashboard. React + Tailwind.",
    specs: [
      { label: "Framework", value: "React", icon: <Code size={14} /> },
      { label: "Style", value: "Tailwind", icon: <Zap size={14} /> },
    ],
    trendData: [
      { value: 80 },
      { value: 85 },
      { value: 90 },
      { value: 95 },
      { value: 100 },
    ],
    features: ["Dark Mode", "60+ Components", "Figma File"],
    requirements: ["React 19", "Tailwind 4"],
    operationalCost: 0,
    status: "active",
    fileSize: "50 MB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "m5",
    name: "Financial Data Sheet",
    category: "Excel",
    price: 12.5,
    type: "excel",
    version: "2024",
    rating: 4.5,
    reviews: 40,
    downloads: 600,
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    isPurchased: true,
    roi: "50%",
    description: "Automated financial forecasting model for SaaS startups.",
    specs: [
      { label: "Format", value: ".XLSX", icon: <Code size={14} /> },
      { label: "Macros", value: "Yes", icon: <Zap size={14} /> },
    ],
    trendData: [
      { value: 20 },
      { value: 22 },
      { value: 25 },
      { value: 28 },
      { value: 30 },
    ],
    features: ["MRR Calc", "Burn Rate", "Cohort Analysis"],
    requirements: ["Excel 2021+"],
    operationalCost: 0,
    status: "active",
    fileSize: "2 MB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "m6",
    name: "Cyber Character Pack",
    category: "3D Models",
    price: 120.0,
    type: "3d-model",
    version: "1.0",
    rating: 4.9,
    reviews: 90,
    downloads: 2000,
    thumbnail:
      "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1908&auto=format&fit=crop",
    isPurchased: false,
    roi: "N/A",
    description: "5 Rigged cyberpunk characters ready for Unreal Engine 5.",
    specs: [
      { label: "Rigged", value: "Yes", icon: <Box size={14} /> },
      { label: "Texture", value: "4K", icon: <ImageIcon size={14} /> },
    ],
    trendData: [
      { value: 10 },
      { value: 20 },
      { value: 15 },
      { value: 40 },
      { value: 50 },
    ],
    features: ["Full Rig", "Facial Blendshapes", "Clothing Variants"],
    requirements: ["UE5", "Maya (Optional)"],
    operationalCost: 0,
    status: "active",
    fileSize: "8 GB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface AssetCustomerCatalogProps {
  assets: Asset[];
}

export const AssetCustomerCatalog: React.FC<
  AssetCustomerCatalogProps
> = ({}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedProduct, setSelectedProduct] = useState<Asset | null>(null);
  const [filter, setFilter] = useState<
    "all" | "3d" | "script" | "audio" | "template"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Use mocks directly to restore Marketplace view as requested
  const displayAssets = useMemo(() => {
    // Explicitly cast mocks to contain required fields
    return [...MOCK_MARKETPLACE_ASSETS] as unknown as Asset[];
  }, []);

  const filteredAssets = useMemo(() => {
    return displayAssets.filter((item) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "3d" && item.category === "3D Models") ||
        (filter === "script" && item.category === "Scripts") ||
        (filter === "audio" && item.category === "Audio") ||
        (filter === "template" &&
          (item.category === "Templates" || item.category === "Excel"));

      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [displayAssets, filter, searchQuery]);

  return (
    <div className="h-full flex flex-col min-h-0 relative">
      {/* Search & Filter Header */}
      <div className="shrink-0 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className={`relative group w-full md:w-96`}>
          <div
            className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDark ? "text-gray-500 group-focus-within:text-cyan-400" : "text-gray-400 group-focus-within:text-blue-500"} transition-colors`}
          >
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search marketplace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${
              isDark
                ? "bg-black/20 border-white/10 focus:border-cyan-500/50 focus:bg-white/5 text-white placeholder-gray-600"
                : "bg-white border-gray-200 focus:border-blue-500 ring-4 ring-transparent focus:ring-blue-500/10 text-gray-900"
            }`}
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All Items" },
            { id: "3d", label: "3D Models", icon: Box },
            { id: "script", label: "Scripts", icon: Code },
            { id: "audio", label: "Audio", icon: Music },
            { id: "template", label: "Templates", icon: Zap },
          ].map((chip) => {
            const Icon = chip.icon;
            const isActive = filter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() =>
                  setFilter(
                    chip.id as "all" | "3d" | "script" | "audio" | "template",
                  )
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                  isActive
                    ? isDark
                      ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                      : "bg-blue-600 text-white border-blue-600 shadow-md"
                    : isDark
                      ? "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {Icon && <Icon size={14} />}
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 min-h-0 relative">
        <div className="absolute inset-0 overflow-y-auto pr-2 pb-20 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredAssets.map((product, index) => (
                <MarketplaceCard
                  key={product.id}
                  product={product as unknown as Asset}
                  isDark={isDark}
                  index={index}
                  onViewDetails={(p) => setSelectedProduct(p)}
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredAssets.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-center opacity-50">
              <Box size={48} className="mb-4 text-gray-500" />
              <p
                className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                No items found
              </p>
              <p className="text-sm text-gray-500">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
