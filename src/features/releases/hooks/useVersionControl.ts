import { useState } from "react";
import { Version } from "../types";

const MOCK_VERSIONS: Version[] = [
  {
    id: "1",
    assetName: "Advanced Financial Dashboard",
    versionNumber: "v2.1.0",
    status: "stable",
    releaseDate: "2026-01-10",
    fileSize: "4.2 MB",
    checksum: "sha256:a3f5c9d2e1b4...",
    downloads: 287,
    adoptionRate: 84.2,
    changelog: [
      "Added multi-currency support",
      "Improved chart rendering performance",
      "Fixed date formatting bug",
    ],
    compatibility: "Excel 2016+",
  },
  {
    id: "2",
    assetName: "Advanced Financial Dashboard",
    versionNumber: "v2.0.5",
    status: "deprecated",
    releaseDate: "2025-11-15",
    fileSize: "3.8 MB",
    checksum: "sha256:b7e2f3a8c5d1...",
    downloads: 156,
    adoptionRate: 12.8,
    changelog: [
      "Security patch for macro validation",
      "Minor UI improvements",
    ],
    compatibility: "Excel 2016+",
  },
  {
    id: "3",
    assetName: "Python Data Scraper Script",
    versionNumber: "v1.5.2",
    status: "stable",
    releaseDate: "2025-12-05",
    fileSize: "125 KB",
    checksum: "sha256:c9d4e6f2a8b3...",
    downloads: 445,
    adoptionRate: 92.1,
    changelog: [
      "Added proxy rotation feature",
      "Improved error handling",
      "Added CSV export option",
    ],
    compatibility: "Python 3.8+",
  },
  {
    id: "4",
    assetName: "Inventory Management Template",
    versionNumber: "v3.0.0",
    status: "beta",
    releaseDate: "2026-01-18",
    fileSize: "Cloud",
    checksum: "sha256:d5e7f8a9b1c2...",
    downloads: 34,
    adoptionRate: 15.3,
    changelog: [
      "Major redesign with new UI",
      "Real-time sync improvements",
      "Mobile app integration (beta)",
    ],
    compatibility: "Google Sheets",
  },
];

export const useVersionControl = () => {
  const [versions, setVersions] = useState<Version[]>(MOCK_VERSIONS);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingVersion, setEditingVersion] = useState<Version | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [viewingVersion, setViewingVersion] = useState<Version | null>(null);

  const handleCreate = () => {
    setEditingVersion(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (version: Version) => {
    setEditingVersion(version);
    setIsEditorOpen(true);
    setActiveMenu(null);
  };

  const handleDeprecate = (id: string) => {
    setVersions(
      versions.map((v) =>
        v.id === id ? { ...v, status: "deprecated" as const } : v,
      ),
    );
    setActiveMenu(null);
  };

  const handleSaveVersion = (versionData: Partial<Version>) => {
    if (editingVersion) {
      setVersions(
        versions.map((v) =>
          v.id === editingVersion.id ? { ...v, ...versionData } : v,
        ),
      );
    } else {
      const newVersion: Version = {
        id: Date.now().toString(),
        assetName: versionData.assetName || "New Asset",
        versionNumber: versionData.versionNumber || "v1.0.0",
        status: (versionData.status as Version["status"]) || "beta",
        releaseDate: new Date().toISOString().split("T")[0],
        fileSize: versionData.fileSize || "0 KB",
        checksum: versionData.checksum || "sha256:generating...",
        downloads: 0,
        adoptionRate: 0,
        changelog: versionData.changelog || [],
        compatibility: versionData.compatibility || "",
      };
      setVersions([newVersion, ...versions]);
    }
    setIsEditorOpen(false);
  };

  const handleViewDetails = (version: Version) => {
    setViewingVersion(version);
    setDetailsModalOpen(true);
    setActiveMenu(null);
  };

  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  return {
    versions,
    activeMenu,
    isEditorOpen,
    editingVersion,
    detailsModalOpen,
    viewingVersion,
    handleCreate,
    handleEdit,
    handleDeprecate,
    handleSaveVersion,
    handleViewDetails,
    toggleMenu,
    setIsEditorOpen,
    setDetailsModalOpen,
  };
};
