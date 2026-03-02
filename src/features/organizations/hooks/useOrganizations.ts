import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationsApi } from "../api/organizations.api";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { CreateOrganizationInput, UpdateOrganizationInput } from "../types";
import { toast } from "sonner";

export function useOrganizations(token: string) {
  return useQuery({
    queryKey: QUERY_KEYS.organizations.list,
    queryFn: () => organizationsApi.list(token),
    enabled: !!token,
  });
}

export function useOrganizationDetail(token: string, id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.organizations.detail(id),
    queryFn: () => organizationsApi.get(token, id),
    enabled: !!token && !!id,
  });
}

export function useOrganizationMembers(token: string, orgId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.organizations.members(orgId),
    queryFn: () => organizationsApi.listMembers(token, orgId),
    enabled: !!token && !!orgId,
  });
}

export function useOrganizationMutations(token: string) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateOrganizationInput) => organizationsApi.create(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.organizations.list });
      toast.success("Organización creada exitosamente");
    },
    onError: () => toast.error("Error al crear organización"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrganizationInput }) => 
      organizationsApi.update(token, id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.organizations.list });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.organizations.detail(id) });
      const prevList = queryClient.getQueryData(QUERY_KEYS.organizations.list);
      const prevDetail = queryClient.getQueryData(QUERY_KEYS.organizations.detail(id));
      queryClient.setQueryData(QUERY_KEYS.organizations.list, (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.map((o: { id?: string }) => o?.id === id ? { ...o, ...data } : o);
      });
      queryClient.setQueryData(QUERY_KEYS.organizations.detail(id), (old: unknown) =>
        old ? { ...(old as Record<string, unknown>), ...data } : old
      );
      return { prevList, prevDetail, id };
    },
    onError: (_err, _vars, context) => {
      if (context) {
        queryClient.setQueryData(QUERY_KEYS.organizations.list, context.prevList);
        queryClient.setQueryData(QUERY_KEYS.organizations.detail(context.id), context.prevDetail);
      }
      toast.error("Error al actualizar organización");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.organizations.list });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.organizations.detail(variables.id) });
      toast.success("Organización actualizada");
    },
  });

  return {
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
