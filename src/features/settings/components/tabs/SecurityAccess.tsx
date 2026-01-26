"use client";

import React, { useState } from "react";
import {
  Shield,
  Key,
  Smartphone,
  History,
  AlertTriangle,
  LogOut,
  RefreshCcw,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { SettingsModal } from "../SettingsModal";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { toast } from "sonner";

/**
 * Security & Access Settings Tab
 */
export function SecurityAccess() {
  const { isDark } = useTheme();

  const [faEnabled, setFaEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [sessions, setSessions] = useState([
    {
      id: "1",
      device: "MacBook Pro 16",
      location: "Madrid, Spain",
      ip: "192.168.1.1",
      current: true,
      lastActive: "Active now",
    },
    {
      id: "2",
      device: "iPhone 15 Pro",
      location: "Madrid, Spain",
      ip: "192.168.1.5",
      current: false,
      lastActive: "2 hours ago",
    },
  ]);

  const handleLogoutSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  const handle2FAToggle = () => {
    if (faEnabled) {
      setFaEnabled(false);
    } else {
      setShow2FAModal(true);
    }
  };

  const handleEnable2FA = () => {
    setFaEnabled(true);
    setShow2FAModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Password Management */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          <Key className="w-5 h-5 text-cyan-500" />
          Update Password
        </h3>

        <div className="space-y-4 max-w-xl">
          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Current Password
            </label>
            <input
              type="password"
              className="settings-input w-full rounded-lg px-4 py-3 font-mono"
              placeholder="••••••••••••"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={`text-xs uppercase tracking-wider mb-2 block font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                New Password
              </label>
              <input
                type="password"
                className="settings-input w-full rounded-lg px-4 py-3 font-mono"
                placeholder="••••••••••••"
              />
            </div>
            <div>
              <label
                className={`text-xs uppercase tracking-wider mb-2 block font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Confirm New Password
              </label>
              <input
                type="password"
                className="settings-input w-full rounded-lg px-4 py-3 font-mono"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => toast.success("Password updated successfully")}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold transition-all shadow-sm active:scale-95"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="settings-glass-card rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                isDark ? "bg-cyan-500/10" : "bg-cyan-50"
              }`}
            >
              <Smartphone
                className={`w-6 h-6 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
              />
            </div>
            <div>
              <h3
                className={`text-lg font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Two-Factor Authentication (2FA)
              </h3>
              <p
                className={`text-sm mb-4 max-w-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Add an extra layer of security to your account. We&apos;ll ask
                for a code from your authenticator app when you sign in from a
                new device.
              </p>
              <div
                onClick={handle2FAToggle}
                className={`settings-toggle-switch ${faEnabled ? "active" : ""}`}
              >
                <div className="settings-toggle-thumb" />
              </div>
            </div>
          </div>
          <div
            className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5 transition-all ${
              faEnabled
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                : isDark
                  ? "bg-gray-800 text-gray-500"
                  : "bg-gray-100 text-gray-400"
            }`}
          >
            {faEnabled && <ShieldCheck size={12} />}
            {faEnabled ? "SECURED" : "NOT ENABLED"}
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          <Shield className="w-5 h-5 text-cyan-500" />
          Active Sessions
        </h3>

        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all hover:border-cyan-500/30 ${
                isDark
                  ? "bg-black/20 border-white/5"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-sm ${
                    isDark ? "bg-gray-800" : "bg-white border border-gray-100"
                  }`}
                >
                  <History
                    className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p
                      className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {session.device}
                    </p>
                    {session.current && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isDark
                            ? "bg-cyan-500/20 text-cyan-400"
                            : "bg-cyan-100 text-cyan-600"
                        }`}
                      >
                        CURRENT DEVICE
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    {session.location} • {session.ip} • {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.current && (
                <button
                  onClick={() => handleLogoutSession(session.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isDark
                      ? "text-red-400 hover:bg-red-500/10 border border-red-500/20"
                      : "text-red-600 hover:bg-red-50 border border-red-200 shadow-xs"
                  }`}
                >
                  <LogOut size={14} />
                  Terminate
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Security Logs */}
      <div className="settings-glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-lg font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Security Logs
          </h3>
          <button
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "hover:bg-white/5 text-gray-500"
                : "hover:bg-gray-100 text-gray-400"
            }`}
          >
            <RefreshCcw size={16} />
          </button>
        </div>

        <div className="space-y-1">
          {[
            {
              event: "Password changed successfully",
              time: "Dec 24, 2023 at 14:32",
              type: "auth",
            },
            {
              event: "New login from Madrid, Spain",
              time: "Dec 22, 2023 at 09:15",
              type: "login",
            },
            {
              event: "Two-factor authentication disabled",
              time: "Dec 15, 2023 at 18:40",
              type: "security",
            },
          ].map((log, i) => (
            <div
              key={i}
              className={`flex items-center justify-between py-4 border-b last:border-0 transition-colors ${
                isDark ? "border-white/5" : "border-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    log.type === "auth"
                      ? "bg-emerald-500"
                      : log.type === "login"
                        ? "bg-cyan-500"
                        : "bg-amber-500"
                  }`}
                />
                <div>
                  <p
                    className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {log.event}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5 tracking-tight font-mono">
                    {log.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2FA Setup Modal */}
      <SettingsModal
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        title="Enable Two-Factor Authentication"
      >
        <div className="space-y-6">
          <div className="text-center">
            <p
              className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}
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
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
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
              onClick={() => setShow2FAModal(false)}
              className={`flex-1 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                isDark
                  ? "border-white/10 text-gray-300 hover:bg-white/5"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleEnable2FA}
              className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white font-black shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
            >
              Verify & Enable
            </button>
          </div>
        </div>
      </SettingsModal>
    </div>
  );
}
