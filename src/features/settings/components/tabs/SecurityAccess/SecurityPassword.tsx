import React, { memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Key } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { toast } from "sonner";
import { FormInput } from "@/components/forms";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "@/lib/validation/schemas/settings";

export const SecurityPassword: React.FC = memo(() => {
  const { isDark } = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Password change requested:", data);
      toast.success("Password updated successfully");
      reset();
    } catch {
      toast.error("Failed to update password");
    }
  };

  return (
    <div className="settings-glass-card rounded-2xl p-6">
      <h3
        className={`text-lg font-bold mb-6 flex items-center gap-2 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        <Key className="w-5 h-5 text-cyan-500" />
        Update Password
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
        <FormInput
          control={control}
          name="currentPassword"
          label="Current Password"
          type="password"
          placeholder="••••••••••••"
          className="font-mono"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="newPassword"
            label="New Password"
            type="password"
            placeholder="••••••••••••"
            className="font-mono"
          />

          <FormInput
            control={control}
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="••••••••••••"
            className="font-mono"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            } bg-cyan-600 hover:bg-cyan-500 text-white`}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
});

SecurityPassword.displayName = "SecurityPassword";
