import { useEffect } from "react";

/**
 * Performance-optimized hook for handling Escape key presses.
 * Creates a single event listener with proper cleanup.
 *
 * @param onClose - Callback to execute when Escape is pressed
 * @param isEnabled - Whether the listener should be active (typically modal open state)
 */
export function useEscapeKey(onClose: () => void, isEnabled = true) {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isEnabled]);
}
