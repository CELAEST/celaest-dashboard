/**
 * Socket Client — celaest-back /ws
 * Single global connection, events decoupled from UI.
 * Requires JWT for authentication via Sec-WebSocket-Protocol header.
 */

const getWsUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_CELAEST_API_URL || "http://localhost:3001";
  return apiUrl.replace(/^http/, "ws") + "/ws";
};

type Listener = (payload: unknown) => void;

import { logger } from "./logger";

class SocketClient {
  private ws: WebSocket | null = null;
  private listeners = new Map<string, Set<Listener>>();
  private token: string | null = null;
  private currentOrgId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectDelay = 30000;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private isIntentionalDisconnect = false;
  private visibilityTimeout: NodeJS.Timeout | null = null;
  private hasVisibilityListener = false;
  private readonly VISIBILITY_DISCONNECT_MS = 5 * 60 * 1000; // 5 minutes
  connect(token: string, orgId?: string): void {
    if (typeof window === "undefined") return;
    
    const targetOrgId = orgId || null;
    
    // If already connected with same token and org, skip
    if (this.ws?.readyState === WebSocket.OPEN && 
        this.token === token && 
        this.currentOrgId === targetOrgId) {
      return;
    }

    // If token changed but connected, disconnect to refresh
    if (this.ws && (this.token !== token || this.currentOrgId !== targetOrgId)) {
      this.disconnect();
    }

    this.token = token;
    this.currentOrgId = targetOrgId;
    this.isIntentionalDisconnect = false;
    this.reconnectAttempts = 0;
    
    this.setupVisibilityListener();
    this.setupConnection();
  }

  private setupVisibilityListener(): void {
    if (typeof document === "undefined" || this.hasVisibilityListener) return;

    this.hasVisibilityListener = true;
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        if (this.visibilityTimeout) clearTimeout(this.visibilityTimeout);
        this.visibilityTimeout = setTimeout(() => {
          logger.debug("[SocketClient] Page hidden for 5mins. Disconnecting socket to save resources.");
          if (this.ws?.readyState === WebSocket.OPEN) {
             this.isIntentionalDisconnect = true; // prevent auto handleReconnect
             this.ws.close();
             if (this.pingInterval) clearInterval(this.pingInterval);
          }
        }, this.VISIBILITY_DISCONNECT_MS);
      } else {
        if (this.visibilityTimeout) {
          clearTimeout(this.visibilityTimeout);
          this.visibilityTimeout = null;
        }
        
        // Reconnect immediately if we had disconnected
        if (!this.ws || this.ws.readyState === WebSocket.CLOSED || this.ws.readyState === WebSocket.CLOSING) {
          if (this.token) {
            logger.debug("[SocketClient] Page visible. Reconnecting socket immediately.");
            this.isIntentionalDisconnect = false;
            this.reconnectAttempts = 0;
            this.setupConnection();
          }
        }
      }
    });
  }

  private setupConnection(): void {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.pingInterval) clearInterval(this.pingInterval);

    if (!this.token) return;

    // SECURITY: Send JWT via Sec-WebSocket-Protocol header instead of URL query.
    // This prevents the token from appearing in server access logs, proxy logs,
    // and browser history. The backend extracts it from the protocol header.
    const url = new URL(getWsUrl());
    if (this.currentOrgId) {
      url.searchParams.append("org_id", this.currentOrgId);
    }
    
    try {
      // Pass token as WebSocket sub-protocol — browser sends it via
      // Sec-WebSocket-Protocol header, never in the URL.
      this.ws = new WebSocket(url, [this.token]);
    } catch (e: unknown) {
      logger.error("WebSocket connection error:", e);
      this.handleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      logger.debug("[SocketClient] Connected");
      
      // Keepalive ping every 30 seconds
      this.pingInterval = setInterval(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: "ping" }));
        }
      }, 30000);
    };

    this.ws.onmessage = (event) => {
      try {
        const rawData = JSON.parse(event.data);
        
        // Backend sends: { type: "event", event: "order.created", payload: {...} }
        let type = rawData.event || rawData.type;
        let payload = rawData.payload ?? rawData;

        // Unwrap the real event if it's wrapped inside `data` (legacy compatibility)
        if (type === "event" && rawData.data && rawData.data.type) {
            type = rawData.data.type;
            payload = rawData.data.payload ?? rawData.data;
        }

        const handlers = this.listeners.get(type);
        if (handlers) {
          handlers.forEach((fn) => fn(payload));
        }
        this.listeners.get("*")?.forEach((fn) => fn({ type, payload }));
      } catch {
        // Ignore non-JSON messages or pongs
      }
    };

    this.ws.onclose = () => {
      if (!this.isIntentionalDisconnect) {
        this.handleReconnect();
      }
    };

    this.ws.onerror = () => {
      // Browser WS API fires onerror before onclose, keep minimal logic here
    };
  }

  private handleReconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.pingInterval) clearInterval(this.pingInterval);

    // Exponential backoff: 1s, 2s, 4s, 8s, up to 30s max
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), this.maxReconnectDelay);
    this.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      if (this.token && !this.isIntentionalDisconnect) {
        this.setupConnection();
      }
    }, delay);
  }

  on(event: string, fn: Listener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(fn);
    return () => this.listeners.get(event)?.delete(fn);
  }

  disconnect(): void {
    this.isIntentionalDisconnect = true;
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.visibilityTimeout) clearTimeout(this.visibilityTimeout);
    if (this.pingInterval) clearInterval(this.pingInterval);
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.token = null;
    this.currentOrgId = null;
  }

  /**
   * Simulate an incoming socket event. Development only — stripped from production builds.
   */
  simulateEvent(type: string, payload: unknown): void {
    if (process.env.NODE_ENV === "production") return;
    
    logger.debug(`[SocketClient] SIMULATED: ${type}`);
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach((fn) => fn(payload));
    }
    this.listeners.get("*")?.forEach((fn) => fn({ type, payload }));
  }
}

export const socket = new SocketClient();
