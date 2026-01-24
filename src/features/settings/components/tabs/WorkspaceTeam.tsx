"use client";

import React, { useState } from "react";
import { Users, Mail, UserPlus, Crown, Eye, Trash2 } from "lucide-react";
import { SettingsSelect } from "../SettingsSelect";
import type { TeamMember, TeamRole } from "../../types";

/**
 * Workspace & Team Settings Tab
 */
export function WorkspaceTeam() {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Rowan Estaban",
      email: "rowan@celaest.io",
      role: "admin",
      status: "active",
    },
    {
      id: "2",
      name: "Alex Rivera",
      email: "alex@celaest.io",
      role: "admin",
      status: "active",
    },
    {
      id: "3",
      name: "Sam Chen",
      email: "sam@celaest.io",
      role: "viewer",
      status: "active",
    },
    {
      id: "4",
      name: "Jordan Taylor",
      email: "jordan@example.com",
      role: "viewer",
      status: "invited",
    },
  ]);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamRole>("viewer");

  const handleInvite = () => {
    if (inviteEmail) {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole,
        status: "invited",
      };
      setMembers([...members, newMember]);
      setInviteEmail("");
      setInviteRole("viewer");
    }
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const getRoleIcon = (role: TeamRole) => {
    return role === "admin" ? (
      <Crown className="w-4 h-4" />
    ) : (
      <Eye className="w-4 h-4" />
    );
  };

  const getRoleStyles = (role: TeamRole) => {
    return role === "admin"
      ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
      : "bg-purple-500/10 border-purple-500/20 text-purple-400";
  };

  const activeMembers = members.filter((m) => m.status === "active").length;
  const pendingInvites = members.filter((m) => m.status === "invited").length;
  const adminCount = members.filter((m) => m.role === "admin").length;

  return (
    <div className="space-y-6">
      {/* Workspace Info */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          Workspace Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0d0d0d] border border-white/5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Total Members
            </p>
            <p className="text-2xl font-bold text-white">{activeMembers}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#0d0d0d] border border-white/5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Pending Invites
            </p>
            <p className="text-2xl font-bold text-orange-400">
              {pendingInvites}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#0d0d0d] border border-white/5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Admins
            </p>
            <p className="text-2xl font-bold text-cyan-400">{adminCount}</p>
          </div>
        </div>
      </div>

      {/* Invite New Member */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-cyan-400" />
          Invite Team Member
        </h3>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full rounded-lg pl-11 pr-4 py-3 text-white bg-[#0d0d0d] border border-white/10 focus:border-cyan-400 focus:outline-none"
                placeholder="colleague@company.com"
              />
            </div>
          </div>

          <div className="md:w-48">
            <SettingsSelect
              label="Role"
              options={[
                { value: "viewer", label: "Viewer" },
                { value: "admin", label: "Admin" },
              ]}
              value={inviteRole}
              onChange={(value) => setInviteRole(value as TeamRole)}
            />
          </div>

          <div className="md:pt-6">
            <button
              onClick={handleInvite}
              disabled={!inviteEmail}
              className="w-full md:w-auto px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Send Invite
            </button>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
          <p className="text-xs text-gray-400">
            <strong className="text-cyan-400">Roles:</strong> Admins have full
            access to settings and can manage team members. Viewers can only
            view data.
          </p>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Team Members</h3>

        <div className="space-y-2">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
            <div className="col-span-5">Member</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Table Rows */}
          {members.map((member) => (
            <div
              key={member.id}
              className="p-4 rounded-xl bg-[#0d0d0d] border border-white/5 hover:bg-white/5 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Member Info */}
                <div className="md:col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {member.email}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div className="md:col-span-3">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${getRoleStyles(
                      member.role,
                    )}`}
                  >
                    {getRoleIcon(member.role)}
                    <span className="text-xs font-medium capitalize">
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="md:col-span-3">
                  {member.status === "active" ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-medium text-emerald-400">
                        Active
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <Mail className="w-3 h-3 text-orange-400" />
                      <span className="text-xs font-medium text-orange-400">
                        Invited
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="md:col-span-1 flex justify-end">
                  {member.id !== "1" && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
