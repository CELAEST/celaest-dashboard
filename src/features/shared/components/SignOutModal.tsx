import React, { useState } from "react";
import { createPortal } from "react-dom";
import { SignOutCard } from "./SignOutCard";

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDemo?: boolean;
}

export const SignOutModal: React.FC<SignOutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDemo = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 800));
    onConfirm();
    setIsLoading(false);
  };

  // Handle Esc key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isLoading]);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
    if (!mounted) {
      return;
    }

    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, mounted]);

  if (!mounted || !isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-120 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={!isLoading ? onClose : undefined}
        className="absolute inset-0 bg-black/65 backdrop-blur-md animate-modal-backdrop"
      />

      <div className="relative z-10 flex w-full items-center justify-center pointer-events-none">
        <div
          onClick={(event) => event.stopPropagation()}
          className="pointer-events-auto relative shrink-0 w-136 min-w-80 sm:min-w-136 max-w-[90vw] animate-modal-content"
        >
          <SignOutCard
            onClose={onClose}
            onConfirm={handleSignOut}
            isLoading={isLoading}
            isDemo={isDemo}
          />
        </div>
      </div>
    </div>
    ,
    document.body,
  );
};
