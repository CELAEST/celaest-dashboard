import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { UserData } from "../components/types";
import { usersApi, CreateUserInput, UpdateUserInput } from "../api/users.api";
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
      const response = await usersApi.getUsers(1, 20, token, orgId);
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  }, [token, orgId, isReady]); // Removed 'loading' from dependency to avoid loop if called during load

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

  const createUser = async (data: CreateUserInput) => {
    if (!token || !orgId) return false;
    try {
      await usersApi.createUser(data, token, orgId);
      toast.success("Usuario invitado correctamente");
      fetchUsers(true);
      return true;
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error al crear usuario");
      return false;
    }
  };

  const updateUser = async (userId: string, data: UpdateUserInput) => {
      if (!token || !orgId) return false;
      try {
        await usersApi.updateUser(userId, data, token, orgId);
        toast.success("Usuario actualizado correctamente");
        fetchUsers(true);
        return true;
      } catch (error) {
        console.error("Error updating user:", error);
        toast.error("Error al actualizar usuario");
        return false;
      }
  };

  const deleteUser = async (userId: string) => {
      if (!token || !orgId) return false;
      try {
          await usersApi.deleteUser(userId, token, orgId);
          toast.success("Usuario eliminado correctamente");
          fetchUsers(true);
          return true;
      } catch (error) {
          console.error("Error deleting user:", error);
          toast.error("Error al eliminar usuario");
          return false;
      }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    if (!token || !orgId) return;
    try {
      await usersApi.updateRole(userId, newRole, token, orgId);
      // Optimistic update
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, role: newRole as any }
            : u,
        ),
      );
      toast.success("Rol actualizado correctamente");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Error al actualizar rol");
      fetchUsers(true); // Revert on error
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const fullName = `${u.first_name || ""} ${u.last_name || ""} ${u.display_name || ""}`.trim() || u.email;
      const matchesSearch =
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fullName.toLowerCase().includes(searchQuery.toLowerCase());
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
    createUser,
    updateUser,
    deleteUser,
    handleChangeRole,
    refresh: () => fetchUsers(true),
  };
};
