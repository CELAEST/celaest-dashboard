export interface UserData {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
  phone?: string;
  role: "super_admin" | "admin" | "client" | "manager" | "operator" | "viewer";
  organization_id: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  login_count: number;
  deleted_at?: string;
}

export interface AuditLog {
  userId: string;
  action: string;
  ip: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
