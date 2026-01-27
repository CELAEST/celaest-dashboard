import React, { memo } from "react";
import { Mail, Shield } from "lucide-react";
import { SettingsModal } from "../../SettingsModal";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: () => void;
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  inviteRole: string;
  setInviteRole: (role: string) => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = memo(
  ({
    isOpen,
    onClose,
    onInvite,
    inviteEmail,
    setInviteEmail,
    inviteRole,
    setInviteRole,
  }) => {
    const { isDark } = useTheme();

    return (
      <SettingsModal
        isOpen={isOpen}
        onClose={onClose}
        title="Invite New Member"
      >
        <div className="space-y-6">
          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                autoFocus
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inviteEmail) onInvite();
                }}
                className="settings-input w-full rounded-xl pl-12 pr-4 py-3"
                placeholder="colleague@company.com"
              />
            </div>
          </div>

          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-3 block font-bold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
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
                      className={`w-4 h-4 ${
                        inviteRole === role.id
                          ? "text-cyan-500"
                          : "text-gray-500"
                      }`}
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
              onClick={onClose}
              className={`flex-1 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                isDark
                  ? "border-white/10 text-gray-300 hover:bg-white/5"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onInvite}
              disabled={!inviteEmail}
              className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white font-black shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              Send Invitation
            </button>
          </div>
        </div>
      </SettingsModal>
    );
  },
);

InviteMemberModal.displayName = "InviteMemberModal";
