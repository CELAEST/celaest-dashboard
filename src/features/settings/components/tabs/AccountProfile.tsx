"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useProfileSettings } from "../../hooks/useProfileSettings";
import { ProfileAvatar } from "./AccountProfile/ProfileAvatar";
import { ProfilePersonalInfo } from "./AccountProfile/ProfilePersonalInfo";
import { ProfileSecurity } from "./AccountProfile/ProfileSecurity";
import { EmailChangeModal } from "./AccountProfile/EmailChangeModal";
import {
  ProfileFormData,
  profileSchema,
} from "@/lib/validation/schemas/settings";
import { zodResolver } from "@hookform/resolvers/zod";

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

  // Initialize Form
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "Rowan Estaban",
      jobTitle: "Digital Architect",
    },
    mode: "onBlur",
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log("Saving profile data:", data);
    // In real app, we would pass data to saveProfile(data)
    saveProfile();
  };

  const onEmailConfirm = (email: string) => {
    handleEmailChange(email);
    setShowEmailModal(false);
  };

  return (
    <div className="space-y-6">
      <FormProvider {...form}>
        <ProfileAvatar
          avatarUrl={avatarUrl}
          onUpload={handleAvatarUpload}
          onRemove={handleRemoveAvatar}
        />

        <ProfilePersonalInfo />

        <ProfileSecurity
          email="rowan@celaest.io"
          connectedAccounts={connectedAccounts}
          onToggleAccount={toggleAccount}
          onChangeEmail={() => setShowEmailModal(true)}
        />

        {/* Save Button */}
        <div className="flex justify-end pb-8">
          <button
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
            className="px-8 py-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <EmailChangeModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onConfirm={onEmailConfirm}
        />
      </FormProvider>
    </div>
  );
}
