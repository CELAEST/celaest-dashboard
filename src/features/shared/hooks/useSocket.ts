"use client";

import { useEffect, useRef } from "react";
import { socket } from "@/lib/socket-client";

/**
 * Enterprise hook to manage socket listeners with automatic cleanup.
 * @param event - The event name to listen for.
 * @param callback - The function to call when the event is received.
 * @param enabled - Optional flag to enable/disable the listener.
 */
export function useSocket<T = unknown>(
  event: string,
  callback: (payload: T) => void,
  enabled: boolean = true
) {
  const callbackRef = useRef(callback);

  // Update ref when callback changes to avoid effect re-runs while maintaining fresh logic
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const handler = (payload: unknown) => {
      callbackRef.current(payload as T);
    };

    // Subscribirse usando el cliente global
    const unsubscribe = socket.on(event, handler);

    return () => {
      unsubscribe();
    };
  }, [event, enabled]);

  return socket;
}
