import React, { useRef, useEffect } from "react";

interface UseSwipeDownToCloseOptions {
  onClose: () => void;
  threshold?: number;
}

/**
 * useSwipeDownToClose
 *
 * Implements the CELAEST / Lingua Standard swipe-down-to-close gesture
 * for mobile bottom-sheet modals.
 *
 * Features:
 * 1. Velocity + Distance detection (Casual quick flick down or drag > 45px dismisses).
 * 2. Header and Drag-pill dragging (touch + mouse/pointer).
 * 3. Body pull-down when scrolled at top (scrollTop <= 0).
 * 4. Tap-on-pill instant dismiss with slide-down animation.
 * 5. Physics resistance when dragging upwards.
 * 6. Resets CSS animation to 'none' on touch so keyframe forwards never lock transforms.
 * 7. Background scroll locking when open.
 */
export function useSwipeDownToClose({
  onClose,
  threshold = 45,
}: UseSwipeDownToCloseOptions) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const handlePillRef = useRef<HTMLDivElement>(null);
  const touchStartYRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);
  const touchDeltaRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const isPullingFromBodyRef = useRef<boolean>(false);

  // Lock body scroll while modal is mounted
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const startDrag = (clientY: number, target: EventTarget | null) => {
    if ((target as HTMLElement)?.closest?.("button, a, input, textarea, select")) return;
    touchStartYRef.current = clientY;
    touchStartTimeRef.current = Date.now();
    touchDeltaRef.current = 0;
    isDraggingRef.current = true;
    isPullingFromBodyRef.current = false;

    if (sheetRef.current) {
      sheetRef.current.style.animation = "none";
    }

    if (handlePillRef.current) {
      handlePillRef.current.style.width = "48px";
      handlePillRef.current.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
    }
  };

  const moveDrag = (clientY: number) => {
    if (!isDraggingRef.current || !sheetRef.current) return;
    const delta = clientY - touchStartYRef.current;
    touchDeltaRef.current = delta;

    sheetRef.current.style.transition = "none";
    if (delta > 0) {
      sheetRef.current.style.transform = `translate3d(0, ${delta}px, 0)`;
      const opacity = Math.max(0.3, 1 - delta / 320);
      sheetRef.current.style.opacity = `${opacity}`;
    } else {
      // Elastic resistance when dragging upwards
      sheetRef.current.style.transform = `translate3d(0, ${delta * 0.15}px, 0)`;
      sheetRef.current.style.opacity = "1";
    }
  };

  const endDrag = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    isPullingFromBodyRef.current = false;

    if (handlePillRef.current) {
      handlePillRef.current.style.width = "40px";
      handlePillRef.current.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    }

    const delta = touchDeltaRef.current;
    const timeElapsed = Date.now() - touchStartTimeRef.current;
    const velocity = delta / Math.max(timeElapsed, 1);

    // Either dragged past threshold (45px) OR flicked down with velocity (> 0.25 px/ms and > 20px)
    const shouldClose = delta > threshold || (velocity > 0.25 && delta > 20);

    if (sheetRef.current) {
      if (shouldClose) {
        sheetRef.current.style.transition =
          "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease-out";
        sheetRef.current.style.transform = "translate3d(0, 100%, 0)";
        sheetRef.current.style.opacity = "0";
        setTimeout(() => {
          onClose();
          if (sheetRef.current) {
            sheetRef.current.style.transform = "";
            sheetRef.current.style.opacity = "";
            sheetRef.current.style.transition = "";
          }
        }, 180);
      } else {
        // Snap back to top with spring feel
        sheetRef.current.style.transition =
          "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease-out";
        sheetRef.current.style.transform = "translate3d(0, 0, 0)";
        sheetRef.current.style.opacity = "1";
      }
    }
    touchDeltaRef.current = 0;
  };

  // ── Touch Events (Mobile) ──
  const handleTouchStart = (e: React.TouchEvent) => {
    startDrag(e.touches[0].clientY, e.target);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    moveDrag(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    endDrag();
  };

  // ── Pointer / Mouse Events (Responsive Emulators) ──
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startDrag(e.clientY, e.target);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    moveDrag(e.clientY);
  };

  const handlePointerUp = () => {
    endDrag();
  };

  // ── Body Scroll-Aware Pull Down (When at top of modal scroll) ──
  const handleBodyTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement)?.closest?.("button, a, input, textarea, select")) return;
    touchStartYRef.current = e.touches[0].clientY;
    touchStartTimeRef.current = Date.now();
    touchDeltaRef.current = 0;
    if (bodyRef.current && bodyRef.current.scrollTop <= 0) {
      isPullingFromBodyRef.current = true;
    } else {
      isPullingFromBodyRef.current = false;
    }
  };

  const handleBodyTouchMove = (e: React.TouchEvent) => {
    if (!isPullingFromBodyRef.current || !sheetRef.current || !bodyRef.current) return;
    if (bodyRef.current.scrollTop > 0) {
      isPullingFromBodyRef.current = false;
      return;
    }
    const currentY = e.touches[0].clientY;
    const delta = currentY - touchStartYRef.current;
    if (delta > 0) {
      isDraggingRef.current = true;
      touchDeltaRef.current = delta;
      sheetRef.current.style.animation = "none";
      sheetRef.current.style.transition = "none";
      sheetRef.current.style.transform = `translate3d(0, ${delta * 0.85}px, 0)`;
      const opacity = Math.max(0.3, 1 - (delta * 0.85) / 320);
      sheetRef.current.style.opacity = `${opacity}`;
      if (handlePillRef.current) {
        handlePillRef.current.style.width = "48px";
        handlePillRef.current.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
      }
    }
  };

  const handleBodyTouchEnd = () => {
    if (isDraggingRef.current || isPullingFromBodyRef.current) {
      isPullingFromBodyRef.current = false;
      endDrag();
    }
  };

  // ── Tap on Pill to Close Immediately ──
  const handlePillClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (sheetRef.current) {
      sheetRef.current.style.animation = "none";
      sheetRef.current.style.transition =
        "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease-out";
      sheetRef.current.style.transform = "translate3d(0, 100%, 0)";
      sheetRef.current.style.opacity = "0";
    }
    setTimeout(() => {
      onClose();
      if (sheetRef.current) {
        sheetRef.current.style.transform = "";
        sheetRef.current.style.opacity = "";
        sheetRef.current.style.transition = "";
      }
    }, 180);
  };

  return {
    sheetRef,
    bodyRef,
    handlePillRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleBodyTouchStart,
    handleBodyTouchMove,
    handleBodyTouchEnd,
    handlePillClick,
  };
}
