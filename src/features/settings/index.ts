/**
 * Settings Feature - Public API
 * 
 * Barrel export for clean imports following module pattern.
 * External consumers only need: import { SettingsView } from '@/features/settings'
 */

// Main View Component
export { SettingsView } from "./components/SettingsView";

// UI Components (for reuse if needed)
export { SettingsTabButton } from "./components/SettingsTabButton";
export { SettingsModal } from "./components/SettingsModal";
export { SettingsSelect } from "./components/SettingsSelect";

// Tab Components (for direct access if needed)
export { AccountProfile } from "./components/tabs/AccountProfile";
export { SecurityAccess } from "./components/tabs/SecurityAccess";
export { WorkspaceTeam } from "./components/tabs/WorkspaceTeam";
export { Notifications } from "./components/tabs/Notifications";
export { DeveloperAPI } from "./components/tabs/DeveloperAPI";
export { Preferences } from "./components/tabs/Preferences";

// Types
export type * from "./types";
