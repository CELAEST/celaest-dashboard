import React from "react";
import { Envelope, Shield } from "@phosphor-icons/react";
import { useForm, useWatch } from "react-hook-form";
import { SettingsModal } from "../../SettingsModal";
import { useTheme } from "@/features/shared/hooks/useTheme";
import {
  inviteMemberSchema,
  InviteMemberFormData,
} from "@/lib/validation/schemas/settings";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: InviteMemberFormData) => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  onInvite,
}) => {
  const { isDark } = useTheme();
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");

  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: "viewer",
    },
  });

  const { isSubmitting } = form.formState;

  const inviteRole = useWatch({
    control: form.control,
    name: "role",
    defaultValue: "viewer",
  });

  const onSubmit = (data: InviteMemberFormData) => {
    onInvite(data);
  };

  return (
    <SettingsModal isOpen={isOpen} onClose={onClose} title={t("invite_new_member")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email_address")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Envelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder={t("email_placeholder")}
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

          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-3 block font-bold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {t("assigned_role")}
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "viewer", label: t("role_member_label"), desc: t("role_member_desc") },
                {
                  id: "admin",
                  label: t("role_admin_label"),
                  desc: t("role_admin_desc"),
                },
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => form.setValue("role", role.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer font-mono ${
                    inviteRole === role.id
                      ? isDark
                        ? "bg-zinc-800/40 border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-zinc-100 font-semibold"
                        : "bg-white border-black/6 shadow-sm"
                      : isDark
                        ? "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12]"
                        : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Shield
                      className={`w-4 h-4 ${
                        inviteRole === role.id
                          ? isDark
                            ? "text-zinc-100"
                            : "text-gray-900"
                          : isDark
                            ? "text-white/40"
                            : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-xs font-bold ${
                        inviteRole === role.id
                          ? isDark
                            ? "text-zinc-100"
                            : "text-gray-900"
                          : isDark
                            ? "text-white/40"
                            : "text-gray-500"
                      }`}
                    >
                      {role.label}
                    </span>
                  </div>
                  <p className={`text-[10px] ${isDark ? "text-white/40" : "text-gray-500"}`}>{role.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isDark
                  ? "border-white/8 bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tCommon("cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white text-black font-semibold uppercase tracking-wider text-xs shadow-md hover:bg-neutral-200 transition-all cursor-pointer disabled:opacity-50 font-jakarta"
            >
              {isSubmitting ? tCommon("sending") : t("send_invitation")}
            </button>
          </div>
        </form>
      </Form>
    </SettingsModal>
  );
};

InviteMemberModal.displayName = "InviteMemberModal";
