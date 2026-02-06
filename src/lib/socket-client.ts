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

  connect(token: string): void {
    if (typeof window === "undefined") return;
    if (this.ws?.readyState === WebSocket.OPEN && this.token === token) return;

    this.token = token;
    const url = getWsUrl() + (token ? `?token=${encodeURIComponent(token)}` : "");
    this.ws = new WebSocket(url);

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const type = msg.type || msg.event;
        const payload = msg.payload ?? msg;
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
