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
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow
              className={`${isDark ? "border-white/5 hover:bg-white/5" : "border-gray-100 hover:bg-gray-50/50"}`}
            >
              <TableHead
                className={`h-12 text-[10px] uppercase tracking-widest font-black italic ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                User Identity
              </TableHead>
              <TableHead
                className={`h-12 text-[10px] uppercase tracking-widest font-black italic ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Access Level
              </TableHead>
              <TableHead
                className={`h-12 text-[10px] uppercase tracking-widest font-black italic ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Last Activity
              </TableHead>
              <TableHead
                className={`h-12 text-[10px] uppercase tracking-widest font-black italic text-right ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Security Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow
                key={u.id}
                className={`group transition-colors duration-300 ${
                  isDark
                    ? "border-white/5 hover:bg-white/5 data-[state=selected]:bg-white/10"
                    : "border-gray-100 hover:bg-gray-50 data-[state=selected]:bg-gray-100"
                }`}
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
                        isDark
                          ? "bg-white/5 shadow-inner shadow-white/5"
                          : "bg-gray-100"
                      }`}
                    >
                      <UserIcon
                        className={`w-5 h-5 ${
                          isDark
                            ? "text-gray-400 group-hover:text-cyan-400 transition-colors"
                            : "text-gray-500 group-hover:text-blue-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p
                        className={`font-bold text-sm tracking-tight ${
                          isDark
                            ? "text-white group-hover:text-cyan-400 transition-colors"
                            : "text-gray-900 group-hover:text-blue-600"
                        }`}
                      >
                        {u.name || "Unknown User"}
                      </p>
                      <p
                        className={`text-xs font-mono flex items-center gap-1.5 mt-0.5 ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        <Mail className="w-3 h-3 opacity-50" />
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
                      disabled={u.id === currentUserId}
                    >
                      <SelectTrigger
                        className={`w-32 h-8 text-xs font-medium border-0 transition-all ${
                          isDark
                            ? "bg-white/5 hover:bg-white/10 text-gray-300 focus:ring-cyan-500/20"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-blue-500/20"
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
                  <div
                    className={`text-xs font-mono font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {u.last_sign_in_at
                      ? new Date(u.last_sign_in_at).toLocaleDateString() +
                        " " +
                        new Date(u.last_sign_in_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Never"}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onForceSignOut(u)}
                    disabled={u.id === currentUserId}
                    className={`h-8 px-3 text-xs font-medium uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${
                      isDark
                        ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        : "text-red-600 hover:text-red-700 hover:bg-red-50"
                    }`}
                  >
                    <LogOut className="w-3 h-3 mr-2" />
                    Force Sign Out
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  },
);

UsersTable.displayName = "UsersTable";
