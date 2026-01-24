"use client";

import React, { useState, useRef } from "react";
import { User, Upload, Trash2, Mail, AlertCircle, Github } from "lucide-react";
import Image from "next/image";
import { SettingsModal } from "../SettingsModal";

/**
 * Account & Profile Settings Tab
 *
 * Matches the design reference with dark theme and cyan accents.
 */
export function AccountProfile() {
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
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-cyan-400" />
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
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
          </div>

          {/* Upload Controls */}
          <div>
            <p className="text-gray-400 text-sm mb-3">
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
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-medium transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload Photo
              </button>
              {avatarUrl && (
                <button
                  onClick={() => setAvatarUrl(null)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-gray-300 text-sm font-medium hover:bg-white/5 transition-colors"
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
        <h3 className="text-lg font-bold text-white mb-6">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              Display Name *
            </label>
            <input
              type="text"
              defaultValue="Rowan Estaban"
              className="w-full rounded-lg px-4 py-3 text-white bg-[#0d0d0d] border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              Job Title
            </label>
            <input
              type="text"
              defaultValue="Digital Architect"
              className="w-full rounded-lg px-4 py-3 text-white bg-[#0d0d0d] border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors"
              placeholder="Your role"
            />
          </div>
        </div>
      </div>

      {/* Email & Authentication */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Mail className="w-5 h-5 text-cyan-400" />
          Email & Authentication
        </h3>

        <div className="space-y-6">
          {/* Primary Email */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              Primary Email
            </label>
            <div className="flex items-center gap-3">
              <input
                type="email"
                value="rowan@celaest.io"
                disabled
                className="flex-1 rounded-lg px-4 py-3 text-gray-400 bg-[#0d0d0d] border border-white/10"
              />
              <button
                onClick={() => setShowEmailModal(true)}
                className="px-5 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-medium transition-colors whitespace-nowrap"
              >
                Change Email
              </button>
            </div>
          </div>

          {/* Connected Accounts */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">
              Connected Accounts
            </label>
            <div className="space-y-3">
              {/* Google */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0d0d0d] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
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
                    <p className="text-white font-medium text-sm">Google</p>
                    <p className="text-xs text-gray-500">
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
                      ? "bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/10"
                      : "bg-transparent border border-gray-600 text-gray-300 hover:bg-white/5"
                  }`}
                >
                  {connectedAccounts.google ? "Disconnect" : "Connect"}
                </button>
              </div>

              {/* GitHub */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0d0d0d] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                    <Github className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">GitHub</p>
                    <p className="text-xs text-gray-500">
                      {connectedAccounts.github ? "rowan-dev" : "Not connected"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleAccount("github")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    connectedAccounts.github
                      ? "bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/10"
                      : "bg-transparent border border-gray-600 text-gray-300 hover:bg-white/5"
                  }`}
                >
                  {connectedAccounts.github ? "Disconnect" : "Connect"}
                </button>
              </div>
            </div>
          </div>

          {/* OAuth Info */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-linear-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/20">
            <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-cyan-400 font-medium mb-1">
                Sign in with OAuth
              </p>
              <p className="text-xs text-gray-400">
                Connect your Google or GitHub account for faster sign-in and
                enhanced security.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-8 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
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
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              New Email Address
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-white bg-[#0d0d0d] border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors"
              placeholder="your.new@email.com"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-white bg-[#0d0d0d] border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400">
              A verification link will be sent to{" "}
              <strong className="text-cyan-400">
                {newEmail || "your new email"}
              </strong>
              . You must click it to complete the change.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowEmailModal(false)}
              className="flex-1 px-4 py-3 rounded-xl bg-transparent border border-gray-600 text-gray-300 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEmailChange}
              disabled={!newEmail || !currentPassword}
              className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Verification
            </button>
          </div>
        </div>
      </SettingsModal>
    </div>
  );
}
