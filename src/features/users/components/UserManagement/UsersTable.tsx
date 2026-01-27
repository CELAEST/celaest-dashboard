import React, { memo } from "react";
import { Shield, Crown, User as UserIcon, Mail, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { UserData } from "../types";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface UsersTableProps {
  users: UserData[];
  loading: boolean;
  currentUserId?: string;
  isSuperAdmin: boolean;
  onRoleChange: (userId: string, newRole: string) => void;
  onForceSignOut: (user: UserData) => void;
}

export const UsersTable = memo(
  ({
    users,
    loading,
    currentUserId,
    isSuperAdmin,
    onRoleChange,
    onForceSignOut,
  }: UsersTableProps) => {
    const { isDark } = useTheme();

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

      const roleKey = role as keyof typeof colors;
      return (
        <Badge className={`${colors[roleKey]} border flex items-center gap-1`}>
          {icons[roleKey]}
          {role.replace("_", " ")}
        </Badge>
      );
    };

    if (loading) {
      return (
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
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow className={isDark ? "border-white/10" : "border-gray-200"}>
            <TableHead className={isDark ? "text-gray-400" : "text-gray-600"}>
              User
            </TableHead>
            <TableHead className={isDark ? "text-gray-400" : "text-gray-600"}>
              Role
            </TableHead>
            <TableHead className={isDark ? "text-gray-400" : "text-gray-600"}>
              Last Sign In
            </TableHead>
            <TableHead className={isDark ? "text-gray-400" : "text-gray-600"}>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow
              key={u.id}
              className={isDark ? "border-white/10" : "border-gray-200"}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDark ? "bg-cyan-500/20" : "bg-blue-100"
                    }`}
                  >
                    <UserIcon
                      className={`w-5 h-5 ${
                        isDark ? "text-cyan-400" : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {u.name || "Unnamed User"}
                    </p>
                    <p
                      className={`text-sm flex items-center gap-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <Mail className="w-3 h-3" />
                      {u.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {isSuperAdmin ? (
                  <Select
                    value={u.role}
                    onValueChange={(newRole) => onRoleChange(u.id, newRole)}
                    disabled={u.id === currentUserId} // Can't change own role
                  >
                    <SelectTrigger
                      className={`w-40 ${
                        isDark ? "bg-white/5 border-white/10" : "bg-gray-50"
                      }`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
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
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
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
                  onClick={() => onForceSignOut(u)}
                  disabled={u.id === currentUserId}
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
    );
  },
);

UsersTable.displayName = "UsersTable";
