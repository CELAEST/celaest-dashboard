"use client";

import React, { useState } from "react";
import { Users, Mail, UserPlus, Shield, Globe, Trash2 } from "lucide-react";
import { SettingsModal } from "../SettingsModal";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { toast } from "sonner";

/**
 * Workspace & Team Settings Tab
 */
export function WorkspaceTeam() {
  const { isDark } = useTheme();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  const [members, setMembers] = useState([
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

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleInvite = () => {
    if (inviteEmail) {
      const newMember = {
        id: Date.now().toString(),
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole,
        status: "pending",
        avatar: null,
      };
      setMembers([...members, newMember]);
      setInviteEmail("");
      setShowInviteModal(false);
      toast.success("Invitation sent successfully");
    }
  };

  return (
    <div className="space-y-6">
      {/* Workspace Profile */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          <Globe className="w-5 h-5 text-cyan-500" />
          Workspace Profile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Workspace Name
            </label>
            <input
              type="text"
              defaultValue="Celaest Headquarters"
              className="settings-input w-full rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Workspace URL
            </label>
            <div className="flex">
              <span
                className={`px-4 py-3 rounded-l-lg border-y border-l text-sm transition-colors ${
                  isDark
                    ? "bg-white/5 border-white/10 text-gray-500"
                    : "bg-gray-50 border-gray-200 text-gray-400"
                }`}
              >
                celaest.io/
              </span>
              <input
                type="text"
                defaultValue="hq"
                className="settings-input w-full rounded-r-lg px-4 py-3"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Team Management */}
      <div className="settings-glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3
              className={`text-lg font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              <Users className="w-5 h-5 text-cyan-500" />
              Team Members
            </h3>
            <p
              className={`text-sm mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Manage your team members and their access levels.
            </p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            <UserPlus size={16} />
            Invite Member
          </button>
        </div>

        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                isDark
                  ? "bg-black/20 border-white/5"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm transition-transform hover:scale-105 ${
                    member.role === "owner"
                      ? "bg-linear-to-br from-cyan-500 to-blue-500"
                      : "bg-gray-500"
                  }`}
                >
                  {member.name[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p
                      className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {member.name}
                    </p>
                    {member.status === "pending" && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        PENDING
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    {member.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${
                    member.role === "owner"
                      ? "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20"
                      : member.role === "admin"
                        ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                        : isDark
                          ? "bg-gray-800 text-gray-500"
                          : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {member.role}
                </div>
                {member.role !== "owner" && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? "text-gray-600 hover:text-red-400 hover:bg-red-500/10"
                        : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                    }`}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invitations Modal */}
      <SettingsModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite New Member"
      >
        <div className="space-y-6">
          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="settings-input w-full rounded-xl pl-12 pr-4 py-3"
                placeholder="colleague@company.com"
              />
            </div>
          </div>

          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-3 block font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Assigned Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "member", label: "Member", desc: "Can view and edit" },
                {
                  id: "admin",
                  label: "Admin",
                  desc: "Full access to settings",
                },
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => setInviteRole(role.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    inviteRole === role.id
                      ? "bg-cyan-500/10 border-cyan-500 shadow-sm"
                      : isDark
                        ? "bg-black/40 border-white/5 hover:border-white/10"
                        : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Shield
                      className={`w-4 h-4 ${inviteRole === role.id ? "text-cyan-500" : "text-gray-500"}`}
                    />
                    <span
                      className={`text-sm font-bold ${
                        inviteRole === role.id
                          ? isDark
                            ? "text-white"
                            : "text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {role.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500">{role.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowInviteModal(false)}
              className={`flex-1 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                isDark
                  ? "border-white/10 text-gray-300 hover:bg-white/5"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              disabled={!inviteEmail}
              className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white font-black shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              Send Invitation
            </button>
          </div>
        </div>
      </SettingsModal>
    </div>
  );
}
