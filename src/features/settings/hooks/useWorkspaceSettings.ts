import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { usersApi } from "@/features/users/api/users.api";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrg } from "@/features/shared/contexts/OrgContext";
import { Member } from "../components/tabs/WorkspaceTeam/TeamMembers";

/**
 * useWorkspaceSettings — Connected to real Users API
 *
 * Fetches organization members from GET /api/v1/org/users
 * and maps them to the Member interface used by the Settings UI.
 */
export const useWorkspaceSettings = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { session } = useAuthStore();
  const { org } = useOrg();
  const token = session?.accessToken;
  const orgId = org?.id;

  // Fetch real members from backend
  const fetchMembers = useCallback(async () => {
    if (!token || !orgId) return;
    try {
      setIsLoading(true);
      const response = await usersApi.getUsers(1, 50, token, orgId);
      const mapped: Member[] = (response.data || []).map((u: { id: string; email: string; first_name?: string; last_name?: string; name?: string; role?: string; status?: string; avatar_url?: string }) => ({
        id: u.id,
        name: u.first_name ? `${u.first_name} ${u.last_name || ""}`.trim() : u.name || u.email.split("@")[0],
        email: u.email,
        role: u.role || "member",
        status: u.status || "active",
        avatar: u.avatar_url || null,
      }));
      setMembers(mapped);
    } catch {
      toast.error("Failed to load team members");
    } finally {
      setIsLoading(false);
    }
  }, [token, orgId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const removeMember = async (id: string) => {
    if (!token || !orgId) return;
    try {
      await usersApi.deleteUser(id, token, orgId);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast.success("Member removed");
    } catch {
      toast.error("Failed to remove member");
    }
  };

  const inviteMember = async (data: { email: string; role: string }) => {
    if (!token || !orgId) return;
    try {
      await usersApi.createUser(
        { email: data.email, role: data.role, first_name: data.email.split("@")[0] },
        token,
        orgId,
      );
      setShowInviteModal(false);
      toast.success("Invitation sent successfully");
      await fetchMembers(); // Refresh list from API
    } catch {
      toast.error("Failed to invite member");
    }
  };

  const updateRole = async (userId: string, role: string) => {
    if (!token || !orgId) return;
    try {
      await usersApi.updateRole(userId, role, token, orgId);
      setMembers((prev) => 
        prev.map((m) => (m.id === userId ? { ...m, role } : m))
      );
      toast.success("Member role updated");
    } catch {
      toast.error("Failed to update role");
    }
  };

  return {
    members,
    isLoading,
    showInviteModal,
    setShowInviteModal,
    removeMember,
    inviteMember,
    updateRole,
  };
};
