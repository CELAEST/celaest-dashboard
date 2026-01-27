import { useState } from "react";
import { CustomerAsset } from "../types";

const MOCK_ASSETS: CustomerAsset[] = [
  {
    id: "1",
    name: "Advanced Financial Dashboard",
    currentVersion: "v2.0.5",
    latestVersion: "v2.1.0",
    hasUpdate: true,
    purchaseDate: "2025-09-15",
    lastDownload: "2025-11-15",
    changelog: [
      "Added multi-currency support",
      "Improved chart rendering performance",
      "Fixed date formatting bug in reports",
    ],
    compatibility: "Excel 2016+",
    checksum: "sha256:a3f5c9d2e1b4...",
  },
  {
    id: "2",
    name: "Python Data Scraper Script",
    currentVersion: "v1.5.2",
    latestVersion: "v1.5.2",
    hasUpdate: false,
    purchaseDate: "2025-08-20",
    lastDownload: "2025-12-05",
    changelog: [
      "Added proxy rotation feature",
      "Improved error handling",
      "Added CSV export option",
    ],
    compatibility: "Python 3.8+",
    checksum: "sha256:c9d4e6f2a8b3...",
  },
  {
    id: "3",
    name: "Inventory Management Template",
    currentVersion: "v2.8.1",
    latestVersion: "v3.0.0",
    hasUpdate: true,
    purchaseDate: "2025-07-10",
    lastDownload: "2025-10-22",
    changelog: [
      " Major redesign with new UI",
      "Real-time sync improvements",
      "Mobile app integration (beta)",
      "Advanced reporting dashboard",
    ],
    compatibility: "Google Sheets",
    checksum: "sha256:d5e7f8a9b1c2...",
  },
];

export const useUpdateCenter = () => {
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const [assets] = useState<CustomerAsset[]>(MOCK_ASSETS); // In real app, this would be fetched

  const toggleExpanded = (id: string) => {
    setExpandedAsset(expandedAsset === id ? null : id);
  };

  const updateCount = assets.filter((a) => a.hasUpdate).length;

  return {
    assets,
    expandedAsset,
    toggleExpanded,
    updateCount,
  };
};
