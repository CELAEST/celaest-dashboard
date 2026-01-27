"use client";

import React from "react";
import { useSecuritySettings } from "../../hooks/useSecuritySettings";
import { SecurityPassword } from "./SecurityAccess/SecurityPassword";
import { SecurityTwoFactor } from "./SecurityAccess/SecurityTwoFactor";
import { SecuritySessions } from "./SecurityAccess/SecuritySessions";
import { SecurityLogs } from "./SecurityAccess/SecurityLogs";

/**
 * Security & Access Settings Tab
 */
export function SecurityAccess() {
  const {
    faEnabled,
    sessions,
    handleEnable2FA,
    handleDisable2FA,
    handleLogoutSession,
  } = useSecuritySettings();

  return (
    <div className="space-y-6">
      <SecurityPassword />
      <SecurityTwoFactor
        isEnabled={faEnabled}
        onEnable={handleEnable2FA}
        onDisable={handleDisable2FA}
      />
      <SecuritySessions
        sessions={sessions}
        onLogoutSession={handleLogoutSession}
      />
      <SecurityLogs />
    </div>
  );
}
