import React, { memo } from "react";
import { useForm } from "react-hook-form";
import { Key } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "@/lib/validation/schemas/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase/client";

export interface SecurityPasswordProps {
  onPasswordChanged?: () => void;
}

export const SecurityPassword: React.FC<SecurityPasswordProps> = memo(
  ({ onPasswordChanged }) => {
    const { isDark } = useTheme();

    const form = useForm<ChangePasswordFormData>({
      resolver: zodResolver(changePasswordSchema),
      defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    });

    const { isSubmitting } = form.formState;

    const onSubmit = async (data: ChangePasswordFormData) => {
      if (!supabase) return;
      try {
        const { error } = await supabase.auth.updateUser({
          password: data.newPassword,
        });

        if (error) throw error;
        toast.success("Password updated successfully");
        form.reset();
        onPasswordChanged?.();
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to update password";
        toast.error(message);
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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-w-xl"
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••••••"
                      className="font-mono h-11 rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••••••"
                        className="font-mono h-11 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••••••"
                        className="font-mono h-11 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
        </Form>
      </div>
    );
  },
);

SecurityPassword.displayName = "SecurityPassword";
