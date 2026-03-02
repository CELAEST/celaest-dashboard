import React, { memo } from "react";
import { useFormContext } from "react-hook-form";
import { User, Briefcase } from "lucide-react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
        <FormField
          control={control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter your name"
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
          control={control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Your role"
                    className="pl-10 h-11 rounded-xl"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
});

ProfilePersonalInfo.displayName = "ProfilePersonalInfo";
