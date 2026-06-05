import React, { memo, useMemo } from "react";
import { CaretDown, SignOut, EnvelopeSimple } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface UserInfoProps {
  user: { name?: string; email: string; role: string };
}

// Map role code to Spanish uppercase display labels
const getRoleLabel = (role: string) => {
  const r = role.toLowerCase();
  if (r === "super_admin") return "SUPER ADMIN";
  if (r === "admin") return "ADMINISTRADOR";
  if (r === "client") return "CLIENTE";
  return role.toUpperCase().replace("_", " ");
};

// Auto-capitalize helper to ensure names look premium
const capitalizeName = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const UserInfo: React.FC<UserInfoProps> = memo(({ user }) => {
  const { theme } = useTheme();
  const { signOut } = useAuth();
  const router = useRouter();
  const isDark = theme === "dark";

  const handleSignOut = async () => {
    router.replace("/?mode=signin");
    await signOut();
  };

  const displayName = useMemo(() => {
    const rawName = user.name || user.email.split("@")[0];
    return capitalizeName(rawName);
  }, [user]);

  const displayRole = useMemo(() => getRoleLabel(user.role), [user.role]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 text-left cursor-pointer select-none outline-none group transition-colors duration-150">
          <div className="flex flex-col justify-center">
            <span className={`text-xs font-bold transition-colors duration-150 ${isDark ? "text-white group-hover:text-cyan-400" : "text-gray-900 group-hover:text-blue-600"}`}>
              {displayName}
            </span>
            <span className={`text-[9px] font-bold tracking-wider mt-0.5 leading-none ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              {displayRole}
            </span>
          </div>
          <CaretDown size={12} weight="bold" className={`transition-colors duration-150 ${isDark ? "text-gray-400 group-hover:text-cyan-400" : "text-gray-500 group-hover:text-blue-600"}`} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={`w-60 mt-2 border shadow-2xl p-2 rounded-2xl ${
          isDark
            ? "bg-[#07090d]/90 backdrop-blur-xl border-white/10 text-white"
            : "bg-white/95 backdrop-blur-xl border-gray-200 text-gray-900"
        }`}
      >
        <div className="px-2.5 py-2 flex flex-col gap-0.5">
          <span className={`text-[9px] font-black uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            Usuario
          </span>
          <span className="text-sm font-bold truncate">
            {displayName}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <EnvelopeSimple size={13} className={isDark ? "text-gray-500" : "text-gray-400"} />
            <span className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {user.email}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator className={isDark ? "bg-white/10" : "bg-gray-100"} />

        <div className="px-2.5 py-2 flex items-center gap-2">
          <span className={`text-[9px] font-black uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            Rol
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
            user.role === "super_admin"
              ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
              : user.role === "admin"
                ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                : "bg-gray-500/10 border-gray-500/20 text-gray-400"
          }`}>
            {displayRole}
          </span>
        </div>

        <DropdownMenuSeparator className={isDark ? "bg-white/10" : "bg-gray-100"} />

        <DropdownMenuItem
          onClick={handleSignOut}
          className={`flex items-center gap-2 px-2.5 py-2 text-xs font-semibold rounded-xl cursor-pointer transition-colors ${
            isDark
              ? "text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400"
              : "text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
          }`}
        >
          <SignOut size={16} />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

UserInfo.displayName = "UserInfo";
