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

class SocketClient {
  private ws: WebSocket | null = null;
  private listeners = new Map<string, Set<Listener>>();
  private token: string | null = null;
  private currentOrgId: string | null = null;

  connect(token: string, orgId?: string): void {
    if (typeof window === "undefined") return;
    
    const targetOrgId = orgId || null;
    if (this.ws?.readyState === WebSocket.OPEN && this.token === token && this.currentOrgId === targetOrgId) return;

    this.token = token;
    this.currentOrgId = targetOrgId;
    let url = getWsUrl() + (token ? `?token=${encodeURIComponent(token)}` : "");
    if (orgId) {
      url += `&org_id=${orgId}`;
    }
    this.ws = new WebSocket(url);

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        
        // Backend sends: { type: "event", data: { type: "order.created", ... } }
        let type = msg.type || msg.event;
        let payload = msg.payload ?? msg;

        // Unwrap the real event if it's wrapped
        if (type === "event" && msg.data && msg.data.type) {
            type = msg.data.type;
            payload = msg.data;
        }

        const handlers = this.listeners.get(type);
        if (handlers) {
          handlers.forEach((fn) => fn(payload));
        }
        this.listeners.get("*")?.forEach((fn) => fn({ type, payload }));
      } catch {
        // Ignorar mensajes no JSON
      }
    };
  }

  on(event: string, fn: Listener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(fn);
    return () => this.listeners.get(event)?.delete(fn);
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
    this.token = null;
  }
}

export const socket = new SocketClient();
