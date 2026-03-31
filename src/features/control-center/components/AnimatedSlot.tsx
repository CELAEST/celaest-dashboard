"use client";

import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useRef } from "react";

interface AnimatedSlotProps {
  /** The current active key — changing this triggers the enter/exit animation. */
  activeKey: string;
  /**
   * Render function called with the key that was active when this slot was
   * CREATED (mounted). The frozen key ensures that the exiting motion.div
   * keeps rendering its original content rather than updating to the new
   * feature, which would cause a double-mount (and extra requests) while the
   * exit animation is still running.
   *
   * Without this freeze, FeatureLoader reads activeTab from the router and
   * switches content mid-animation, mounting the new feature twice:
   *   1. Inside the exiting motion.div (wrong feature, briefly)
   *   2. Inside the entering motion.div (correct feature)
   */
  render: (frozenKey: string) => ReactNode;
}

/**
 * FrozenSlot — captures its tabKey at mount time so that the exit animation
 * always renders the ORIGINAL feature, not the incoming one.
 */
const FrozenSlot = ({
  tabKey,
  render,
}: {
  tabKey: string;
  render: (key: string) => ReactNode;
}) => {
  // useRef initialValue is only used on the FIRST render of this component
  // instance. Subsequent re-renders return the same ref with the frozen value.
  const frozenKey = useRef(tabKey).current;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="h-full w-full min-h-0 min-w-0 flex flex-col"
    >
      {render(frozenKey)}
    </motion.div>
  );
};

export const AnimatedSlot = ({ activeKey, render }: AnimatedSlotProps) => {
  return (
    <AnimatePresence mode="wait">
      {/* key={activeKey} tells AnimatePresence which slot to exit/enter.
          FrozenSlot internally freezes the key so it keeps rendering the
          original feature during the 200ms exit animation. */}
      <FrozenSlot key={activeKey} tabKey={activeKey} render={render} />
    </AnimatePresence>
  );
};
