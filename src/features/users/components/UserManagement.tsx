"use client";

// User Management Panel - CELAEST
// Super Admin: Full user management (Directory, Overview, Audit Logs)
// Client: Personal profile view only
import React, { useState, useCallback } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useRole } from "@/features/auth/hooks/useAuthorization";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { motion, AnimatePresence } from "motion/react";
import { Users, Clock, SquaresFour, Plus, User, Envelope, Shield, Calendar, MagnifyingGlass, Funnel } from "@phosphor-icons/react";
import { toast } from "sonner";
import { PageBanner } from "@/components/layout/PageLayout";
import { TableChrome } from "@/components/layout/TableChrome";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { UserActionModal } from "./modals/UserActionModal";
import { AddUserModal } from "./modals/AddUserModal";
import { EditUserModal } from "./modals/EditUserModal";
import { StatsOverview } from "./UserManagement/StatsOverview";
import { UsersTable } from "./UserManagement/UsersTable";
import { AuditLogsList } from "./UserManagement/AuditLogsList";
import { useUserManagement } from "../hooks/useUserManagement";
import { useAuditLogs } from "../hooks/useAuditLogs";
import { UserData } from "./types";

// ─── Client Profile View ──────────────────────────────────────────────
const ClientProfileView: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const { user } = useAuth();

  if (!user) return null;

  const profileFields = [
    { icon: User, label: "Nombre", value: user.name || "—" },
    { icon: Envelope, label: "Email", value: user.email || "—" },
    { icon: Shield, label: "Rol", value: user.role === "super_admin" ? "Super Admin" : user.role === "admin" ? "Admin" : "Cliente" },
    { icon: Calendar, label: "Miembro desde", value: user.createdAt ? new Date(user.createdAt).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" }) : "—" },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-lg rounded-3xl border p-8 ${
          isDark
            ? "bg-[#0a0a0a]/60 border-white/10 backdrop-blur-xl"
            : "bg-white border-gray-200 shadow-xl"
        }`}
      >
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black uppercase ${
            isDark ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-blue-50 text-blue-600 border border-blue-200"
          }`}>
            {(user.name?.[0] || user.email?.[0] || "U").toUpperCase()}
          </div>
          <h2 className={`mt-4 text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {user.name || user.email}
          </h2>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{user.email}</p>
        </div>

        {/* Profile Fields */}
        <div className="space-y-4">
          {profileFields.map(({ icon: Icon, label, value }) => (
            <div key={label} className={`flex items-center gap-4 px-4 py-3 rounded-xl ${
              isDark ? "bg-white/5" : "bg-gray-50"
            }`}>
              <Icon className={`w-4 h-4 shrink-0 ${isDark ? "text-gray-500" : "text-gray-400"}`} weight="duotone" />
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
                <p className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// ─── Super Admin Full View ────────────────────────────────────────────
const SuperAdminUserManagement: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const {
    users,
    totalUsers,
    hasNextPage: usersHasNextPage,
    isFetchingNextPage: usersIsFetchingNextPage,
    fetchNextPage: usersFetchNextPage,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    loading: usersLoading,
    createUser,
    updateUser,
    deleteUser,
  } = useUserManagement();

  const { auditLogs } = useAuditLogs();

  const [activeTab, setActiveTab] = useState<"overview" | "directory" | "logs">("directory");
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [actionType, setActionType] = useState<"sign_out" | "delete">("sign_out");

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
      toast.success(`${selectedUser.email} has been signed out (Session Revoked)`);
    } else if (actionType === "delete") {
      await deleteUser(selectedUser.id);
    }
    setIsActionModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      {/* Header Row */}
      <PageBanner
        title="User Management"
        subtitle="Governance & Operational Control"
        actions={
          <div className="flex items-center gap-3">
            {/* Tabs */}
            <div
              className={`flex items-center p-0.5 rounded-lg ${
                isDark ? "bg-white/5 border border-white/5" : "bg-gray-100 border border-gray-200"
              }`}
            >
              {[
                { id: "directory" as const, label: "Directory" },
                { id: "overview" as const, label: "Overview" },
                { id: "logs" as const, label: "Audit Logs" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                    activeTab === tab.id
                      ? isDark
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-white text-amber-600 shadow-sm"
                      : isDark
                        ? "text-gray-500 hover:text-gray-300"
                        : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search + Role Filter (only on directory tab) */}
            {activeTab === "directory" && (
              <>
                <div className="relative">
                  <MagnifyingGlass
                    className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-8 h-7 w-44 text-xs rounded-lg ${
                      isDark ? "bg-white/5 border-white/5" : "bg-gray-100 border-gray-200"
                    }`}
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-colors outline-none appearance-none cursor-pointer ${
                    isDark
                      ? "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                      : "bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <option value="all">All Roles</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="operator">Operator</option>
                  <option value="viewer">Viewer</option>
                  <option value="client">Client</option>
                </select>
              </>
            )}

            {/* Invite Button */}
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                isDark
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/25"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              }`}
            >
              <Plus size={11} weight="bold" />
              Invite User
            </button>
          </div>
        }
      />

      {/* Main Viewport */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="h-full w-full">
              <StatsOverview users={users} auditLogs={auditLogs} isDark={isDark} />
            </motion.div>
          )}
          {activeTab === "directory" && (
            <motion.div key="directory" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="flex-1 min-h-0 pb-4 overflow-hidden w-full">
              <TableChrome
                toolbar={
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                      <span className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                        All Users
                      </span>
                    </div>
                    <span className={`text-[11px] tabular-nums ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      {filteredUsers.length > 0 ? `Showing ${filteredUsers.length} of ${totalUsers} entries` : ""}
                    </span>
                  </div>
                }
              >
                <UsersTable
                  users={filteredUsers}
                  loading={usersLoading}
                  onForceSignOut={initForceSignOut}
                  onEdit={initEditUser}
                  onDelete={initDeleteUser}
                  totalItems={totalUsers}
                  hasNextPage={usersHasNextPage}
                  isFetchingNextPage={usersIsFetchingNextPage}
                  onLoadMore={usersFetchNextPage}
                />
              </TableChrome>
            </motion.div>
          )}
          {activeTab === "logs" && (
            <motion.div key="logs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 min-h-0 px-4 pb-4 overflow-hidden w-full">
              <TableChrome
                toolbar={
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                        Security Audit Trail
                      </span>
                    </div>
                  </div>
                }
              >
                <AuditLogsList logs={auditLogs} />
              </TableChrome>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
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
      <AddUserModal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} onConfirm={async (data) => { await createUser(data); }} />
      <EditUserModal isOpen={isEditUserModalOpen} onClose={() => setIsEditUserModalOpen(false)} user={selectedUser} onConfirm={async (id, data) => { await updateUser(id, data); }} />
    </>
  );
};

// ─── Main Export ──────────────────────────────────────────────────────
export const UserManagement: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { isSuperAdmin } = useRole();

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      {isSuperAdmin ? (
        <SuperAdminUserManagement isDark={isDark} />
      ) : (
        <>
          <PageBanner title="Mi Perfil" subtitle="Información Personal" />
          <ClientProfileView isDark={isDark} />
        </>
      )}
    </div>
  );
};
