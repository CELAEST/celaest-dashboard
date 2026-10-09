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
import { useTranslations } from "next-intl";

/**
 * Account & Profile Settings Tab
 *
 * Matches the design reference with dark theme and cyan accents.
 */
export function AccountProfile() {
  const t = useTranslations("settings");
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/80"></div>
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
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-white text-black hover:bg-neutral-200 active:scale-[0.98] transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-jakarta"
          >
            {form.formState.isSubmitting ? t("saving") : t("save_changes")}
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
