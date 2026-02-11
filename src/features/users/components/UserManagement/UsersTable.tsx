import React, { memo } from "react";
import {
  Shield,
  Crown,
  User as UserIcon,
  Mail,
  LogOut,
  Edit2,
  Trash2,
  MoreVertical,
} from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UserData } from "../types";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface UsersTableProps {
  users: UserData[];
  loading: boolean;
  onForceSignOut: (user: UserData) => void;
  onEdit: (user: UserData) => void;
  onDelete: (user: UserData) => void;
}

export const UsersTable = memo(
  ({ users, loading, onForceSignOut, onEdit, onDelete }: UsersTableProps) => {
    const { isDark } = useTheme();

    const getRoleBadge = (role: string) => {
      // Default to client/viewer if role unknown
      const safeRole = role || "viewer";

      const colors: Record<string, string> = {
        super_admin: isDark
          ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
          : "bg-purple-100 text-purple-700 border-purple-300",
        admin: isDark
          ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
          : "bg-blue-100 text-blue-700 border-blue-300",
        manager: isDark
          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
          : "bg-amber-100 text-amber-700 border-amber-300",
        operator: isDark
          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
          : "bg-emerald-100 text-emerald-700 border-emerald-300",
        viewer: isDark
          ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
          : "bg-gray-100 text-gray-700 border-gray-300",
        client: isDark
          ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
          : "bg-gray-100 text-gray-700 border-gray-300",
      };

      const icons: Record<string, React.ReactNode> = {
        super_admin: <Crown className="w-3 h-3" />,
        admin: <Shield className="w-3 h-3" />,
        manager: <Shield className="w-3 h-3" />,
        operator: <UserIcon className="w-3 h-3" />,
        viewer: <UserIcon className="w-3 h-3" />,
        client: <UserIcon className="w-3 h-3" />,
      };

      // Fallback
      const colorClass = colors[safeRole] || colors["viewer"];
      const icon = icons[safeRole] || icons["viewer"];

      return (
        <Badge className={`${colorClass} border flex items-center gap-1`}>
          {icon}
          {safeRole.replace("_", " ")}
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
      <div className="h-full w-full relative">
        <div className="absolute inset-0 overflow-auto custom-scrollbar">
          <Table>
            <TableHeader
              className={`sticky top-0 z-10 backdrop-blur-md ${isDark ? "bg-black/60" : "bg-white/80"}`}
            >
              <TableRow
                className={`${isDark ? "border-white/5 hover:bg-white/5" : "border-gray-100 hover:bg-gray-50/50"}`}
              >
                <TableHead
                  className={`h-12 text-[10px] uppercase tracking-[0.2em] font-black italic ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Identidad de Usuario
                </TableHead>
                <TableHead
                  className={`h-12 text-[10px] uppercase tracking-[0.2em] font-black italic ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Nivel de Acceso
                </TableHead>
                <TableHead
                  className={`h-12 text-[10px] uppercase tracking-[0.2em] font-black italic ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Última Actividad
                </TableHead>
                <TableHead
                  className={`h-12 text-[10px] uppercase tracking-[0.2em] font-black italic text-right ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const fullName =
                  [u.first_name, u.last_name].filter(Boolean).join(" ") ||
                  u.display_name ||
                  "Unknown User";

                return (
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
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] ${
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
                            className={`font-black text-sm tracking-tight italic ${
                              isDark
                                ? "text-white group-hover:text-cyan-400 transition-colors"
                                : "text-gray-900 group-hover:text-blue-600"
                            }`}
                          >
                            {fullName}
                          </p>
                          <p
                            className={`text-[10px] font-mono flex items-center gap-1.5 mt-0.5 opacity-40 ${
                              isDark ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            <Mail className="w-2.5 h-2.5" />
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(u.role)}</TableCell>
                    <TableCell>
                      <div
                        className={`text-[10px] font-mono font-black uppercase tracking-tighter opacity-70 ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {u.last_login_at
                          ? new Date(u.last_login_at).toLocaleDateString() +
                            " | " +
                            new Date(u.last_login_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "NOT ACTIVE"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className={
                            isDark ? "bg-black/90 border-white/10" : ""
                          }
                        >
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onEdit(u)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onForceSignOut(u)}
                            className="text-red-500 focus:text-red-500"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(u)}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  },
);

UsersTable.displayName = "UsersTable";
