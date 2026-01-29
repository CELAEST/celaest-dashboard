import { useEffect } from "react";

/**
 * Performance-optimized hook for handling Enter key presses in forms.
 * Creates a single event listener with proper cleanup.
 *
 * @param onSubmit - Callback to execute when Enter is pressed
 * @param isEnabled - Whether the listener should be active
 */
export function useEnterSubmit(onSubmit: () => void, isEnabled = true) {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        // Don't submit if user is in a textarea (allow Shift+Enter for new lines)
        const target = event.target as HTMLElement;
        if (target.tagName === "TEXTAREA") return;

        event.preventDefault();
        onSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSubmit, isEnabled]);
}
