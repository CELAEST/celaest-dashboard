import { useState, useMemo } from "react";
import { Mail, Smartphone, LucideIcon } from "lucide-react";

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

export const useNotificationSettings = () => {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    email_activity: true,
    email_newsletter: false,
    push_security: true,
    push_mentions: true,
    browser_all: false,
  });

  const togglePref = (id: string) => {
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
    togglePref,
    notificationSections,
  };
};
