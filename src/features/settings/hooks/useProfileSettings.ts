import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useApiAuth } from "@/lib/use-api-auth";
import { settingsApi } from "../api/settings.api";
import { UserData } from "@/features/users/components/types";
import { ProfileFormData } from "@/lib/validation/schemas/settings";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export const useProfileSettings = () => {
  const { token, isReady } = useApiAuth();
  const [profile, setProfile] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("account");

  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();

  const connectedAccounts = useMemo(() => {
    return profile?.identities?.reduce((acc, identity) => {
      if (identity.provider === "google" || identity.provider === "github") {
        acc[identity.provider] = true;
      }
      return acc;
    }, { google: false, github: false } as Record<"google" | "github", boolean>) || { google: false, github: false };
  }, [profile]);

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await settingsApi.getMe(token);
      setProfile(data);
      if (data.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching profile:", err);
      // The following lines seem to be from a different hook (preferences) and are not applicable here.
      // Keeping the original error handling for profile fetching.
      setError("Failed to load profile");
      toast.error("Failed to load profile settings");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isReady) {
      fetchProfile();
    }
  }, [isReady, fetchProfile]);

  const handleAvatarUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarUrl(reader.result as string);
          toast.success("Profile picture preview updated");
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  const handleRemoveAvatar = useCallback(() => {
    setAvatarUrl(null);
    toast.success("Profile picture removed");
  }, []);

  const handleEmailChange = useCallback(async (newEmail: string) => {
    setIsAuthLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      
      toast.success(`Verification email sent to ${newEmail}. Please check both your current and new inbox.`);
    } catch (err) {
      console.error("Error changing email:", err);
      toast.error(err instanceof Error ? err.message : "Failed to initiate email change");
    } finally {
      setIsAuthLoading(false);
    }
  }, [supabase]);

  const toggleAccount = useCallback(async (provider: "google" | "github") => {
    if (connectedAccounts[provider]) {
      if (!token) return;
      setIsAuthLoading(true);
      try {
        await settingsApi.unlinkProvider(provider, token);
        toast.success(`${provider} account disconnected`);
        fetchProfile(); // Refresh to update identities
      } catch (err) {
        console.error(`Error unlinking ${provider}:`, err);
        toast.error(`Failed to disconnect ${provider}`);
      } finally {
        setIsAuthLoading(false);
      }
    } else {
      setIsAuthLoading(true);
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/?tab=settings`,
            queryParams: {
              prompt: 'select_account'
            }
          }
        });
        if (error) throw error;
      } catch (err) {
        console.error(`Error connecting ${provider}:`, err);
        toast.error(`Failed to connect ${provider}`);
        setIsAuthLoading(false);
      }
    }
  }, [token, connectedAccounts, fetchProfile, supabase]);

  const saveProfile = useCallback(async (data: ProfileFormData) => {
    if (!token) return;
    try {
      // Map frontend fields to backend
      const updateData: Partial<UserData> = {
        display_name: data.displayName,
        job_title: data.jobTitle || undefined,
        first_name: profile?.first_name || undefined,
        last_name: profile?.last_name || undefined,
        avatar_url: avatarUrl || undefined,
      };
      
      const updatedUser = await settingsApi.updateMe(updateData, token);
      setProfile(updatedUser);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("Failed to update profile");
    }
  }, [token, avatarUrl, profile]);

  return {
    profile,
    isLoading,
    error,
    avatarUrl,
    activeTab,
    setActiveTab,
    connectedAccounts,
    isAuthLoading,
    handleAvatarUpload,
    handleRemoveAvatar,
    handleEmailChange,
    toggleAccount,
    saveProfile,
    refresh: fetchProfile,
  };
};
