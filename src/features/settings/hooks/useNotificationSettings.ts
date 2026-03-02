import { useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Smartphone, LucideIcon } from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { settingsApi } from "../api/settings.api";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { socket } from "@/lib/socket-client";
import { useEffect } from "react";

export interface NotificationItem {
  id: string;
  label: string;
  desc: string;
}

export interface NotificationSection {
  title: string;
  icon: LucideIcon;
  items: NotificationItem[];
}

const NOTIF_QUERY_KEY = [...QUERY_KEYS.users.all, "notifications"] as const;

/**
 * useNotificationSettings — Persisted in Backend
 */
export const useNotificationSettings = () => {
  const { session } = useAuthStore();
  const token = session?.accessToken;
  const queryClient = useQueryClient();

  const { data: prefs = {
    email_activity: true,
    email_newsletter: false,
    push_security: true,
    push_mentions: true,
    browser_all: false,
  }, isLoading } = useQuery({
    queryKey: NOTIF_QUERY_KEY,
    queryFn: async () => {
      if (!token) return null;
      const response = await settingsApi.getNotificationPreferences(token);
      if (response.notifications) {
        const parsed = typeof response.notifications === 'string'
          ? JSON.parse(response.notifications)
          : response.notifications;
        return parsed as Record<string, boolean>;
      }
      return null;
    },
    enabled: !!token,
  });

  // Real-time synchronization: Listen for preference updates from other devices
  useEffect(() => {
    if (!token) return;

    const unsubscribe = socket.on("user.updated", (payload: unknown) => {
      const p = payload as { action?: string };
      if (p.action === "notifications_updated" || p.action === "preferences_updated") {
        queryClient.invalidateQueries({ queryKey: NOTIF_QUERY_KEY });
      }
    });

    return () => unsubscribe();
  }, [token, queryClient]);

  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      const currentPrefs = prefs ?? {};
      const newPrefs = { ...currentPrefs, [id]: !currentPrefs[id] };
      await settingsApi.updateNotificationPreferences(newPrefs, token!);
      return newPrefs;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: NOTIF_QUERY_KEY });
      const previous = queryClient.getQueryData<Record<string, boolean>>(NOTIF_QUERY_KEY);
      queryClient.setQueryData<Record<string, boolean>>(NOTIF_QUERY_KEY, old => ({
        ...(old || {}),
        [id]: !(old?.[id] ?? false),
      }));
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIF_QUERY_KEY, context.previous);
      }
      toast.error("Failed to save preference");
    },
  });

  const togglePref = useCallback((id: string) => {
    toggleMutation.mutate(id);
  }, [toggleMutation]);

  const notificationSections: NotificationSection[] = useMemo(
    () => [
      {
        title: "Email Notifications",
        icon: Mail,
        items: [
          {
            id: "email_activity",
            label: "Account Activity",
            desc: "Large orders, new logins, and security alerts.",
          },
          {
            id: "email_newsletter",
            label: "Newsletter & Updates",
            desc: "New features, tips, and marketplace news.",
          },
        ],
      },
      {
        title: "Push Notifications",
        icon: Smartphone,
        items: [
          {
            id: "push_security",
            label: "Security Alerts",
            desc: "Critical alerts about your account security.",
          },
          {
            id: "push_mentions",
            label: "Mentions & Comments",
            desc: "When someone mentions you in a workspace.",
          },
        ],
      },
    ],
    [],
  );

  return {
    prefs,
    isLoading,
    togglePref,
    notificationSections,
  };
};
