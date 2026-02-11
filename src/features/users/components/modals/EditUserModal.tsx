import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Shield, Check } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { UserData } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
  onConfirm: (
    userId: string,
    data: { first_name: string; last_name: string; role: string },
  ) => Promise<void>;
}

const roles = [
  {
    id: "viewer",
    label: "Viewer",
    description: "Can view data but cannot make changes.",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "operator",
    label: "Operator",
    description: "Can manage day-to-day operations.",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "manager",
    label: "Manager",
    description: "Full access to specific areas.",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  {
    id: "admin",
    label: "Admin",
    description: "Full system access and settings.",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "super_admin",
    label: "Super Admin",
    description: "God mode. Full access to everything.",
    color: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  },
];

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirm,
}) => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    role: "viewer",
  });

  useEffect(() => {
    if (user && isOpen) {
      setSuccess(false);
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        role: user.role || "viewer",
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await onConfirm(user.id, formData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-none",
        )}
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                "flex flex-col items-center justify-center p-12 rounded-3xl backdrop-blur-3xl border shadow-2xl",
                isDark
                  ? "bg-black/80 border-white/10"
                  : "bg-white/90 border-gray-200",
              )}
            >
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                <Check className="w-10 h-10 text-green-400" />
              </div>
              <h2
                className={cn(
                  "text-2xl font-bold mb-2",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                Changes Saved!
              </h2>
              <p
                className={cn(
                  "text-center",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                User profile has been updated successfully.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={cn(
                "rounded-3xl backdrop-blur-3xl border shadow-2xl overflow-hidden",
                isDark
                  ? "bg-[#0a0a0a]/90 border-white/10"
                  : "bg-white/95 border-gray-200",
              )}
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 bg-white/5 relative overflow-hidden">
                <div className="relative z-10">
                  <h2
                    className={cn(
                      "text-xl font-bold",
                      isDark ? "text-white" : "text-gray-900",
                    )}
                  >
                    Edit User Profile
                  </h2>
                  <p
                    className={cn(
                      "text-sm mt-1",
                      isDark ? "text-gray-400" : "text-gray-500",
                    )}
                  >
                    Update details for {user?.email}
                  </p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <User size={100} />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      className={isDark ? "text-gray-400" : "text-gray-600"}
                    >
                      First Name
                    </Label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-2.5 text-gray-500"
                        size={16}
                      />
                      <Input
                        value={formData.first_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            first_name: e.target.value,
                          })
                        }
                        className={cn(
                          "pl-10 h-10 transition-all duration-200",
                          isDark
                            ? "bg-white/5 border-white/10 focus:bg-white/10"
                            : "bg-gray-50",
                        )}
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      className={isDark ? "text-gray-400" : "text-gray-600"}
                    >
                      Last Name
                    </Label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-2.5 text-gray-500"
                        size={16}
                      />
                      <Input
                        value={formData.last_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            last_name: e.target.value,
                          })
                        }
                        className={cn(
                          "pl-10 h-10 transition-all duration-200",
                          isDark
                            ? "bg-white/5 border-white/10 focus:bg-white/10"
                            : "bg-gray-50",
                        )}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  <Label className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Access Level
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        onClick={() =>
                          setFormData({ ...formData, role: role.id })
                        }
                        className={cn(
                          "cursor-pointer p-3 rounded-xl border transition-all duration-200 relative overflow-hidden group",
                          formData.role === role.id
                            ? cn(
                                "border-transparent ring-2",
                                isDark ? "ring-white/20" : "ring-black/10",
                                role.color,
                              )
                            : isDark
                              ? "bg-white/5 border-white/5 hover:bg-white/10"
                              : "bg-gray-50 border-gray-100 hover:bg-gray-100",
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Shield
                            size={14}
                            className={
                              formData.role === role.id
                                ? "opacity-100"
                                : "opacity-50"
                            }
                          />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {role.label}
                          </span>
                        </div>
                        <p
                          className={cn("text-[10px] leading-tight opacity-70")}
                        >
                          {role.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={loading}
                    className="hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20 transition-all",
                      loading && "opacity-80",
                    )}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
