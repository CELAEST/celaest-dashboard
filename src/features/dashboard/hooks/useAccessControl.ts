import { useAuth } from "@/features/auth/contexts/AuthContext";
import { FeatureConfig } from "../config/feature-registry";

export interface AccessResult {
  granted: boolean;
  reason?: "guest" | "forbidden" | "loading";
}

interface UserWithRole {
  role?: string;
  isAdmin?: boolean;
  [key: string]: unknown;
}

export const useAccessControl = (feature: FeatureConfig): AccessResult => {
  const { user, isLoading } = useAuth();
  const isGuest = !isLoading && !user;

  if (isLoading) {
    return { granted: false, reason: "loading" };
  }

  // Public features are always accessible
  if (feature.access === "public") {
    return { granted: true };
  }

  // Guest check
  if (isGuest) {
    return { granted: false, reason: "guest" };
  }

  // Admin check (if feature requires admin)
  if (feature.access === "admin") {
    const safeUser = user as unknown as UserWithRole;
    const isAdmin = safeUser?.role === 'admin' || safeUser?.isAdmin === true;
    
    if (!isAdmin) {
      return { granted: false, reason: "forbidden" };
    }
  }

  return { granted: true };
};
