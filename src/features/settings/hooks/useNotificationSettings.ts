import { useState, useEffect, useMemo, useCallback } from "react";
import { Mail, Smartphone, LucideIcon } from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { settingsApi } from "../api/settings.api";
import { toast } from "sonner";

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

/**
 * useNotificationSettings — Persisted in Backend
 */
export const useNotificationSettings = () => {
  const { session } = useAuthStore();
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    email_activity: true,
    email_newsletter: false,
    push_security: true,
    push_mentions: true,
    browser_all: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchPrefs = useCallback(async () => {
    if (!session?.accessToken) return;
    try {
      setIsLoading(true);
      const response = await settingsApi.getNotificationPreferences(session.accessToken);
      if (response.notifications) {
        try {
          const parsed = typeof response.notifications === 'string'
            ? JSON.parse(response.notifications)
            : response.notifications;
          setPrefs(parsed);
        } catch (e) {
          console.error("Failed to parse notifications", e);
        }
      }
    } catch (error) {
      console.error("Failed to fetch notification preferences:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    fetchPrefs();
  }, [fetchPrefs]);

  const togglePref = useCallback((id: string) => {
    setPrefs((prev) => {
      const newPrefs = { ...prev, [id]: !prev[id] };
      // Save to backend
      if (session?.accessToken) {
        settingsApi.updateNotificationPreferences(newPrefs, session.accessToken)
          .catch(() => toast.error("Failed to save preference"));
      }
      return newPrefs;
    });
  }, [session?.accessToken]);

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
