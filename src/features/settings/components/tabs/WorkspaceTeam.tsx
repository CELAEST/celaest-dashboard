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
  const {
    members,
    showInviteModal,
    setShowInviteModal,
    removeMember,
    inviteMember,
  } = useWorkspaceSettings();

  return (
    <div className="space-y-6">
      <WorkspaceProfile />

      <TeamMembers
        members={members}
        onRemoveMember={removeMember}
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
