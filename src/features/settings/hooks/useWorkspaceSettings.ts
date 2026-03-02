import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersApi } from "@/features/users/api/users.api";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { Member } from "../components/tabs/WorkspaceTeam/TeamMembers";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { socket } from "@/lib/socket-client";
import { useEffect } from "react";

/**
 * useWorkspaceSettings — Connected to real Users API
 *
 * Fetches organization members from GET /api/v1/org/users
 * and maps them to the Member interface used by the Settings UI.
 */
export const useWorkspaceSettings = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);

  const { session } = useAuthStore();
  const { currentOrg: org } = useOrgStore();
  const token = session?.accessToken;
  const orgId = org?.id;
  const queryClient = useQueryClient();

  const { data: members = [], isLoading, refetch } = useQuery({
    queryKey: [...QUERY_KEYS.users.all, "workspace-members", orgId],
    queryFn: async () => {
      if (!token || !orgId) return [];
      const response = await usersApi.getUsers(1, 50, token, orgId);
      return (response.data || []).map((u: { id: string; email: string; first_name?: string | null; last_name?: string | null; name?: string | null; role?: string; status?: string; avatar_url?: string | null }) => ({
        id: u.id,
        name: u.first_name ? `${u.first_name} ${u.last_name || ""}`.trim() : u.name || u.email.split("@")[0],
        email: u.email,
        role: u.role || "member",
        status: u.status || "active",
        avatar: u.avatar_url || null,
      })) as Member[];
    },
    enabled: !!token && !!orgId,
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token || !orgId) throw new Error("No auth");
      await usersApi.deleteUser(id, token, orgId);
      return id;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.users.all });
      const key = [...QUERY_KEYS.users.all, "workspace-members", orgId];
      const previous = queryClient.getQueryData<Member[]>(key);
      // Optimistic update: remove the member from the list immediately
      queryClient.setQueryData<Member[]>(key, old => (old || []).filter(m => m.id !== id));
      return { previous, key };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(context.key, context.previous);
      toast.error("Failed to remove member");
    },
    onSuccess: () => {
      // Invalidate to get the server-confirmed state and avoid stale data on
      // subsequent re-renders. The optimistic update already hid the member;
      // this refetch confirms the server agrees.
      const key = [...QUERY_KEYS.users.all, "workspace-members", orgId];
      queryClient.invalidateQueries({ queryKey: key });
      toast.success("Member removed");
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async (data: { email: string; role: string }) => {
      if (!token || !orgId) throw new Error("No auth");
      await usersApi.createUser(
        { email: data.email, role: data.role, first_name: data.email.split("@")[0] },
        token,
        orgId,
      );
    },
    onSuccess: () => {
      setShowInviteModal(false);
      toast.success("Invitation sent successfully");
      refetch();
    },
    onError: () => toast.error("Failed to invite member"),
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      if (!token || !orgId) throw new Error("No auth");
      await usersApi.updateRole(userId, role, token, orgId);
      return { userId, role };
    },
    onMutate: async ({ userId, role }) => {
      const key = [...QUERY_KEYS.users.all, "workspace-members", orgId];
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.users.all });
      const previous = queryClient.getQueryData<Member[]>(key);
      queryClient.setQueryData<Member[]>(key, old =>
        (old || []).map(m => (m.id === userId ? { ...m, role } : m))
      );
      return { previous, key };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(context.key, context.previous);
      toast.error("Failed to update role");
    },
    onSuccess: () => toast.success("Member role updated"),
  });

  // Listen for real-time member updates strictly filtered by current UI context
  useEffect(() => {
    if (!token || !orgId) return;

    const membersKey = [...QUERY_KEYS.users.all, "workspace-members", orgId];

    const handleUpdate = (payload: Record<string, unknown> & { data?: Record<string, unknown> }) => {
      // The backend may nest payload fields under a `data` key depending on
      // the event publisher. Accept both structures.
      const eventOrgId =
        (payload?.organization_id as string | undefined) ??
        (payload?.data?.organization_id as string | undefined);

      if (eventOrgId === orgId) {
        queryClient.invalidateQueries({ queryKey: membersKey });
      }
    };

    const unsubAdded = socket.on("organization.member_added", handleUpdate as (p: unknown) => void);
    const unsubRemoved = socket.on("organization.member_removed", handleUpdate as (p: unknown) => void);
    const unsubUpdated = socket.on("organization.member_updated", handleUpdate as (p: unknown) => void);

    return () => {
      unsubAdded();
      unsubRemoved();
      unsubUpdated();
    };
  }, [token, orgId, queryClient]);

  return {
    members,
    isLoading,
    showInviteModal,
    setShowInviteModal,
    removeMember: (id: string) => removeMutation.mutate(id),
    inviteMember: (data: { email: string; role: string }) => inviteMutation.mutate(data),
    updateRole: (userId: string, role: string) => updateRoleMutation.mutate({ userId, role }),
  };
};
