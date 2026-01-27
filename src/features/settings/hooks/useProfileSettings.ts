import { useState, useCallback } from "react";
import { toast } from "sonner";

export const useProfileSettings = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("account");

  const [connectedAccounts, setConnectedAccounts] = useState<
    Record<"google" | "github", boolean>
  >({
    google: true,
    github: false,
  });

  const handleAvatarUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarUrl(reader.result as string);
          toast.success("Profile picture updated");
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  const handleRemoveAvatar = useCallback(() => {
    setAvatarUrl(null);
    toast.success("Profile picture removed");
  }, []);

  const handleEmailChange = useCallback((newEmail: string) => {
    console.log("Email change requested:", newEmail);
    // In a real app, this would be an API call
    toast.success(`Verification email sent to ${newEmail}`);
  }, []);

  const toggleAccount = useCallback((provider: "google" | "github") => {
    setConnectedAccounts((prev) => {
      const newState = !prev[provider];
      toast.success(
        `${provider} account ${newState ? "connected" : "disconnected"}`,
      );
      return {
        ...prev,
        [provider]: newState,
      };
    });
  }, []);

  const saveProfile = useCallback(() => {
    // API call would go here
    toast.success("Profile updated successfully");
  }, []);

  return {
    avatarUrl,
    activeTab,
    setActiveTab,
    connectedAccounts,
    handleAvatarUpload,
    handleRemoveAvatar,
    handleEmailChange,
    toggleAccount,
    saveProfile,
  };
};
