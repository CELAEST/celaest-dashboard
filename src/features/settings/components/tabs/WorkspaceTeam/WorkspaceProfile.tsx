import React, { memo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { toast } from "sonner";
import { FormInput } from "@/components/forms";
import {
  WorkspaceProfileFormData,
  workspaceProfileSchema,
} from "@/lib/validation/schemas/settings";

export const WorkspaceProfile: React.FC = memo(() => {
  const { isDark } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkspaceProfileFormData>({
    resolver: zodResolver(workspaceProfileSchema),
    defaultValues: {
      workspaceName: "Celaest Headquarters",
      slug: "hq",
    },
    mode: "onBlur",
  });

  const onSubmit = (data: WorkspaceProfileFormData) => {
    console.log("Workspace updated:", data);
    toast.success("Workspace profile updated");
  };

  return (
    <div className="settings-glass-card rounded-2xl p-6">
      <div className="flex justify-between items-start mb-6">
        <h3
          className={`text-lg font-bold flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <Globe className="w-5 h-5 text-cyan-500" />
          Workspace Profile
        </h3>

        {/* Autosave indicator or save button could go here */}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            control={control}
            name="workspaceName"
            label="Workspace Name"
            placeholder="My Workspace"
          />

          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Workspace URL
            </label>
            <div className="flex">
              <span
                className={`flex items-center px-4 rounded-l-xl border-y border-l text-sm transition-colors ${
                  isDark
                    ? "bg-white/5 border-white/10 text-gray-500"
                    : "bg-gray-50 border-gray-200 text-gray-400"
                } ${errors.slug ? (isDark ? "border-red-500/50" : "border-red-400") : ""}`}
              >
                celaest.io/
              </span>
              <Controller
                control={control}
                name="slug"
                render={({ field, fieldState: { error } }) => (
                  <input
                    {...field}
                    type="text"
                    className={`
                      settings-input w-full rounded-r-xl px-4 py-2.5 border-y border-r text-sm
                      focus:outline-none focus:ring-2 focus:ring-opacity-50
                      ${
                        error
                          ? isDark
                            ? "border-red-500/50 focus:ring-red-500/30 bg-red-500/5"
                            : "border-red-400 focus:ring-red-500/30 bg-red-50"
                          : isDark
                            ? "border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                            : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50"
                      }
                    `}
                    placeholder="slug"
                  />
                )}
              />
            </div>
            {errors.slug && (
              <p
                className={`mt-1 text-xs font-medium ${
                  isDark ? "text-red-400" : "text-red-500"
                }`}
              >
                {errors.slug.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
});

WorkspaceProfile.displayName = "WorkspaceProfile";
