export interface UserData {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  job_title?: string;
  avatar_url?: string;
  phone?: string;
  role: "super_admin" | "admin" | "client" | "manager" | "operator" | "viewer";
  organization_id: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  identities?: Array<{
    id: string;
    provider: string;
    email: string;
    last_login_at?: string;
  }>;
  onboarding_completed?: boolean;
  onboarding_step?: number;
}

export interface AuditLog {
  userId: string;
  action: string;
  ip: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
