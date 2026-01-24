"use client";

import React, { useState } from "react";
import {
  Lock,
  Smartphone,
  MonitorSmartphone,
  LogOut,
  QrCode,
  AlertTriangle,
} from "lucide-react";
import { SettingsModal } from "../SettingsModal";
import type { Session } from "../../types";

/**
 * Security & Access Settings Tab
 */
export function SecurityAccess() {
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [sessions] = useState<Session[]>([
    {
      id: "1",
      device: "Chrome on macOS",
      location: "San Francisco, CA",
      ip: "192.168.1.100",
      lastActive: "2 minutes ago",
      current: true,
    },
    {
      id: "2",
      device: "Safari on iPhone 15 Pro",
      location: "San Francisco, CA",
      ip: "192.168.1.105",
      lastActive: "3 hours ago",
      current: false,
    },
    {
      id: "3",
      device: "Firefox on Windows",
      location: "New York, NY",
      ip: "10.0.0.42",
      lastActive: "2 days ago",
      current: false,
    },
  ]);

  const handlePasswordChange = () => {
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handle2FASetup = () => {
    setTwoFactorEnabled(true);
    setShow2FAModal(false);
  };

  const handle2FAToggle = () => {
    if (twoFactorEnabled) {
      setTwoFactorEnabled(false);
    } else {
      setShow2FAModal(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-cyan-400" />
          Password
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium mb-1">Change Password</p>
            <p className="text-sm text-gray-500">Last changed 3 months ago</p>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2.5 rounded-lg bg-transparent border border-gray-600 text-gray-300 hover:text-white hover:border-cyan-400/50 transition-colors text-sm font-medium"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-cyan-400" />
          Two-Factor Authentication (2FA)
        </h3>

        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <p className="text-white font-medium">Authenticator App</p>
              {twoFactorEnabled && (
                <span className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  Active
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {twoFactorEnabled
                ? "Your account is protected with two-factor authentication."
                : "Add an extra layer of security using an authenticator app."}
            </p>
            {!twoFactorEnabled && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />
                <p className="text-xs text-gray-400">
                  Recommended: Enable 2FA to protect your account.
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handle2FAToggle}
            className={`settings-toggle-switch ${
              twoFactorEnabled ? "active" : ""
            }`}
            role="switch"
            aria-checked={twoFactorEnabled}
          >
            <div className="settings-toggle-thumb" />
          </button>
        </div>
      </div>

      {/* Session Management */}
      <div className="settings-glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MonitorSmartphone className="w-5 h-5 text-cyan-400" />
            Active Sessions
          </h3>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-transparent border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors">
            <LogOut className="w-4 h-4" />
            Log Out All Devices
          </button>
        </div>

        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-start justify-between p-4 rounded-xl bg-[#0d0d0d] border border-white/5"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <MonitorSmartphone className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-medium text-sm">
                      {session.device}
                    </p>
                    {session.current && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    {session.location} • {session.ip}
                  </p>
                  <p className="text-xs text-gray-600">
                    Last active {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.current && (
                <button className="text-red-400 hover:text-red-300 transition-colors p-1">
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
          <p className="text-xs text-gray-400">
            <strong className="text-cyan-400">Pro Tip:</strong> If you see
            unfamiliar activity, immediately log out all devices and change your
            password.
          </p>
        </div>
      </div>

      {/* Password Change Modal */}
      <SettingsModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-white bg-[#0d0d0d] border border-white/10 focus:border-cyan-400 focus:outline-none"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-white bg-[#0d0d0d] border border-white/10 focus:border-cyan-400 focus:outline-none"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-white bg-[#0d0d0d] border border-white/10 focus:border-cyan-400 focus:outline-none"
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="flex-1 px-4 py-3 rounded-xl bg-transparent border border-gray-600 text-gray-300 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordChange}
              disabled={
                !currentPassword ||
                !newPassword ||
                newPassword !== confirmPassword
              }
              className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Change Password
            </button>
          </div>
        </div>
      </SettingsModal>

      {/* 2FA Setup Modal */}
      <SettingsModal
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        title="Enable Two-Factor Authentication"
      >
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-6">
              Scan this QR code with your authenticator app
            </p>

            <div className="inline-flex items-center justify-center p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 mb-4">
              <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center">
                <QrCode className="w-32 h-32 text-gray-800" />
              </div>
            </div>

            <div className="bg-[#0d0d0d] rounded-xl p-4 mb-4 border border-white/10">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Manual Entry Code
              </p>
              <code className="text-cyan-400 font-mono text-sm">
                JBSW Y3DP EHPK 3PXP
              </code>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              Verification Code
            </label>
            <input
              type="text"
              className="w-full rounded-lg px-4 py-3 text-white bg-[#0d0d0d] border border-white/10 focus:border-cyan-400 focus:outline-none text-center font-mono text-lg tracking-widest"
              placeholder="000 000"
              maxLength={6}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShow2FAModal(false)}
              className="flex-1 px-4 py-3 rounded-xl bg-transparent border border-gray-600 text-gray-300 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handle2FASetup}
              className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white font-medium"
            >
              Enable 2FA
            </button>
          </div>
        </div>
      </SettingsModal>
    </div>
  );
}
