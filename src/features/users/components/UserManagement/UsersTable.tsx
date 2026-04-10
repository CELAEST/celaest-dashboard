import React, { memo, useMemo } from "react";
import {
  Shield,
  Crown,
  User as UserIcon,
  Envelope,
  SignOut,
  PencilSimple,
  Trash,
  DotsThreeVertical,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";

import { UserData } from "../types";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface UsersTableProps {
  users: UserData[];
  loading: boolean;
  onForceSignOut: (user: UserData) => void;
  onEdit: (user: UserData) => void;
  onDelete: (user: UserData) => void;
  totalItems?: number;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

export const UsersTable = memo(
  ({ users, loading, onForceSignOut, onEdit, onDelete, totalItems, hasNextPage, isFetchingNextPage, onLoadMore }: UsersTableProps) => {
    const { isDark } = useTheme();

    const columns: ColumnDef<UserData>[] = useMemo(
      () => [
        {
          id: "identity",
          header: "Identidad de Usuario",
          cell: ({ row }) => {
            const u = row.original;
            const fullName =
              [u.first_name, u.last_name].filter(Boolean).join(" ") ||
              u.display_name ||
              "Unknown User";

            return (
              <div className="flex items-center gap-4 py-2">
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
                    <Envelope className="w-2.5 h-2.5" />
                    {u.email}
                  </p>
                </div>
              </div>
            );
          },
        },
        {
          id: "role",
          header: "Nivel de Acceso",
          accessorKey: "role",
          cell: ({ row }) => {
            const role = row.original.role || "viewer";
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

            const colorClass = colors[role] || colors["viewer"];
            const icon = icons[role] || icons["viewer"];

            return (
              <Badge
                className={`${colorClass} border flex items-center gap-1 w-fit`}
              >
                {icon}
                {role.replace("_", " ")}
              </Badge>
            );
          },
        },
        {
          id: "lastActivity",
          header: "Última Actividad",
          accessorKey: "last_login_at",
          cell: ({ row }) => {
            const u = row.original;
            return (
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
            );
          },
        },
        {
          id: "actions",
          header: () => <div className="text-right">Acciones</div>,
          cell: ({ row }) => {
            const u = row.original;
            return (
              <div className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <DotsThreeVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className={isDark ? "bg-black/90 border-white/10" : ""}
                  >
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(u)}>
                      <PencilSimple className="mr-2 h-4 w-4" />
                      PencilSimple User
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onForceSignOut(u)}
                      className="text-red-500 focus:text-red-500"
                    >
                      <SignOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(u)}
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          },
        },
      ],
      [isDark, onEdit, onForceSignOut, onDelete],
    );

    return (
      <div className="h-full w-full">
        <DataTable
          columns={columns}
          data={users}
          isLoading={loading}
          emptyMessage="No hay usuarios registrados"
          emptySubmessage="Añade miembros a tu organización para verlos aquí."
          totalItems={totalItems}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={onLoadMore}
        />
      </div>
    );
  },
);

UsersTable.displayName = "UsersTable";
