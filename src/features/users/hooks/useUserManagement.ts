import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { UserData } from "../components/types";
import { usersApi } from "../api/users.api";
import { useApiAuth } from "@/lib/use-api-auth";
import { socket } from "@/lib/socket-client";

export const useUserManagement = () => {
  const { token, orgId, isReady } = useApiAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async (isRefresh = false) => {
    if (!isReady || !token || !orgId) return;
    if (loading && !isRefresh) return;

    setLoading(true);
    try {
      const response = await usersApi.getUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  }, [token, orgId, isReady, loading]);

  useEffect(() => {
    fetchUsers();

    if (!token) return;

    // Connect socket for real-time updates
    socket.connect(token);
    
    const handleRefresh = () => {
      console.log("WebSocket event received, refreshing users...");
      fetchUsers(true);
    };

    const offs = [
      socket.on("user.created", handleRefresh),
      socket.on("user.updated", handleRefresh),
      socket.on("user.deleted", handleRefresh),
    ];

    return () => {
      offs.forEach((off) => off());
    };
  }, [fetchUsers, token]);

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      await usersApi.updateRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, role: newRole as "super_admin" | "admin" | "client" }
            : u,
        ),
      );
      toast.success("User role updated successfully");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Error al actualizar rol");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.name || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  return {
    users,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    loading,
    handleChangeRole,
    refresh: () => fetchUsers(true),
  };
};
