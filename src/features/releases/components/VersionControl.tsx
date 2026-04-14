"use client";

import React, { useEffect } from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { VersionEditor } from "./VersionEditor";
import { VersionDetailsModal } from "./modals/VersionDetailsModal";
import { useVersionControl } from "../hooks/useVersionControl";
import { VersionTable } from "./VersionControl/VersionTable";
import { TableChrome } from "@/components/layout/TableChrome";

interface VersionControlProps {
  createRef?: React.MutableRefObject<(() => void) | undefined>;
}

export const VersionControl: React.FC<VersionControlProps> = ({ createRef }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    versions,
    isEditorOpen,
    editingVersion,
    detailsModalOpen,
    viewingVersion,
    totalVersions,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    handleCreate,
    handleEdit,
    handleDeprecate,
    handleSaveVersion,
    handleViewDetails,
    setIsEditorOpen,
    setDetailsModalOpen,
    availableAssets,
  } = useVersionControl();

  useEffect(() => {
    if (createRef) {
      createRef.current = handleCreate;
    }
  }, [createRef, handleCreate]);

  return (
    <>
      <TableChrome
        toolbar={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                All Versions
              </span>
            </div>
            <span className={`text-[11px] tabular-nums ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              {totalVersions != null ? `Showing ${versions.length} of ${totalVersions} versions` : ""}
            </span>
          </div>
        }
      >
        <VersionTable
          versions={versions}
          totalItems={totalVersions}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
          onEdit={handleEdit}
          onViewDetails={handleViewDetails}
          onDeprecate={handleDeprecate}
          hideFooter
        />
      </TableChrome>

      {/* Version Editor Modal */}
      <VersionEditor
        key={editingVersion ? editingVersion.id : "new-release"}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveVersion}
        version={editingVersion}
        assets={availableAssets}
      />

      <VersionDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        version={viewingVersion}
      />
    </>
  );
};
