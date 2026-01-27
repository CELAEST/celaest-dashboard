export interface UserData {
  id: string;
  email: string;
  name?: string;
  role: "super_admin" | "admin" | "client";
  created_at: string;
  last_sign_in_at?: string;
}

export interface AuditLog {
  userId: string;
  action: string;
  ip: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
