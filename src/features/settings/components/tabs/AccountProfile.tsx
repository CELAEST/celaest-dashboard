"use client";

import React, { useState } from "react";
import { useProfileSettings } from "../../hooks/useProfileSettings";
import { ProfileAvatar } from "./AccountProfile/ProfileAvatar";
import { ProfilePersonalInfo } from "./AccountProfile/ProfilePersonalInfo";
import { ProfileSecurity } from "./AccountProfile/ProfileSecurity";
import { EmailChangeModal } from "./AccountProfile/EmailChangeModal";

/**
 * Account & Profile Settings Tab
 *
 * Matches the design reference with dark theme and cyan accents.
 */
export function AccountProfile() {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const {
    avatarUrl,
    connectedAccounts,
    handleAvatarUpload,
    handleRemoveAvatar,
    handleEmailChange,
    toggleAccount,
    saveProfile,
  } = useProfileSettings();

  const onEmailConfirm = (email: string) => {
    handleEmailChange(email);
    setShowEmailModal(false);
  };

  return (
    <div className="space-y-6">
      <ProfileAvatar
        avatarUrl={avatarUrl}
        onUpload={handleAvatarUpload}
        onRemove={handleRemoveAvatar}
      />

      <ProfilePersonalInfo
        displayName="Rowan Estaban"
        jobTitle="Digital Architect"
      />

      <ProfileSecurity
        email="rowan@celaest.io"
        connectedAccounts={connectedAccounts}
        onToggleAccount={toggleAccount}
        onChangeEmail={() => setShowEmailModal(true)}
      />

      {/* Save Button */}
      <div className="flex justify-end pb-8">
        <button
          onClick={saveProfile}
          className="px-8 py-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all active:scale-95"
        >
          Save Changes
        </button>
      </div>

      <EmailChangeModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onConfirm={onEmailConfirm}
      />
    </div>
  );
}
