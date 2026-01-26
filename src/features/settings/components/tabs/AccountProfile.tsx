"use client";

import React, { useState, useRef } from "react";
import { User, Upload, Trash2, Mail, AlertCircle, Github } from "lucide-react";
import Image from "next/image";
import { SettingsModal } from "../SettingsModal";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { toast } from "sonner";

/**
 * Account & Profile Settings Tab
 *
 * Matches the design reference with dark theme and cyan accents.
 */
export function AccountProfile() {
  const { isDark } = useTheme();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [connectedAccounts, setConnectedAccounts] = useState<
    Record<"google" | "github", boolean>
  >({
    google: true,
    github: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmailChange = () => {
    console.log("Email change requested:", newEmail);
    setShowEmailModal(false);
    setNewEmail("");
    setCurrentPassword("");
  };

  const toggleAccount = (provider: "google" | "github") => {
    setConnectedAccounts((prev) => ({
      ...prev,
      [provider]: !prev[provider],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          <User className="w-5 h-5 text-cyan-500" />
          Profile Picture
        </h3>

        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={64}
                height={64}
                className="rounded-full object-cover ring-2 ring-cyan-500/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
          </div>

          {/* Upload Controls */}
          <div>
            <p
              className={`text-sm mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Upload a profile picture or use your initials as a fallback.
            </p>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-all shadow-sm hover:shadow-cyan-500/20"
              >
                <Upload className="w-4 h-4" />
                Upload Photo
              </button>
              {avatarUrl && (
                <button
                  onClick={() => setAvatarUrl(null)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    isDark
                      ? "border-white/10 text-gray-300 hover:bg-white/5"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-lg font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Display Name *
            </label>
            <input
              type="text"
              defaultValue="Rowan Estaban"
              className="settings-input w-full rounded-lg px-4 py-3"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Job Title
            </label>
            <input
              type="text"
              defaultValue="Digital Architect"
              className="settings-input w-full rounded-lg px-4 py-3"
              placeholder="Your role"
            />
          </div>
        </div>
      </div>

      {/* Email & Authentication */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          <Mail className="w-5 h-5 text-cyan-500" />
          Email & Authentication
        </h3>

        <div className="space-y-6">
          {/* Primary Email */}
          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Primary Email
            </label>
            <div className="flex items-center gap-3">
              <input
                type="email"
                value="rowan@celaest.io"
                disabled
                className="settings-input flex-1 rounded-lg px-4 py-3 opacity-60"
              />
              <button
                onClick={() => setShowEmailModal(true)}
                className="px-5 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-all shadow-sm hover:shadow-cyan-500/20 whitespace-nowrap"
              >
                Change Email
              </button>
            </div>
          </div>

          {/* Connected Accounts */}
          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-3 block font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Connected Accounts
            </label>
            <div className="space-y-3">
              {/* Google */}
              <div
                className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                  isDark
                    ? "bg-black/20 border-white/5"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${
                      isDark ? "bg-white/90" : "bg-white border border-gray-100"
                    }`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p
                      className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      Google
                    </p>
                    <p
                      className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      {connectedAccounts.google
                        ? "rowan@gmail.com"
                        : "Not connected"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleAccount("google")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    connectedAccounts.google
                      ? "text-red-500 hover:bg-red-500/10 border border-red-500/20"
                      : isDark
                        ? "text-gray-300 border border-white/10 hover:bg-white/5"
                        : "text-gray-600 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {connectedAccounts.google ? "Disconnect" : "Connect"}
                </button>
              </div>

              {/* GitHub */}
              <div
                className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                  isDark
                    ? "bg-black/20 border-white/5"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${
                      isDark ? "bg-white/10" : "bg-gray-900"
                    }`}
                  >
                    <Github className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p
                      className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      GitHub
                    </p>
                    <p
                      className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      {connectedAccounts.github ? "rowan-dev" : "Not connected"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleAccount("github")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    connectedAccounts.github
                      ? "text-red-500 hover:bg-red-500/10 border border-red-500/20"
                      : isDark
                        ? "text-gray-300 border border-white/10 hover:bg-white/5"
                        : "text-gray-600 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {connectedAccounts.github ? "Disconnect" : "Connect"}
                </button>
              </div>
            </div>
          </div>

          {/* OAuth Info */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-linear-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
            <AlertCircle className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-cyan-600 dark:text-cyan-400 font-bold mb-1">
                Sign in with OAuth
              </p>
              <p
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Connect your Google or GitHub account for faster sign-in and
                enhanced security.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pb-8">
        <button
          onClick={() => toast.success("Profile updated successfully")}
          className="px-8 py-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all active:scale-95"
        >
          Save Changes
        </button>
      </div>

      {/* Email Change Modal */}
      <SettingsModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Change Email Address"
      >
        <div className="space-y-4">
          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
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
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
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
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
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
              onClick={() => setShowEmailModal(false)}
              className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                isDark
                  ? "border-white/10 text-gray-300 hover:bg-white/5"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleEmailChange}
              disabled={!newEmail || !currentPassword}
              className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Verification
            </button>
          </div>
        </div>
      </SettingsModal>
    </div>
  );
}
