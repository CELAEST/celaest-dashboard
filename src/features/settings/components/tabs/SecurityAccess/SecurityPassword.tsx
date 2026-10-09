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
import { useTranslations } from "next-intl";

export interface SecurityPasswordProps {
  onPasswordChanged?: () => void;
}

export const SecurityPassword: React.FC<SecurityPasswordProps> = memo(
  ({ onPasswordChanged }) => {
    const { isDark } = useTheme();
    const t = useTranslations("settings");

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
        toast.success(t("password_updated_success"));
        form.reset();
        onPasswordChanged?.();
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : t("password_update_failed");
        toast.error(message);
      }
    };

    return (
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-base font-bold font-jakarta mb-6 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <Key className={`w-5 h-5 ${isDark ? "text-white/80" : "text-gray-700"}`} />
          {t("update_password")}
        </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("current_password")}</FormLabel>
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
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("new_password")}</FormLabel>
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
                    <FormLabel>{t("confirm_new_password")}</FormLabel>
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
                className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-white text-black hover:bg-neutral-200 active:scale-[0.98] transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-jakarta"
              >
                {isSubmitting ? t("updating") : t("update_password")}
              </button>
            </div>
          </form>
        </Form>
      </div>
    );
  },
);

SecurityPassword.displayName = "SecurityPassword";
