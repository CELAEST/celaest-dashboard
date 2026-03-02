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
    logs,
    isLoading,
    handleEnable2FA,
    handleDisable2FA,
    handleLogoutSession,
    refreshLogs,
  } = useSecuritySettings();

  return (
    <div className="space-y-6">
      <SecurityPassword onPasswordChanged={refreshLogs} />
      <SecurityTwoFactor
        isEnabled={faEnabled}
        onEnable={handleEnable2FA}
        onDisable={handleDisable2FA}
      />
      <SecuritySessions
        sessions={sessions}
        onLogoutSession={handleLogoutSession}
      />
      <SecurityLogs logs={logs} isLoading={isLoading} />
    </div>
  );
}
