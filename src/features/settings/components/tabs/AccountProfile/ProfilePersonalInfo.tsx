import React, { memo } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface ProfilePersonalInfoProps {
  displayName: string;
  jobTitle: string;
}

export const ProfilePersonalInfo: React.FC<ProfilePersonalInfoProps> = memo(
  ({ displayName, jobTitle }) => {
    const { isDark } = useTheme();

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
          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Display Name *
            </label>
            <input
              type="text"
              defaultValue={displayName}
              className="settings-input w-full rounded-lg px-4 py-3"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Job Title
            </label>
            <input
              type="text"
              defaultValue={jobTitle}
              className="settings-input w-full rounded-lg px-4 py-3"
              placeholder="Your role"
            />
          </div>
        </div>
      </div>
    );
  },
);

ProfilePersonalInfo.displayName = "ProfilePersonalInfo";
