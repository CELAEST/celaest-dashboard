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
    <SettingsModal isOpen={isOpen} onClose={onClose} title="Invite New Member">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Envelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="colleague@company.com"
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
              Assigned Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "viewer", label: "Member", desc: "Can view and edit" },
                {
                  id: "admin",
                  label: "Admin",
                  desc: "Full access to settings",
                },
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => form.setValue("role", role.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    inviteRole === role.id
                      ? "bg-cyan-500/10 border-cyan-500 shadow-sm"
                      : isDark
                        ? "bg-black/40 border-white/5 hover:border-white/10"
                        : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Shield
                      className={`w-4 h-4 ${
                        inviteRole === role.id
                          ? "text-cyan-500"
                          : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-bold ${
                        inviteRole === role.id
                          ? isDark
                            ? "text-white"
                            : "text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {role.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500">{role.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                isDark
                  ? "border-white/10 text-gray-300 hover:bg-white/5"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white font-black shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "PaperPlaneTilt Invitation"}
            </button>
          </div>
        </form>
      </Form>
    </SettingsModal>
  );
};

InviteMemberModal.displayName = "InviteMemberModal";
