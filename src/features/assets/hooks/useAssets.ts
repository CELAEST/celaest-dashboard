import { useState, useCallback, useMemo } from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";

export interface Asset {
  id: string;
  name: string;
  type: "excel" | "script" | "google-sheet";
  category: string;
  price: number;
  operationalCost: number;
  status: "active" | "draft" | "archived";
  version: string;
  fileSize: string;
  downloads: number;
  rating: number; // Added for customer view
  reviews: number; // Added for customer view
  description: string; // Added
  features: string[]; // Added
  requirements: string[]; // Added
  thumbnail: string; // Added
  isPurchased: boolean; // Added
  createdAt: string;
  updatedAt: string;
}

const INITIAL_ASSETS: Asset[] = [
  {
    id: "1",
    name: "Advanced Financial Dashboard",
    type: "excel",
    category: "Finance",
    price: 149.99,
    operationalCost: 12.5,
    status: "active",
    version: "2.4.0",
    fileSize: "4.2 MB",
    downloads: 342,
    rating: 4.8,
    reviews: 127,
    description: "Comprehensive financial analysis tool with automated reporting, P&L statements, and cash flow forecasting.",
    features: ["Automated financial reports", "Interactive dashboards", "Multi-currency support", "Budget vs Actual analysis"],
    requirements: ["Microsoft Excel 2016 or higher", "Windows 10+ or macOS 10.14+", "Macros enabled"],
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&fm=webp",
    isPurchased: false,
    createdAt: "2024-01-15",
    updatedAt: "2024-03-20",
  },
  {
    id: "2",
    name: "Python Data Scraper Script",
    type: "script",
    category: "Automation",
    price: 89.99,
    operationalCost: 5.0,
    status: "active",
    version: "1.1.2",
    fileSize: "12 KB",
    downloads: 567,
    rating: 4.9,
    reviews: 89,
    description: "Powerful web scraping tool with anti-bot detection, proxy support, and automatic data cleaning.",
    features: ["Multi-threaded scraping", "Proxy rotation", "Data export to CSV/JSON", "Customizable selectors"],
    requirements: ["Python 3.8 or higher", "pip package manager", "Chrome or Firefox browser"],
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&fm=webp",
    isPurchased: true,
    createdAt: "2024-02-10",
    updatedAt: "2024-02-15",
  },
  {
    id: "3",
    name: "Inventory Management Template",
    type: "google-sheet",
    category: "Operations",
    price: 59.99,
    operationalCost: 2.0,
    status: "active",
    version: "3.0.1",
    fileSize: "0 KB",
    downloads: 891,
    rating: 4.7,
    reviews: 203,
    description: "Complete inventory tracking system with real-time stock alerts, supplier management, and purchase order automation.",
    features: ["Real-time stock tracking", "Automated reorder alerts", "Supplier database", "Mobile-friendly interface"],
    requirements: ["Google Account", "Google Sheets access", "Internet connection"],
    thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&fm=webp",
    isPurchased: false,
    createdAt: "2023-11-05",
    updatedAt: "2024-01-30",
  },
  {
    id: "4",
    name: "CRM Analytics Bundle",
    type: "excel",
    category: "Sales",
    price: 199.99,
    operationalCost: 25.0,
    status: "draft",
    version: "0.9.0",
    fileSize: "8.5 MB",
    downloads: 0,
    rating: 0,
    reviews: 0,
    description: "Professional CRM analytics suite with customer segmentation, sales pipeline tracking, and performance metrics.",
    features: ["Customer segmentation", "Sales funnel visualization", "Revenue forecasting", "Team performance tracking"],
    requirements: ["Microsoft Excel 2019 or higher", "Windows 10+ or macOS 11+", "VBA macros enabled"],
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&fm=webp",
    isPurchased: false,
    createdAt: "2024-03-25",
    updatedAt: "2024-03-25",
  },
];

export const useAssets = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);

  const deleteAsset = useCallback((id: string) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "archived" as const } : a))
    );
  }, []);

  const duplicateAsset = useCallback((asset: Asset) => {
    const newAsset: Asset = {
      ...asset,
      id: Date.now().toString(),
      name: `${asset.name} (Copy)`,
      status: "draft",
      downloads: 0,
      rating: 0,
      reviews: 0,
      isPurchased: false,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setAssets((prev) => [...prev, newAsset]);
  }, []);

  const saveAsset = useCallback(
    (assetData: Partial<Asset>, editingAssetId?: string) => {
      if (editingAssetId) {
        setAssets((prev) =>
          prev.map((a) =>
            a.id === editingAssetId
              ? {
                  ...a,
                  ...assetData,
                  updatedAt: new Date().toISOString().split("T")[0],
                }
              : a
          )
        );
      } else {
        const newAsset: Asset = {
          id: Date.now().toString(),
          name: assetData.name || "New Asset",
          type: assetData.type || "excel",
          category: assetData.category || "Uncategorized",
          price: assetData.price || 0,
          operationalCost: assetData.operationalCost || 0,
          status: assetData.status || "draft",
          version: "1.0.0",
          fileSize: "0 KB", // Mock
          downloads: 0,
          rating: 0,
          reviews: 0,
          description: assetData.description || "",
          features: assetData.features || [],
          requirements: assetData.requirements || [],
          thumbnail: assetData.thumbnail || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&fm=webp", // Default mock
          isPurchased: false,
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        };
        setAssets((prev) => [...prev, newAsset]);
      }
    },
    []
  );

  const activeAssets = useMemo(() => assets.filter(a => a.status === 'active'), [assets]);

  return {
    isDark,
    assets,
    activeAssets,
    deleteAsset,
    duplicateAsset,
    saveAsset,
  };
};
