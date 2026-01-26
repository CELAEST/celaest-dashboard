"use client";

// User Management Panel for Admins - CELAEST
import React, { useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { motion } from "motion/react";
import {
  Users,
  Shield,
  LogOut,
  AlertCircle,
  Search,
  Filter,
  Clock,
  Mail,
  Crown,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface UserData {
  id: string;
  email: string;
  name?: string;
  role: "super_admin" | "admin" | "client";
  created_at: string;
  last_sign_in_at?: string;
}

interface AuditLog {
  userId: string;
  action: string;
  ip: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

const MOCK_USERS: UserData[] = [
  {
    id: "1",
    email: "admin@celaest.com",
    name: "Admin User",
    role: "super_admin",
    created_at: "2025-01-01T00:00:00Z",
    last_sign_in_at: "2026-01-26T10:00:00Z",
  },
  {
    id: "2",
    email: "staff@celaest.com",
    name: "Staff Member",
    role: "admin",
    created_at: "2025-02-15T00:00:00Z",
    last_sign_in_at: "2026-01-25T14:30:00Z",
  },
  {
    id: "3",
    email: "client@company.com",
    name: "John Doe",
    role: "client",
    created_at: "2025-03-20T00:00:00Z",
    last_sign_in_at: "2026-01-20T09:15:00Z",
  },
  {
    id: "4",
    email: "user@demo.com",
    name: "Demo User",
    role: "client",
    created_at: "2025-04-10T00:00:00Z",
    last_sign_in_at: "2026-01-18T16:45:00Z",
  },
  {
    id: "5",
    email: "dev@celaest.com",
    name: "Developer",
    role: "admin",
    created_at: "2025-01-05T00:00:00Z",
    last_sign_in_at: "2026-01-26T08:00:00Z",
  },
];

const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    userId: "1",
    action: "user.login",
    ip: "192.168.1.1",
    timestamp: "2026-01-26T10:00:00Z",
    metadata: { method: "password" },
  },
  {
    userId: "3",
    action: "license.verified",
    ip: "203.0.113.5",
    timestamp: "2026-01-26T09:45:00Z",
    metadata: { success: true },
  },
  {
    userId: "2",
    action: "user.role_changed",
    ip: "192.168.1.2",
    timestamp: "2026-01-25T15:00:00Z",
    metadata: { target: "4", new_role: "client" },
  },
  {
    userId: "4",
    action: "user.login",
    ip: "198.51.100.2",
    timestamp: "2026-01-25T14:20:00Z",
    metadata: { method: "google" },
  },
  {
    userId: "1",
    action: "system.config_update",
    ip: "192.168.1.1",
    timestamp: "2026-01-24T11:30:00Z",
    metadata: { key: "maintenance_mode" },
  },
];

import { UserActionModal } from "./modals/UserActionModal";

// ... imports

export const UserManagement: React.FC = () => {
  const { user, hasScope, isSuperAdmin } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [users, setUsers] = useState<UserData[]>(MOCK_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"users" | "logs">("users");

  // Modal State
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [actionType, setActionType] = useState<"sign_out" | "ban">("sign_out");

  // Removed API calls for design review with "data quemada"
  // prevent unused vars
  React.useEffect(() => {
    if (loading) setLoading(false);
    if (auditLogs.length === 0) setAuditLogs(MOCK_AUDIT_LOGS);
  }, [loading, auditLogs]);

  const handleChangeRole = async (userId: string, newRole: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? { ...u, role: newRole as "super_admin" | "admin" | "client" }
          : u,
      ),
    );
    toast.success("User role updated successfully (Mock)");
  };

  const initForceSignOut = (user: UserData) => {
    setSelectedUser(user);
    setActionType("sign_out");
    setIsActionModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedUser) return;

    if (actionType === "sign_out") {
      toast.success(`${selectedUser.email} has been signed out (Mock)`);
      // Logic to actually sign out would go here
    }

    setIsActionModalOpen(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    const colors = {
      super_admin: isDark
        ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
        : "bg-purple-100 text-purple-700 border-purple-300",
      admin: isDark
        ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
        : "bg-blue-100 text-blue-700 border-blue-300",
      client: isDark
        ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
        : "bg-gray-100 text-gray-700 border-gray-300",
    };

    const icons = {
      super_admin: <Crown className="w-3 h-3" />,
      admin: <Shield className="w-3 h-3" />,
      client: <UserIcon className="w-3 h-3" />,
    };

    return (
      <Badge
        className={`${colors[role as keyof typeof colors]} border flex items-center gap-1`}
      >
        {icons[role as keyof typeof icons]}
        {role.replace("_", " ")}
      </Badge>
    );
  };

  const getActionColor = (action: string) => {
    if (action.includes("login"))
      return isDark ? "text-green-400" : "text-green-600";
    if (action.includes("logout") || action.includes("signout"))
      return isDark ? "text-yellow-400" : "text-yellow-600";
    if (action.includes("role_changed"))
      return isDark ? "text-purple-400" : "text-purple-600";
    if (action.includes("registered"))
      return isDark ? "text-cyan-400" : "text-cyan-600";
    return isDark ? "text-gray-400" : "text-gray-600";
  };

  if (!hasScope("users:manage")) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Alert
          className={`max-w-md ${isDark ? "border-red-500/30 bg-red-500/10" : "border-red-300 bg-red-50"}`}
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
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1
          className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          User Management
        </h1>
        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Manage users, roles, and view security audit logs
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card
          className={`${isDark ? "bg-[#0a0a0a]/60 border-white/10" : "bg-white border-gray-200"}`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Total Users
                </p>
                <p
                  className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {users.length}
                </p>
              </div>
              <Users
                className={`w-8 h-8 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
              />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${isDark ? "bg-[#0a0a0a]/60 border-white/10" : "bg-white border-gray-200"}`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Admins
                </p>
                <p
                  className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {
                    users.filter(
                      (u) => u.role === "admin" || u.role === "super_admin",
                    ).length
                  }
                </p>
              </div>
              <Shield
                className={`w-8 h-8 ${isDark ? "text-purple-400" : "text-purple-600"}`}
              />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${isDark ? "bg-[#0a0a0a]/60 border-white/10" : "bg-white border-gray-200"}`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Clients
                </p>
                <p
                  className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {users.filter((u) => u.role === "client").length}
                </p>
              </div>
              <UserIcon
                className={`w-8 h-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${isDark ? "bg-[#0a0a0a]/60 border-white/10" : "bg-white border-gray-200"}`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Audit Events
                </p>
                <p
                  className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {auditLogs.length}
                </p>
              </div>
              <Clock
                className={`w-8 h-8 ${isDark ? "text-green-400" : "text-green-600"}`}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          onClick={() => setActiveTab("users")}
          variant={activeTab === "users" ? "default" : "outline"}
          className={
            activeTab === "users"
              ? isDark
                ? "bg-cyan-500 text-white"
                : "bg-blue-600 text-white"
              : isDark
                ? "border-white/10 text-gray-400"
                : "border-gray-300 text-gray-700"
          }
        >
          <Users className="w-4 h-4 mr-2" />
          Users
        </Button>
        <Button
          onClick={() => setActiveTab("logs")}
          variant={activeTab === "logs" ? "default" : "outline"}
          className={
            activeTab === "logs"
              ? isDark
                ? "bg-cyan-500 text-white"
                : "bg-blue-600 text-white"
              : isDark
                ? "border-white/10 text-gray-400"
                : "border-gray-300 text-gray-700"
          }
        >
          <Clock className="w-4 h-4 mr-2" />
          Audit Logs
        </Button>
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className={`${isDark ? "bg-[#0a0a0a]/60 border-white/10" : "bg-white border-gray-200"}`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle
                    className={isDark ? "text-white" : "text-gray-900"}
                  >
                    All Users
                  </CardTitle>
                  <CardDescription>
                    Manage user accounts and permissions
                  </CardDescription>
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`pl-10 w-64 ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50"}`}
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger
                      className={`w-40 ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50"}`}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className={`w-8 h-8 border-2 ${
                      isDark
                        ? "border-cyan-500 border-t-transparent"
                        : "border-blue-600 border-t-transparent"
                    } rounded-full`}
                  />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow
                      className={isDark ? "border-white/10" : "border-gray-200"}
                    >
                      <TableHead
                        className={isDark ? "text-gray-400" : "text-gray-600"}
                      >
                        User
                      </TableHead>
                      <TableHead
                        className={isDark ? "text-gray-400" : "text-gray-600"}
                      >
                        Role
                      </TableHead>
                      <TableHead
                        className={isDark ? "text-gray-400" : "text-gray-600"}
                      >
                        Last Sign In
                      </TableHead>
                      <TableHead
                        className={isDark ? "text-gray-400" : "text-gray-600"}
                      >
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow
                        key={u.id}
                        className={
                          isDark ? "border-white/10" : "border-gray-200"
                        }
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isDark ? "bg-cyan-500/20" : "bg-blue-100"
                              }`}
                            >
                              <UserIcon
                                className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
                              />
                            </div>
                            <div>
                              <p
                                className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                              >
                                {u.name || "Unnamed User"}
                              </p>
                              <p
                                className={`text-sm flex items-center gap-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                              >
                                <Mail className="w-3 h-3" />
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {isSuperAdmin() ? (
                            <Select
                              value={u.role}
                              onValueChange={(newRole) =>
                                handleChangeRole(u.id, newRole)
                              }
                              disabled={u.id === user?.id} // Can't change own role
                            >
                              <SelectTrigger
                                className={`w-40 ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50"}`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="super_admin">
                                  Super Admin
                                </SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="client">Client</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            getRoleBadge(u.role)
                          )}
                        </TableCell>
                        <TableCell>
                          <p
                            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                          >
                            {u.last_sign_in_at
                              ? new Date(u.last_sign_in_at).toLocaleString()
                              : "Never"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => initForceSignOut(u)}
                            disabled={u.id === user?.id}
                            className={
                              isDark
                                ? "border-white/10 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                                : ""
                            }
                          >
                            <LogOut className="w-3 h-3 mr-1" />
                            Force Sign Out
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === "logs" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className={`${isDark ? "bg-[#0a0a0a]/60 border-white/10" : "bg-white border-gray-200"}`}
          >
            <CardHeader>
              <CardTitle className={isDark ? "text-white" : "text-gray-900"}>
                Security Audit Logs
              </CardTitle>
              <CardDescription>
                Real-time tracking of all security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.slice(0, 50).map((log, index) => (
                  <motion.div
                    key={`${log.timestamp}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`p-4 rounded-lg border ${
                      isDark
                        ? "bg-white/5 border-white/10"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-sm font-mono font-medium ${getActionColor(log.action)}`}
                          >
                            {log.action.replace(/_/g, " ").toUpperCase()}
                          </span>
                          <span
                            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                          >
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div
                          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                        >
                          <span>User ID: {log.userId.substring(0, 8)}...</span>
                          <span className="mx-2">•</span>
                          <span>IP: {log.ip}</span>
                          {log.metadata &&
                            Object.keys(log.metadata).length > 0 && (
                              <>
                                <span className="mx-2">•</span>
                                <span className="font-mono text-xs">
                                  {JSON.stringify(log.metadata)}
                                </span>
                              </>
                            )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
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
