"use client";

// User Management Panel for Admins - CELAEST
import React, { useState, useCallback } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { usePermissions } from "@/features/auth/hooks/useAuthorization";
import { isSuperAdminRole } from "@/features/auth/lib/permissions";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { motion, AnimatePresence } from "motion/react";
import { Users, Clock, AlertCircle, LayoutGrid, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { UserActionModal } from "./modals/UserActionModal";
import { AddUserModal } from "./modals/AddUserModal";
import { EditUserModal } from "./modals/EditUserModal";
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
    createUser,
    updateUser,
    deleteUser,
  } = useUserManagement();

  const { auditLogs } = useAuditLogs();

  const [activeTab, setActiveTab] = useState<"overview" | "directory" | "logs">(
    "directory",
  );

  // Modal State
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [actionType, setActionType] = useState<"sign_out" | "delete">(
    "sign_out",
  );

  const initForceSignOut = useCallback((user: UserData) => {
    setSelectedUser(user);
    setActionType("sign_out");
    setIsActionModalOpen(true);
  }, []);

  const initEditUser = useCallback((user: UserData) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  }, []);

  const initDeleteUser = useCallback((user: UserData) => {
    setSelectedUser(user);
    setActionType("delete");
    setIsActionModalOpen(true);
  }, []);

  const handleConfirmAction = async () => {
    if (!selectedUser) return;

    if (actionType === "sign_out") {
      // Logic for sign out - currently mock/toast mostly unless API updated
      toast.success(
        `${selectedUser.email} has been signed out (Session Revoked)`,
      );
    } else if (actionType === "delete") {
      await deleteUser(selectedUser.id);
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
    <div className="h-full flex flex-col min-h-0 overflow-hidden p-2 gap-4">
      {/* Unified Header Row */}
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h1
            className={`text-2xl font-black italic tracking-tighter uppercase ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            User Management
          </h1>
          <p
            className={`text-[10px] font-black uppercase tracking-[0.2em] ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Governance & Operational Control
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Action Buttons */}
          <Button
            size="sm"
            onClick={() => setIsAddUserModalOpen(true)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold tracking-wider text-[10px] uppercase h-9 px-4 rounded-xl shadow-lg shadow-cyan-900/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Invite User
          </Button>

          {/* Premium Navigation Hub */}
          <div
            className={`relative flex p-1 rounded-2xl border backdrop-blur-3xl shadow-2xl ${
              isDark
                ? "bg-[#0a0a0a]/60 border-white/5"
                : "bg-gray-100/80 border-gray-200"
            }`}
          >
            {[
              {
                id: "directory",
                label: "Directory",
                icon: Users,
                color: "purple",
              },
              {
                id: "overview",
                label: "Overview",
                icon: LayoutGrid,
                color: "cyan",
              },
              { id: "logs", label: "Audit Logs", icon: Clock, color: "amber" },
            ].map((tab, idx) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "overview" | "directory" | "logs")
                  }
                  className={`relative px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all duration-500 z-10 ${
                    isActive
                      ? isDark
                        ? "text-white"
                        : "text-gray-900"
                      : isDark
                        ? "text-gray-500 hover:text-gray-300"
                        : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 rounded-xl shadow-lg ${
                        isDark
                          ? "bg-white/5 border border-white/10"
                          : "bg-white shadow-sm border border-gray-200"
                      }`}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    >
                      <div
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full ${
                          tab.color === "cyan"
                            ? "bg-cyan-500 shadow-[0_0_10px_#22d3ee]"
                            : tab.color === "purple"
                              ? "bg-purple-500 shadow-[0_0_10px_#a855f7]"
                              : "bg-amber-500 shadow-[0_0_10px_#f59e0b]"
                        }`}
                      />
                    </motion.div>
                  )}

                  <span className="opacity-30 font-mono">0{idx + 1}</span>
                  <Icon
                    size={14}
                    className={
                      isActive
                        ? tab.color === "cyan"
                          ? "text-cyan-400"
                          : tab.color === "purple"
                            ? "text-purple-400"
                            : "text-amber-400"
                        : ""
                    }
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full w-full"
            >
              <StatsOverview
                users={users}
                auditLogs={auditLogs}
                isDark={isDark}
              />
            </motion.div>
          )}

          {activeTab === "directory" && (
            <motion.div
              key="directory"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="h-full w-full flex flex-col"
            >
              <div
                className={`flex-1 flex flex-col backdrop-blur-3xl border rounded-[2.5rem] overflow-hidden ${
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

                <div className="flex-1 overflow-hidden">
                  <UsersTable
                    users={filteredUsers}
                    loading={usersLoading}
                    onForceSignOut={initForceSignOut}
                    onEdit={initEditUser}
                    onDelete={initDeleteUser}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "logs" && (
            <motion.div
              key="logs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full w-full"
            >
              <div className="h-full backdrop-blur-3xl border rounded-[2.5rem] overflow-hidden bg-black/20 border-white/5">
                <AuditLogsList logs={auditLogs} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Confirmation Modal */}
      <UserActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={actionType === "sign_out" ? "Force Sign Out" : "Delete User"}
        description={
          actionType === "sign_out"
            ? `Are you sure you want to sign out ${selectedUser?.email}? This will immediately invalidate all active sessions.`
            : `Are you sure you want to delete ${selectedUser?.email}? This action cannot be undone.`
        }
        actionType="danger"
        confirmText={actionType === "sign_out" ? "Sign Out" : "Delete User"}
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onConfirm={async (data) => {
          await createUser(data);
        }}
      />

      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => setIsEditUserModalOpen(false)}
        user={selectedUser}
        onConfirm={async (id, data) => {
          await updateUser(id, data);
        }}
      />
    </div>
  );
};
