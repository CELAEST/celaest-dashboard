import React, { memo, useMemo } from "react";
import { User, Shield } from "lucide-react";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface UserInfoProps {
  user: { name?: string; email: string; role: string };
}

// Componente memoizado para el indicador de rol
const RoleIcon = memo(function RoleIcon({ role }: { role: string }) {
  if (role === "super_admin")
    return <Shield className="w-3 h-3 text-purple-400" />;
  if (role === "admin") return <Shield className="w-3 h-3 text-cyan-400" />;
  return <User className="w-3 h-3" />;
});

export const UserInfo: React.FC<UserInfoProps> = memo(({ user }) => {
  const { isDark } = useTheme();

  const containerClassName = useMemo(
    () =>
      `flex items-center gap-3 px-4 py-2 rounded-full border ${
        isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
      }`,
    [isDark],
  );

  const iconContainerClassName = useMemo(
    () =>
      `w-8 h-8 rounded-full flex items-center justify-center ${
        isDark ? "bg-cyan-500/20" : "bg-blue-100"
      }`,
    [isDark],
  );

  return (
    <div className={containerClassName}>
      <div className={iconContainerClassName}>
        <RoleIcon role={user.role} />
      </div>
      <div className="flex flex-col">
        <span
          className={`text-sm font-medium ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {user.name || user.email.split("@")[0]}
        </span>
        <span
          className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
        >
          {user.role.replace("_", " ")}
        </span>
      </div>
    </div>
  );
});

UserInfo.displayName = "UserInfo";
