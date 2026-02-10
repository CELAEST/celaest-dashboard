"use client";

import React from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { VersionEditor } from "./VersionEditor";
import { VersionDetailsModal } from "./modals/VersionDetailsModal";
import { useVersionControl } from "../hooks/useVersionControl";
import { VersionHeader } from "./VersionControl/VersionHeader";
import { VersionTable } from "./VersionControl/VersionTable";

export const VersionControl: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    versions,
    isLoading,
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
    availableAssets,
    isSaving,
  } = useVersionControl();

  return (
    <>
      <div
        className={`h-full flex flex-col rounded-2xl border overflow-hidden ${
          isDark
            ? "bg-linear-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        <div className="shrink-0">
          <VersionHeader onCreate={handleCreate} />
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          <VersionTable
            versions={versions}
            isLoading={isLoading}
            activeMenu={activeMenu}
            onToggleMenu={toggleMenu}
            onEdit={handleEdit}
            onViewDetails={handleViewDetails}
            onDeprecate={handleDeprecate}
          />
        </div>

        {/* Footer */}
        <div
          className={`shrink-0 p-4 border-t flex items-center justify-between ${
            isDark ? "bg-white/2 border-white/5" : "bg-gray-50 border-gray-200"
          }`}
        >
          <p
            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}
          >
            Showing {versions.length} versions
          </p>
        </div>
      </div>

      {/* Version Editor Modal */}
      <VersionEditor
        key={editingVersion ? editingVersion.id : "new-release"}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveVersion}
        version={editingVersion}
        assets={availableAssets}
        isSubmitting={isSaving}
      />

      <VersionDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        version={viewingVersion}
      />
    </>
  );
};
