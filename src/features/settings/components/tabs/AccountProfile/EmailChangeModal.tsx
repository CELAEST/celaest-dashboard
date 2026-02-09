import React from "react";
import { useForm } from "react-hook-form";

import { AlertCircle, Mail, Key } from "lucide-react";
import { SettingsModal } from "../../SettingsModal";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { FormInput } from "@/components/forms";
import {
  EmailChangeFormData,
  emailChangeSchema,
} from "@/lib/validation/schemas/settings";
import { zodResolver } from "@hookform/resolvers/zod";

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

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<EmailChangeFormData>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      newEmail: "",
      currentPassword: "",
    },
  });

  // eslint-disable-next-line
  const newEmail = watch("newEmail");

  const onSubmit = async (data: EmailChangeFormData) => {
    // Pass only the email to the confirm handler as per original interface
    // Real implementation might need password for API verification
    onConfirm(data.newEmail);
  };

  return (
    <SettingsModal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Email Address"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          control={control}
          name="newEmail"
          label="New Email Address"
          type="email"
          placeholder="your.new@email.com"
          autoFocus
          icon={<Mail className="w-4 h-4" />}
        />

        <FormInput
          control={control}
          name="currentPassword"
          label="Current Password"
          type="password"
          placeholder="Enter your password"
          icon={<Key className="w-4 h-4" />}
        />

        <div
          className={`flex items-start gap-3 p-4 rounded-xl border ${
            isDark
              ? "bg-cyan-500/10 border-cyan-500/20"
              : "bg-cyan-50 border-cyan-100"
          }`}
        >
          <AlertCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
          <p
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            A verification link will be sent to{" "}
            <strong className="text-cyan-500 font-bold">
              {newEmail || "your new email"}
            </strong>
            . You must click it to complete the change.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
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
            className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Verification"}
          </button>
        </div>
      </form>
    </SettingsModal>
  );
};

EmailChangeModal.displayName = "EmailChangeModal";
