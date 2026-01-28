"use client";

// User Management Panel for Admins - CELAEST
import React, { useState, useCallback } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { usePermissions } from "@/features/auth/hooks/useAuthorization";
import { isSuperAdminRole } from "@/features/auth/lib/permissions";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { motion } from "motion/react";
import { Users, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

import { UserActionModal } from "./modals/UserActionModal";
import { StatsOverview } from "./UserManagement/StatsOverview";
import { UserFilters } from "./UserManagement/UserFilters";
import { UsersTable } from "./UserManagement/UsersTable";
import { AuditLogsList } from "./UserManagement/AuditLogsList";
import { useUserManagement } from "../hooks/useUserManagement";
import { useAuditLogs } from "../hooks/useAuditLogs";
import { UserData } from "./types";

export const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const isSuperAdmin = useCallback(
    () => user && isSuperAdminRole(user.role),
    [user],
  );

  // Custom Hooks
  const {
    users,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    loading: usersLoading,
    handleChangeRole,
  } = useUserManagement();

  const { auditLogs } = useAuditLogs();

  const [activeTab, setActiveTab] = useState<"users" | "logs">("users");

  // Modal State
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [actionType, setActionType] = useState<"sign_out" | "ban">("sign_out");

  const initForceSignOut = useCallback((user: UserData) => {
    setSelectedUser(user);
    setActionType("sign_out");
    setIsActionModalOpen(true);
  }, []);

  const handleConfirmAction = () => {
    if (!selectedUser) return;

    if (actionType === "sign_out") {
      toast.success(`${selectedUser.email} has been signed out (Mock)`);
      // Logic to actually sign out would go here
    }

    setIsActionModalOpen(false);
    setSelectedUser(null);
  };

  if (!hasPermission("users:manage")) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Alert
          className={`max-w-md ${
            isDark
              ? "border-red-500/30 bg-red-500/10"
              : "border-red-300 bg-red-50"
          }`}
        >
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription
            className={isDark ? "text-red-400" : "text-red-700"}
          >
            Access Denied. You don&apos;t have permission to manage users.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Fixed Header Section */}
      <div className="shrink-0 mb-6">
        <h1
          className={`text-4xl font-black mb-2 tracking-tighter italic uppercase ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          User Management
        </h1>
        <p
          className={`text-sm font-medium ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Manage users, roles, and security protocols
        </p>
      </div>

      {/* Fixed Tabs */}
      <div className="flex gap-2 mb-6 shrink-0">
        <Button
          onClick={() => setActiveTab("users")}
          variant={activeTab === "users" ? "default" : "outline"}
          className={
            activeTab === "users"
              ? isDark
                ? "bg-cyan-500 text-white font-bold tracking-wide shadow-lg shadow-cyan-500/20"
                : "bg-blue-600 text-white font-bold tracking-wide shadow-lg shadow-blue-500/20"
              : isDark
                ? "border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                : "border-gray-300 text-gray-700 hover:text-gray-900"
          }
        >
          <Users className="w-4 h-4 mr-2" />
          Users Directory
        </Button>
        <Button
          onClick={() => setActiveTab("logs")}
          variant={activeTab === "logs" ? "default" : "outline"}
          className={
            activeTab === "logs"
              ? isDark
                ? "bg-cyan-500 text-white font-bold tracking-wide shadow-lg shadow-cyan-500/20"
                : "bg-blue-600 text-white font-bold tracking-wide shadow-lg shadow-blue-500/20"
              : isDark
                ? "border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                : "border-gray-300 text-gray-700 hover:text-gray-900"
          }
        >
          <Clock className="w-4 h-4 mr-2" />
          Audit Logs
        </Button>
      </div>

      {/* Main Content Area - Scroll Area Trigger */}
      <div className="flex-1 overflow-hidden relative flex flex-col min-h-0">
        {/* Users Tab Content */}
        {activeTab === "users" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col min-h-0"
          >
            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-16 space-y-6 min-h-0">
              {/* Stats Grid */}
              <StatsOverview
                users={users}
                auditLogs={auditLogs}
                isDark={isDark}
              />

              {/* Main Data Card */}
              <div
                className={`backdrop-blur-xl border rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px] shrink-0 ${
                  isDark
                    ? "bg-[#0a0a0a]/60 border-white/5 shadow-2xl"
                    : "bg-white border-gray-200 shadow-xl"
                }`}
              >
                <div className="p-6 border-b border-white/5 shrink-0">
                  <UserFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    roleFilter={roleFilter}
                    setRoleFilter={setRoleFilter}
                  />
                </div>

                <div className="flex-1 overflow-hidden border-t border-white/5">
                  <UsersTable
                    users={filteredUsers}
                    loading={usersLoading}
                    currentUserId={user?.id}
                    isSuperAdmin={!!isSuperAdmin()}
                    onRoleChange={handleChangeRole}
                    onForceSignOut={initForceSignOut}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Audit Logs Tab Content */}
        {activeTab === "logs" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-16 min-h-0"
          >
            <AuditLogsList logs={auditLogs} />
          </motion.div>
        )}
      </div>

      {/* Action Confirmation Modal */}
      <UserActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={actionType === "sign_out" ? "Force Sign Out" : "Confirm Action"}
        description={
          actionType === "sign_out"
            ? `Are you sure you want to sign out ${selectedUser?.email}? This will immediately invalidate all active sessions for this user.`
            : "Are you sure you want to verify this action?"
        }
        actionType="danger"
        confirmText="Sign Out"
      />
    </div>
  );
};
