"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isLoading ? onClose : undefined}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-100"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={!isLoading ? onClose : undefined}
            className="fixed inset-0 flex items-center justify-center z-101 p-4"
          >
            <div className="relative w-full max-w-md">
              <SignOutCard
                onClose={onClose}
                onConfirm={handleSignOut}
                isLoading={isLoading}
                isDemo={isDemo}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
