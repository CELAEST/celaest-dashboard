import React, { memo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { SettingsModal } from "../../SettingsModal";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface EmailChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (email: string) => void;
}

export const EmailChangeModal: React.FC<EmailChangeModalProps> = memo(
  ({ isOpen, onClose, onConfirm }) => {
    const { isDark } = useTheme();
    const [newEmail, setNewEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");

    const handleConfirm = () => {
      onConfirm(newEmail);
      setNewEmail("");
      setCurrentPassword("");
    };

    return (
      <SettingsModal
        isOpen={isOpen}
        onClose={onClose}
        title="Change Email Address"
      >
        <div className="space-y-4">
          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              New Email Address
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="settings-input w-full rounded-lg px-4 py-3"
              placeholder="your.new@email.com"
            />
          </div>

          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="settings-input w-full rounded-lg px-4 py-3"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <AlertCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
            <p
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              A verification link will be sent to{" "}
              <strong className="text-cyan-500 font-bold">
                {newEmail || "your new email"}
              </strong>
              . You must click it to complete the change.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                isDark
                  ? "border-white/10 text-gray-300 hover:bg-white/5"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!newEmail || !currentPassword}
              className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Verification
            </button>
          </div>
        </div>
      </SettingsModal>
    );
  },
);

EmailChangeModal.displayName = "EmailChangeModal";
