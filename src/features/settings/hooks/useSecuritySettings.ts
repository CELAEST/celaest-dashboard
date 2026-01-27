import { useState, useCallback } from "react";
import { Session } from "../components/tabs/SecurityAccess/SecuritySessions";

export const useSecuritySettings = () => {
  const [faEnabled, setFaEnabled] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      device: "MacBook Pro 16",
      location: "Madrid, Spain",
      ip: "192.168.1.1",
      current: true,
      lastActive: "Active now",
    },
    {
      id: "2",
      device: "iPhone 15 Pro",
      location: "Madrid, Spain",
      ip: "192.168.1.5",
      current: false,
      lastActive: "2 hours ago",
    },
  ]);

  const handleLogoutSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleEnable2FA = useCallback(() => {
    setFaEnabled(true);
  }, []);

  const handleDisable2FA = useCallback(() => {
    setFaEnabled(false);
  }, []);

  return {
    faEnabled,
    sessions,
    handleEnable2FA,
    handleDisable2FA,
    handleLogoutSession,
  };
};
