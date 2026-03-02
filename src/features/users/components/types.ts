import { z } from "zod";

export const userDataSchema = z.object({
  id: z.string(),
  email: z.string(), // The backend might not send a valid email format for test users, so just string
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  display_name: z.string().nullable().optional(),
  job_title: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  role: z.enum(["super_admin", "admin", "client", "manager", "operator", "viewer"]),
  organization_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  last_login_at: z.string().nullable().optional(),
  identities: z.array(z.object({
    id: z.string(),
    provider: z.string(),
    email: z.string(),
    last_login_at: z.string().nullable().optional(),
  })).nullable().optional(),
  onboarding_completed: z.boolean().nullable().optional(),
  onboarding_step: z.number().nullable().optional()
});

export type UserData = z.infer<typeof userDataSchema>;

export interface AuditLog {
  userId: string;
  action: string;
  ip: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
