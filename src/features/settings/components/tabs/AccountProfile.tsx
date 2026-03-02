"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
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
    profile,
    isLoading,
    error,
    avatarUrl,
    connectedAccounts,
    isAuthLoading,
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
      displayName: "",
      jobTitle: "",
    },
    mode: "onBlur",
  });

  // Sync form with profile data when it arrives
  React.useEffect(() => {
    if (profile) {
      form.reset({
        displayName: profile.display_name || "",
        jobTitle: profile.job_title || "",
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormData) => {
    await saveProfile(data);
  };

  const onEmailConfirm = (email: string) => {
    handleEmailChange(email);
    setShowEmailModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-500/10 rounded-2xl border border-red-500/20">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <ProfileAvatar
          avatarUrl={avatarUrl}
          onUpload={handleAvatarUpload}
          onRemove={handleRemoveAvatar}
        />

        <ProfilePersonalInfo />

        <ProfileSecurity
          email={profile?.email || ""}
          identities={(profile?.identities || []).map((id) => ({
            ...id,
            last_login_at: id.last_login_at || undefined,
          }))}
          connectedAccounts={connectedAccounts}
          isAuthLoading={isAuthLoading}
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
      </Form>
    </div>
  );
}
