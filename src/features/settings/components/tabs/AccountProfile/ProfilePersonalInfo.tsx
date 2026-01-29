import React, { memo } from "react";
import { useFormContext } from "react-hook-form";
import { User, Briefcase } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { FormInput } from "@/components/forms";
import { ProfileFormData } from "@/lib/validation/schemas/settings";

export const ProfilePersonalInfo: React.FC = memo(() => {
  const { isDark } = useTheme();
  const { control } = useFormContext<ProfileFormData>();

  return (
    <div className="settings-glass-card rounded-2xl p-6">
      <h3
        className={`text-lg font-bold mb-6 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        Personal Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          control={control}
          name="displayName"
          label="Display Name"
          placeholder="Enter your name"
          required
          icon={<User className="w-4 h-4" />}
        />

        <FormInput
          control={control}
          name="jobTitle"
          label="Job Title"
          placeholder="Your role"
          icon={<Briefcase className="w-4 h-4" />}
        />
      </div>
    </div>
  );
});

ProfilePersonalInfo.displayName = "ProfilePersonalInfo";
