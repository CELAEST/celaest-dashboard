import { useState, useMemo } from "react";
import { useInfiniteQuery, useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserData } from "../components/types";
import { usersApi, CreateUserInput, UpdateUserInput, UsersResponse } from "../api/users.api";
import { useApiAuth } from "@/lib/use-api-auth";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

const USERS_PAGE_SIZE = 15;

export const useUserManagement = () => {
  const { token, orgId, isReady } = useApiAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: QUERY_KEYS.users.all,
    queryFn: async ({ pageParam }) => {
      if (!token || !orgId) return { success: true, data: [], meta: { page: pageParam, per_page: USERS_PAGE_SIZE, total: 0, total_pages: 0 } } as UsersResponse;
      return usersApi.getUsers(pageParam, USERS_PAGE_SIZE, token, orgId);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta) return undefined;
      return lastPage.meta.page < lastPage.meta.total_pages
        ? lastPage.meta.page + 1
        : undefined;
    },
    enabled: isReady && !!token && !!orgId,
  });

  const users = useMemo(
    () => data?.pages.flatMap((p) => (p.success ? p.data : [])) ?? [],
    [data],
  );
  const totalUsers = data?.pages[0]?.meta?.total ?? 0;

  // ── Mutations ───────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: async (data: CreateUserInput) => {
      if (!token || !orgId) throw new Error("Missing auth");
      await usersApi.createUser(data, token, orgId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
      toast.success("Usuario invitado correctamente");
    },
    onError: () => toast.error("Error al crear usuario"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: UpdateUserInput }) => {
      if (!token || !orgId) throw new Error("Missing auth");
      await usersApi.updateUser(userId, data, token, orgId);
      return { userId, data };
    },
    onMutate: async ({ userId, data: ud }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.users.all });
      const previous = queryClient.getQueryData<InfiniteData<UsersResponse>>(QUERY_KEYS.users.all);
      queryClient.setQueryData<InfiniteData<UsersResponse>>(QUERY_KEYS.users.all, old => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map(p => ({
            ...p,
            data: p.data.map(u => u.id === userId ? { ...u, ...ud } as UserData : u),
          })),
        };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(QUERY_KEYS.users.all, context.previous);
      toast.error("Error al actualizar usuario");
    },
    onSuccess: () => toast.success("Usuario actualizado correctamente"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!token || !orgId) throw new Error("Missing auth");
      await usersApi.deleteUser(userId, token, orgId);
      return userId;
    },
    onMutate: async (userId: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.users.all });
      const previous = queryClient.getQueryData<InfiniteData<UsersResponse>>(QUERY_KEYS.users.all);
      queryClient.setQueryData<InfiniteData<UsersResponse>>(QUERY_KEYS.users.all, old => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map(p => ({
            ...p,
            data: p.data.filter(u => u.id !== userId),
          })),
        };
      });
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(QUERY_KEYS.users.all, context.previous);
      toast.error("Error al eliminar usuario");
    },
    onSuccess: () => toast.success("Usuario eliminado correctamente"),
  });

  const changeRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      if (!token || !orgId) throw new Error("Missing auth");
      await usersApi.updateRole(userId, newRole, token, orgId);
      return { userId, newRole };
    },
    onMutate: async ({ userId, newRole }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.users.all });
      const previous = queryClient.getQueryData<InfiniteData<UsersResponse>>(QUERY_KEYS.users.all);
      queryClient.setQueryData<InfiniteData<UsersResponse>>(QUERY_KEYS.users.all, old => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map(p => ({
            ...p,
            data: p.data.map(u =>
              u.id === userId ? { ...u, role: newRole as UserData["role"] } : u
            ),
          })),
        };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(QUERY_KEYS.users.all, context.previous);
      toast.error("Error al actualizar rol");
    },
    onSuccess: () => toast.success("Rol actualizado correctamente"),
  });

  // ── Wrapper functions (preserve return shape) ───────────────────────
  const createUser = async (data: CreateUserInput) => {
    try {
      await createMutation.mutateAsync(data);
      return true;
    } catch {
      return false;
    }
  };

  const updateUser = async (userId: string, data: UpdateUserInput) => {
    try {
      await updateMutation.mutateAsync({ userId, data });
      return true;
    } catch {
      return false;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await deleteMutation.mutateAsync(userId);
      return true;
    } catch {
      return false;
    }
  };

  const handleChangeRole = (userId: string, newRole: string) => {
    changeRoleMutation.mutate({ userId, newRole });
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
    totalUsers,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    loading: isLoading,
    createUser,
    updateUser,
    deleteUser,
    handleChangeRole,
    refresh: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all }),
  };
};
