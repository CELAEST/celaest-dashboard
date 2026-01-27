import { LucideIcon } from "lucide-react";

export type SettingsTabId =
  | "account"
  | "security"
  | "billing"
  | "workspace"
  | "notifications"
  | "developer"
  | "preferences";

export interface SettingsTab {
  id: SettingsTabId;
  icon: LucideIcon;
  label: string;
}

export interface SettingsSelectProps {
  options: { value: string; label: string; }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export interface TimezoneOption {
  value: string;
  label: string;
}

export interface DateFormatOption {
  value: string;
  label: string;
  desc: string;
}

export interface TimeFormatOption {
  value: string;
  label: string;
  desc: string;
}
