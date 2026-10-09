import React from "react";
import { useForm } from "react-hook-form";

import { Warning, Envelope, Key } from "@phosphor-icons/react";
import { SettingsModal } from "../../SettingsModal";
import { useTheme } from "@/features/shared/hooks/useTheme";
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
  EmailChangeFormData,
  emailChangeSchema,
} from "@/lib/validation/schemas/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

interface EmailChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (email: string) => void;
}

export const EmailChangeModal: React.FC<EmailChangeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { isDark } = useTheme();
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");

  const form = useForm<EmailChangeFormData>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      newEmail: "",
      currentPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  // eslint-disable-next-line
  const newEmail = form.watch("newEmail");

  const onSubmit = async (data: EmailChangeFormData) => {
    // Pass only the email to the confirm handler as per original interface
    // Real implementation might need password for API verification
    onConfirm(data.newEmail);
  };

  return (
    <SettingsModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("change_email_title")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="newEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("new_email_address")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Envelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder={t("new_email_placeholder")}
                      autoFocus
                      className="pl-10 h-11 rounded-xl"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("current_password")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder={t("enter_password")}
                      className="pl-10 h-11 rounded-xl"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div
            className={`flex items-start gap-3 p-4 rounded-xl border ${
              isDark
                ? "bg-white/[0.02] border-white/[0.06]"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <Warning className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? "text-white/60" : "text-gray-600"}`} />
            <p
              className={`text-xs ${isDark ? "text-white/60" : "text-gray-600"}`}
            >
              {t("verification_info")}{" "}
              <strong className={`font-mono font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {newEmail || t("verification_info_default")}
              </strong>
              {t("verification_info_end")}
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                isDark
                  ? "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {tCommon("cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {isSubmitting ? tCommon("sending") : t("send_verification")}
            </button>
          </div>
        </form>
      </Form>
    </SettingsModal>
  );
};

EmailChangeModal.displayName = "EmailChangeModal";
