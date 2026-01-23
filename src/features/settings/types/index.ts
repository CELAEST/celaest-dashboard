/**
 * Settings Module - Domain Types
 * 
 * TypeScript interfaces following Interface Segregation Principle (ISP).
 * Each settings domain has its own interface for flexibility and type safety.
 */

import { LucideIcon } from "lucide-react";

// ============================================
// Tab Navigation Types
// ============================================

export type SettingsTabId =
  | "account"
  | "security"
  | "workspace"
  | "notifications"
  | "developer"
  | "preferences";

export interface SettingsTab {
  id: SettingsTabId;
  icon: LucideIcon;
  label: string;
}

// ============================================
// Account & Profile Types
// ============================================

export interface ConnectedAccount {
  provider: "google" | "github";
  email?: string;
  username?: string;
  connected: boolean;
}

export interface UserProfile {
  displayName: string;
  jobTitle?: string;
  email: string;
  avatarUrl?: string;
  connectedAccounts: ConnectedAccount[];
}

// ============================================
// Security & Access Types
// ============================================

export interface Session {
  id: string;
  device: string;
  browser?: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange?: string;
  sessions: Session[];
}

// ============================================
// Workspace & Team Types
// ============================================

export type TeamRole = "admin" | "viewer";
export type MemberStatus = "active" | "invited";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: MemberStatus;
  avatarUrl?: string;
}

export interface WorkspaceInfo {
  totalMembers: number;
  pendingInvites: number;
  admins: number;
  members: TeamMember[];
}

// ============================================
// Notifications Types
// ============================================

export interface NotificationChannel {
  email: boolean;
  push: boolean;
}

export interface NotificationSetting {
  id: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  channels: NotificationChannel;
  required?: boolean;
}

// ============================================
// Developer & API Types
// ============================================

export type WebhookStatus = "active" | "failed";

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: WebhookStatus;
  lastTriggered?: string;
}

export interface APISettings {
  apiKey: string;
  webhooks: WebhookEndpoint[];
}

// ============================================
// Preferences Types
// ============================================

export type ThemeMode = "light" | "dark" | "auto";
export type DateFormat = "MM/DD/YYYY" | "DD/MM/YYYY";
export type TimeFormat = "12h" | "24h";

export interface TimezoneOption {
  value: string;
  label: string;
}

export interface UserPreferences {
  timezone: string;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  theme: ThemeMode;
  language: string;
}

// ============================================
// Modal Props Interface
// ============================================

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// ============================================
// Select Component Types
// ============================================

export interface SelectOption {
  value: string;
  label: string;
}

export interface SettingsSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}
