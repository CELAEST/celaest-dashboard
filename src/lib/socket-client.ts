/**
 * Socket Client global - celaest-back /ws
 * Una conexión global, eventos desacoplados de la UI
 * Requiere JWT para autenticación
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

  connect(token: string, orgId?: string): void {
    if (typeof window === "undefined") return;
    
    const targetOrgId = orgId || null;
    
    // Si ya estamos conectados con el mismo token y org, no re-conectar
    if (this.ws?.readyState === WebSocket.OPEN && 
        this.token === token && 
        this.currentOrgId === targetOrgId) {
      return;
    }

    // Si el token cambió pero estamos conectados, desconectar para refrescar
    if (this.ws && (this.token !== token || this.currentOrgId !== targetOrgId)) {
      this.disconnect();
    }

    this.token = token;
    this.currentOrgId = targetOrgId;
    this.isIntentionalDisconnect = false;
    this.reconnectAttempts = 0; // Reset attempts on manual connect
    
    this.setupConnection();
  }

  private setupConnection(): void {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.pingInterval) clearInterval(this.pingInterval);

    if (!this.token) return;

    // Use Sec-WebSocket-Protocol for the token to avoid URL exposure in logs
    // The backend must be configured to extract the token from this header
    const url = new URL(getWsUrl());
    url.searchParams.append("token", this.token);
    if (this.currentOrgId) {
      url.searchParams.append("org_id", this.currentOrgId);
    }
    
    try {
      this.ws = new WebSocket(url);
    } catch (e: unknown) {
      logger.error("WebSocket connection error:", e);
      this.handleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      console.log("[SocketClient] Connected to WebSocket at", getWsUrl());
      
      // Setup keepalive ping every 30 seconds
      this.pingInterval = setInterval(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: "ping" }));
        }
      }, 30000);
    };

    this.ws.onmessage = (event) => {
      try {
        const rawData = JSON.parse(event.data);
        console.log("[SocketClient] INCOMING:", rawData);
        
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
        // Ignorar mensajes no JSON o pongs
      }
    };

    this.ws.onclose = () => {
      if (!this.isIntentionalDisconnect) {
        this.handleReconnect();
      }
    };

    this.ws.onerror = () => {
      // Browser ws API fires onerror before onclose, keep minimal logic here
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
    if (this.pingInterval) clearInterval(this.pingInterval);
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.token = null;
    this.currentOrgId = null;
  }

  /**
   * Solo para pruebas: Simula la llegada de un evento por el socket
   */
  simulateEvent(type: string, payload: unknown): void {
    console.log(`[SocketClient] SIMULATED INCOMING: ${type}`, payload);
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach((fn) => fn(payload));
    }
    this.listeners.get("*")?.forEach((fn) => fn({ type, payload }));
  }
}

export const socket = new SocketClient();
