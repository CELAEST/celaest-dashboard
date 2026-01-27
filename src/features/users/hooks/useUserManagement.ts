import { useState, useMemo } from "react";
import { toast } from "sonner";
import { UserData } from "../components/types";
import { MOCK_USERS } from "../components/mockData";

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserData[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [loading] = useState(false); // Removed setter if not used for async

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

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase());
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
  };
};
