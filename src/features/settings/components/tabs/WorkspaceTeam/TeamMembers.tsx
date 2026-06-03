import React, { memo } from "react";
import { Users, UserPlus, Trash } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string | null;
}

interface TeamMembersProps {
  members: Member[];
  onRemoveMember?: (id: string) => void;
  onUpdateRole?: (id: string, role: string) => void;
  onInviteClick?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  readOnly?: boolean;
}

export const TeamMembers: React.FC<TeamMembersProps> = memo(
  ({
    members,
    onRemoveMember,
    onUpdateRole,
    onInviteClick,
    readOnly = false,
  }) => {
    const { isDark } = useTheme();
    const t = useTranslations("settings");

    return (
      <div className="settings-glass-card rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h3
              className={`text-lg font-bold flex items-center gap-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <Users className="w-5 h-5 text-cyan-500" />
              {t("team_members")}
            </h3>
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {t("team_members_desc")}
            </p>
          </div>
          <button
            onClick={onInviteClick}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold transition-all shadow-sm active:scale-95 w-full sm:w-auto shrink-0"
          >
            <UserPlus size={16} />
            {t("invite_member")}
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className={`p-3 sm:p-4 rounded-xl border transition-all ${
                isDark
                  ? "bg-black/20 border-white/5"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              {/* Mobile: stacked layout / Desktop: horizontal row */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm shrink-0 text-sm ${
                    member.role === "owner"
                      ? "bg-linear-to-br from-cyan-500 to-blue-500"
                      : "bg-gray-500"
                  }`}
                >
                  {member.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={`font-bold text-sm truncate ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {member.name}
                    </p>
                    {member.status === "pending" && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                        {t("pending_badge")}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs truncate ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {member.email}
                  </p>
                </div>

                {/* Desktop: role + delete inline */}
                <div className="hidden sm:flex items-center gap-3 shrink-0">
                  {member.role === "owner" || readOnly ? (
                    <div
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border transition-all ${
                        member.role === "owner"
                          ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
                          : isDark
                            ? "bg-gray-800 text-gray-500 border-white/5"
                            : "bg-gray-200 text-gray-500 border-gray-100"
                      }`}
                    >
                      {member.role}
                    </div>
                  ) : (
                    <select
                      value={member.role}
                      onChange={(e) =>
                        onUpdateRole && onUpdateRole(member.id, e.target.value)
                      }
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-500/50 ${
                        member.role === "admin"
                          ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                          : isDark
                            ? "bg-gray-800 text-gray-500 border-white/5"
                            : "bg-gray-200 text-gray-500 border-gray-100"
                      }`}
                    >
                      <option value="admin">{t("role_admin")}</option>
                      <option value="manager">{t("role_manager")}</option>
                      <option value="operator">{t("role_operator")}</option>
                      <option value="viewer">{t("role_viewer")}</option>
                    </select>
                  )}
                  {member.role !== "owner" && !readOnly && (
                    <button
                      onClick={() => onRemoveMember && onRemoveMember(member.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark
                          ? "text-gray-600 hover:text-red-400 hover:bg-red-500/10"
                          : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <Trash size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile: role + delete below the name row */}
              <div className="flex sm:hidden items-center justify-between mt-3 pt-3 border-t border-dashed border-white/5 dark:border-white/5">
                {member.role === "owner" || readOnly ? (
                  <div
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${
                      member.role === "owner"
                        ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
                        : isDark
                          ? "bg-gray-800 text-gray-500 border-white/5"
                          : "bg-gray-200 text-gray-500 border-gray-100"
                    }`}
                  >
                    {member.role}
                  </div>
                ) : (
                  <select
                    value={member.role}
                    onChange={(e) =>
                      onUpdateRole && onUpdateRole(member.id, e.target.value)
                    }
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase border cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-500/50 ${
                      member.role === "admin"
                        ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                        : isDark
                          ? "bg-gray-800 text-gray-500 border-white/5"
                          : "bg-gray-200 text-gray-500 border-gray-100"
                    }`}
                  >
                    <option value="admin">{t("role_admin")}</option>
                    <option value="manager">{t("role_manager")}</option>
                    <option value="operator">{t("role_operator")}</option>
                    <option value="viewer">{t("role_viewer")}</option>
                  </select>
                )}
                {member.role !== "owner" && !readOnly && (
                  <button
                    onClick={() => onRemoveMember && onRemoveMember(member.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? "text-gray-600 hover:text-red-400 hover:bg-red-500/10"
                        : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                    }`}
                  >
                    <Trash size={16} />
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
