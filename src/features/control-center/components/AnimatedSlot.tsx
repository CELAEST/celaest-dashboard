"use client";

import { AnimatePresence, motion } from "motion/react";
import { ReactNode } from "react";

interface AnimatedSlotProps {
  children: ReactNode;
  activeKey: string;
}

export const AnimatedSlot = ({ children, activeKey }: AnimatedSlotProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeKey}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="h-full min-h-0 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
