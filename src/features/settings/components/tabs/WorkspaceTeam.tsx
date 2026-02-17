"use client";

import React from "react";
import { useWorkspaceSettings } from "../../hooks/useWorkspaceSettings";
import { WorkspaceProfile } from "./WorkspaceTeam/WorkspaceProfile";
import { TeamMembers } from "./WorkspaceTeam/TeamMembers";
import { InviteMemberModal } from "./WorkspaceTeam/InviteMemberModal";

/**
 * Workspace & Team Settings Tab
 */
export function WorkspaceTeam() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const {
    members,
    showInviteModal,
    setShowInviteModal,
    removeMember,
    inviteMember,
    updateRole,
  } = useWorkspaceSettings();

  return (
    <div className="space-y-6">
      <WorkspaceProfile />

      <TeamMembers
        members={members}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onRemoveMember={removeMember}
        onUpdateRole={updateRole}
        onInviteClick={() => setShowInviteModal(true)}
      />

      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={inviteMember}
      />
    </div>
  );
}
