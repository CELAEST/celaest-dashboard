import React, { memo, useState } from "react";
import { Smartphone, ShieldCheck, QrCode } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { SettingsModal } from "../../SettingsModal";

interface SecurityTwoFactorProps {
  isEnabled: boolean;
  onEnable: () => void;
  onDisable: () => void;
}

export const SecurityTwoFactor: React.FC<SecurityTwoFactorProps> = memo(
  ({ isEnabled, onEnable, onDisable }) => {
    const { isDark } = useTheme();
    const [showModal, setShowModal] = useState(false);

    const handleToggle = () => {
      if (isEnabled) {
        onDisable();
      } else {
        setShowModal(true);
      }
    };

    const handleVerify = () => {
      onEnable();
      setShowModal(false);
    };

    return (
      <>
        <div className="settings-glass-card rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                  isDark ? "bg-cyan-500/10" : "bg-cyan-50"
                }`}
              >
                <Smartphone
                  className={`w-6 h-6 ${
                    isDark ? "text-cyan-400" : "text-cyan-600"
                  }`}
                />
              </div>
              <div>
                <h3
                  className={`text-lg font-bold mb-1 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Two-Factor Authentication (2FA)
                </h3>
                <p
                  className={`text-sm mb-4 max-w-lg ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Add an extra layer of security to your account. We&apos;ll ask
                  for a code from your authenticator app when you sign in from a
                  new device.
                </p>
                <div
                  onClick={handleToggle}
                  className={`settings-toggle-switch ${
                    isEnabled ? "active" : ""
                  }`}
                >
                  <div className="settings-toggle-thumb" />
                </div>
              </div>
            </div>
            <div
              className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5 transition-all ${
                isEnabled
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : isDark
                    ? "bg-gray-800 text-gray-500"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {isEnabled && <ShieldCheck size={12} />}
              {isEnabled ? "SECURED" : "NOT ENABLED"}
            </div>
          </div>
        </div>

        <SettingsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Enable Two-Factor Authentication"
        >
          <div className="space-y-6">
            <div className="text-center">
              <p
                className={`text-sm mb-6 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Scan this QR code with your authenticator app (like Google
                Authenticator or Authy)
              </p>

              <div
                className={`inline-flex items-center justify-center p-6 rounded-2xl border mb-4 transition-colors ${
                  isDark
                    ? "bg-white border-white/10 shadow-lg shadow-cyan-500/10"
                    : "bg-white border-gray-100 shadow-xl shadow-gray-200/50"
                }`}
              >
                <div className="w-44 h-44 flex items-center justify-center">
                  <QrCode className="w-36 h-36 text-gray-900" />
                </div>
              </div>

              <div
                className={`rounded-xl p-4 mb-4 border transition-colors ${
                  isDark
                    ? "bg-black border-white/5"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">
                  Manual Entry Code
                </p>
                <code className="text-cyan-500 font-mono text-base font-black tracking-wider">
                  CELST-SECURE-KEY-2024
                </code>
              </div>
            </div>

            <div>
              <label
                className={`text-xs uppercase tracking-wider mb-2 block font-bold ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Verification Code
              </label>
              <input
                type="text"
                className="settings-input w-full rounded-xl px-4 py-4 text-center font-mono text-2xl tracking-[0.5em] font-black"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className={`flex-1 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                  isDark
                    ? "border-white/10 text-gray-300 hover:bg-white/5"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white font-black shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
              >
                Verify & Enable
              </button>
            </div>
          </div>
        </SettingsModal>
      </>
    );
  },
);

SecurityTwoFactor.displayName = "SecurityTwoFactor";
