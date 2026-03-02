"use client";

import React from "react";
import { useWorkspaceSettings } from "../../hooks/useWorkspaceSettings";
import { WorkspaceProfile } from "./WorkspaceTeam/WorkspaceProfile";
import { WorkspaceBranding } from "./WorkspaceTeam/WorkspaceBranding";
import { TeamMembers } from "./WorkspaceTeam/TeamMembers";
import { InviteMemberModal } from "./WorkspaceTeam/InviteMemberModal";
import { CreateWorkspaceView } from "./WorkspaceTeam/CreateWorkspaceView";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

/**
 * Workspace & Team Settings Tab
 *
 * Conditional rendering based on user's ROLE in the current org:
 * - owner/admin/super_admin → full workspace management view
 * - client/member (no admin) → "Create Your Workspace" view
 *
 * When a user creates a workspace, they become 'owner' of the new org,
 * so the view automatically switches to the full workspace view.
 */
export function WorkspaceTeam() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { currentOrg } = useOrgStore();
  const { session } = useAuthStore();

  const {
    members,
    showInviteModal,
    setShowInviteModal,
    removeMember,
    inviteMember,
    updateRole,
  } = useWorkspaceSettings();

  // Fetch plan tier for upsells/limits
  const { data: planTier = 1 } = useQuery({
    queryKey: ["workspace", "effective-tier", currentOrg?.id],
    queryFn: async () => {
      if (!session?.accessToken || !currentOrg?.id) return 1;
      try {
        const res = await api.get<{ plan?: { code?: string; tier?: number } }>("/api/v1/org/subscriptions/effective", {
          token: session.accessToken,
          orgId: currentOrg.id,
        });
        const plan = res?.plan;
        if (plan?.code === "enterprise") return 3;
        if (plan?.code === "pro") return 2;
        return plan?.tier || 1;
      } catch {
        return 1;
      }
    },
    enabled: !!session?.accessToken && !!currentOrg?.id,
    staleTime: 300000,
  });

  // User's role in the current org determines the view
  const userRole = currentOrg?.role;
  const isWorkspaceOwner =
    userRole === "owner" || userRole === "admin" || userRole === "super_admin";

  // Full view for everyone if they belong to an org
  // only show CreateWorkspaceView if they are completely orphaned (no currentOrg)
  // OR if the current org is the default (Celaest HQ) AND they are not an admin/owner of it,
  // to force regular clients to create their own workspace.
  if (!currentOrg || (currentOrg?.is_system_default && !isWorkspaceOwner)) {
    return <CreateWorkspaceView planTier={planTier} />;
  }

  const isReadOnly = !isWorkspaceOwner;

  // Owner/Admin view or Read-Only Member view
  return (
    <div className={`space-y-6 ${isReadOnly ? "opacity-95" : ""}`}>
      <WorkspaceProfile readOnly={isReadOnly} />
      <WorkspaceBranding readOnly={isReadOnly} />

      <TeamMembers
        members={members}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onRemoveMember={isReadOnly ? undefined : removeMember}
        onUpdateRole={isReadOnly ? undefined : updateRole}
        onInviteClick={isReadOnly ? undefined : () => setShowInviteModal(true)}
        readOnly={isReadOnly}
      />

      {!isReadOnly && (
        <InviteMemberModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onInvite={inviteMember}
        />
      )}
    </div>
  );
}
