import { logger } from "@/lib/logger";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiAuth } from "@/lib/use-api-auth";
import { settingsApi } from "../api/settings.api";
import { UserData } from "@/features/users/components/types";
import { ProfileFormData } from "@/lib/validation/schemas/settings";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

export const useProfileSettings = () => {
  const { token, isReady } = useApiAuth();
  const queryClient = useQueryClient();
  const supabase = getSupabaseBrowserClient();

  // Fetch Profile Data
  const {
    data: profile,
    isLoading,
    error,
    refetch: fetchProfile,
  } = useQuery({
    queryKey: QUERY_KEYS.users.me,
    queryFn: () => settingsApi.getMe(token!),
    enabled: !!token && isReady,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const avatarUrl = profile?.avatar_url || null;

  const connectedAccounts = useMemo(() => {
    return profile?.identities?.reduce((acc, identity) => {
      if (identity.provider === "google" || identity.provider === "github") {
        acc[identity.provider] = true;
      }
      return acc;
    }, { google: false, github: false } as Record<"google" | "github", boolean>) || { google: false, github: false };
  }, [profile]);

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<UserData>) => settingsApi.updateMe(data, token!),
    onMutate: async (newUserData) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.users.me });

      // Snapshot the previous value
      const previousUser = queryClient.getQueryData<UserData>(QUERY_KEYS.users.me);

      // Optimistically update to the new value
      if (previousUser) {
        queryClient.setQueryData<UserData>(QUERY_KEYS.users.me, {
          ...previousUser,
          ...newUserData,
        });
      }

      return { previousUser };
    },
    onError: (err, newUserData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousUser) {
        queryClient.setQueryData(QUERY_KEYS.users.me, context.previousUser);
      }
      toast.error("Failed to update profile");
      logger.error("Error saving profile:", err);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onSettled: () => {
      // Always refetch after error or success to guarantee we are in sync with the server
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.me });
    },
  });

  const toggleAccountMutation = useMutation({
    mutationFn: async ({ provider, action }: { provider: "google" | "github", action: "link" | "unlink" }) => {
      if (action === "unlink") {
        return settingsApi.unlinkProvider(provider, token!);
      } else {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/?tab=settings`,
            queryParams: { prompt: 'select_account' }
          }
        });
        if (error) throw error;
      }
    },
    onError: (err, variables) => {
      toast.error(`Failed to ${variables.action === 'link' ? 'connect' : 'disconnect'} ${variables.provider}`);
      logger.error(`Error ${variables.action} provider:`, err);
    },
    onSuccess: (_, variables) => {
      if (variables.action === 'unlink') {
        toast.success(`${variables.provider} account disconnected`);
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.me });
      }
    },
  });

  const handleEmailChange = useCallback(async (newEmail: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      toast.success(`Verification email sent to ${newEmail}. Please check both your current and new inbox.`);
    } catch (err: unknown) {
      logger.error("Error changing email:", err);
      toast.error(err instanceof Error ? err.message : "Failed to initiate email change");
    }
  }, [supabase]);

  const saveProfile = useCallback(async (data: ProfileFormData) => {
    const updateData: Partial<UserData> = {
      display_name: data.displayName,
      job_title: data.jobTitle || undefined,
      first_name: profile?.first_name || undefined,
      last_name: profile?.last_name || undefined,
      avatar_url: avatarUrl || undefined,
    };
    updateProfileMutation.mutate(updateData);
  }, [updateProfileMutation, profile, avatarUrl]);

  return {
    profile: profile || null,
    isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    avatarUrl,
    connectedAccounts,
    isAuthLoading: toggleAccountMutation.isPending || updateProfileMutation.isPending,
    handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateProfileMutation.mutate({ avatar_url: reader.result as string });
          toast.success("Profile picture preview updated");
        };
        reader.readAsDataURL(file);
      }
    },
    handleRemoveAvatar: () => updateProfileMutation.mutate({ avatar_url: "" }),
    handleEmailChange,
    toggleAccount: (provider: "google" | "github") => 
      toggleAccountMutation.mutate({ 
        provider, 
        action: connectedAccounts[provider] ? "unlink" : "link" 
      }),
    saveProfile,
    refresh: fetchProfile,
  };
};
