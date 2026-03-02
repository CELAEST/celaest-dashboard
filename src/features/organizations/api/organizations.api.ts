import api from "@/lib/api-client";
import { 
  Organization, 
  OrganizationMember, 
  OrganizationSubscription, 
  CreateOrganizationInput, 
  UpdateOrganizationInput,
  AddMemberInput
} from "../types";

import { z } from "zod";

const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string()
}).passthrough() as unknown as z.ZodType<Organization>;

const organizationListSchema = z.array(organizationSchema);

export interface OrganizationListResponse {
  organizations: Organization[];
  total: number;
  page: number;
  per_page: number;
}

export const organizationsApi = {
  // Admin Management
  listAdmin: (token: string) =>
    api.get<OrganizationListResponse>("/api/v1/admin/organizations", { token }),
    
  deleteAdmin: (token: string, id: string) =>
    api.delete(`/api/v1/admin/organizations/${id}`, { token }),

  // Organization Management
  list: (token: string) => 
    api.get<Organization[]>("/api/v1/org/organizations", { token, schema: organizationListSchema }),
  
  get: (token: string, id: string) => 
    api.get<Organization>(`/api/v1/org/organizations/${id}`, { token }),
    
  getCurrent: (token: string) => 
    api.get<Organization>("/api/v1/org/organizations/current", { token }),
    
  getBySlug: (token: string, slug: string) => 
    api.get<Organization>(`/api/v1/org/organizations/slug/${slug}`, { token }),
    
  create: (token: string, data: CreateOrganizationInput) => 
    api.post<Organization>("/api/v1/org/organizations", data, { token }),
    
  update: (token: string, id: string, data: UpdateOrganizationInput) => 
    api.put<Organization>(`/api/v1/org/organizations/${id}`, data, { token }),
    
  delete: (token: string, id: string) => 
    api.delete(`/api/v1/org/organizations/${id}`, { token }),

  // Member Management
  listMembers: (token: string, orgId: string) => 
    api.get<OrganizationMember[]>(`/api/v1/org/organizations/${orgId}/members`, { token }),
    
  addMember: (token: string, orgId: string, data: AddMemberInput) => 
    api.post<OrganizationMember>(`/api/v1/org/organizations/${orgId}/members`, data, { token }),
    
  removeMember: (token: string, orgId: string, userId: string) => 
    api.delete(`/api/v1/org/organizations/${orgId}/members/${userId}`, { token }),
    
  updateMemberRole: (token: string, orgId: string, userId: string, role: string) => 
    api.put<OrganizationMember>(`/api/v1/org/organizations/${orgId}/members/${userId}/role`, { role }, { token }),

  // Subscription Management
  getSubscription: (token: string, orgId: string) => 
    api.get<OrganizationSubscription>(`/api/v1/org/organizations/${orgId}/subscription`, { token }),
    
  updateSubscription: (token: string, orgId: string, planId: string) => 
    api.put<OrganizationSubscription>(`/api/v1/org/organizations/${orgId}/subscription`, { plan_id: planId }, { token }),
    
  cancelSubscription: (token: string, orgId: string) => 
    api.delete(`/api/v1/org/organizations/${orgId}/subscription`, { token }),

  // Settings
  getSettings: (token: string, orgId: string) => 
    api.get<Record<string, unknown>>(`/api/v1/org/organizations/${orgId}/settings`, { token }),
    
  updateSettings: (token: string, orgId: string, settings: Record<string, unknown>) => 
    api.put<Record<string, unknown>>(`/api/v1/org/organizations/${orgId}/settings`, settings, { token }),
};
