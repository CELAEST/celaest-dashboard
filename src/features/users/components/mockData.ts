import { UserData, AuditLog } from "./types";

export const MOCK_USERS: UserData[] = [
  {
    id: "1",
    email: "admin@celaest.com",
    name: "Admin User",
    role: "super_admin",
    created_at: "2025-01-01T00:00:00Z",
    last_sign_in_at: "2026-01-26T10:00:00Z",
  },
  {
    id: "2",
    email: "staff@celaest.com",
    name: "Staff Member",
    role: "admin",
    created_at: "2025-02-15T00:00:00Z",
    last_sign_in_at: "2026-01-25T14:30:00Z",
  },
  {
    id: "3",
    email: "client@company.com",
    name: "John Doe",
    role: "client",
    created_at: "2025-03-20T00:00:00Z",
    last_sign_in_at: "2026-01-20T09:15:00Z",
  },
  {
    id: "4",
    email: "user@demo.com",
    name: "Demo User",
    role: "client",
    created_at: "2025-04-10T00:00:00Z",
    last_sign_in_at: "2026-01-18T16:45:00Z",
  },
  {
    id: "5",
    email: "dev@celaest.com",
    name: "Developer",
    role: "admin",
    created_at: "2025-01-05T00:00:00Z",
    last_sign_in_at: "2026-01-26T08:00:00Z",
  },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    userId: "1",
    action: "user.login",
    ip: "192.168.1.1",
    timestamp: "2026-01-26T10:00:00Z",
    metadata: { method: "password" },
  },
  {
    userId: "3",
    action: "license.verified",
    ip: "203.0.113.5",
    timestamp: "2026-01-26T09:45:00Z",
    metadata: { success: true },
  },
  {
    userId: "2",
    action: "user.role_changed",
    ip: "192.168.1.2",
    timestamp: "2026-01-25T15:00:00Z",
    metadata: { target: "4", new_role: "client" },
  },
  {
    userId: "4",
    action: "user.login",
    ip: "198.51.100.2",
    timestamp: "2026-01-25T14:20:00Z",
    metadata: { method: "google" },
  },
  {
    userId: "1",
    action: "system.config_update",
    ip: "192.168.1.1",
    timestamp: "2026-01-24T11:30:00Z",
    metadata: { key: "maintenance_mode" },
  },
];
