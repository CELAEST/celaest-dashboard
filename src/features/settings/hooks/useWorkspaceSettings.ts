import { useState } from "react";
import { toast } from "sonner";
import { Member } from "../components/tabs/WorkspaceTeam/TeamMembers";

export const useWorkspaceSettings = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "Rowan Estaban",
      email: "rowan@celaest.io",
      role: "owner",
      status: "active",
      avatar: null,
    },
    {
      id: "2",
      name: "Sarah Chen",
      email: "sarah@celaest.io",
      role: "admin",
      status: "active",
      avatar: null,
    },
    {
      id: "3",
      name: "Marcus Miller",
      email: "marcus@company.com",
      role: "member",
      status: "pending",
      avatar: null,
    },
  ]);

  const removeMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const inviteMember = (data: { email: string; role: string }) => {
    const newMember: Member = {
      id: Date.now().toString(),
      name: data.email.split("@")[0],
      email: data.email,
      role: data.role,
      status: "pending",
      avatar: null,
    };
    setMembers([...members, newMember]);
    setShowInviteModal(false);
    toast.success("Invitation sent successfully");
  };

  return {
    members,
    showInviteModal,
    setShowInviteModal,
    removeMember,
    inviteMember,
  };
};
