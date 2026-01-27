import React, { memo } from "react";
import { Users, UserPlus, Trash2 } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: null;
}

interface TeamMembersProps {
  members: Member[];
  onRemoveMember: (id: string) => void;
  onInviteClick: () => void;
}

export const TeamMembers: React.FC<TeamMembersProps> = memo(
  ({ members, onRemoveMember, onInviteClick }) => {
    const { isDark } = useTheme();

    return (
      <div className="settings-glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3
              className={`text-lg font-bold flex items-center gap-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <Users className="w-5 h-5 text-cyan-500" />
              Team Members
            </h3>
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Manage your team members and their access levels.
            </p>
          </div>
          <button
            onClick={onInviteClick}
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
                      className={`font-bold text-sm ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
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
                    className={`text-xs ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
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
                    onClick={() => onRemoveMember(member.id)}
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
    );
  },
);

TeamMembers.displayName = "TeamMembers";
