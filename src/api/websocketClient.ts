type MessageHandler = (data: any) => void;

class WebSocketClient {
	private ws: WebSocket | null = null;
	private url: string;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private messageHandlers: Map<string, Set<MessageHandler>> = new Map();

	constructor(url: string) {
		this.url = url;
	}

	connect() {
		try {
			this.ws = new WebSocket(this.url);
			this.setupEventListeners();
		} catch (error) {
			console.error("WebSocket connection error:", error);
			this.handleReconnect();
		}
	}

	private setupEventListeners() {
		if (!this.ws) return;

		this.ws.onopen = () => {
			console.log("WebSocket connected");
			this.reconnectAttempts = 0;
		};

		this.ws.onclose = () => {
			console.log("WebSocket disconnected");
			this.handleReconnect();
		};

		this.ws.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		this.ws.onmessage = (event) => {
			try {
				const { type, data } = JSON.parse(event.data);
				this.handleMessage(type, data);
			} catch (error) {
				console.error("Error parsing WebSocket message:", error);
			}
		};
	}

	private handleReconnect() {
		if (this.reconnectAttempts < this.maxReconnectAttempts) {
			this.reconnectAttempts++;
			const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
			setTimeout(() => this.connect(), delay);
		}
	}

	subscribe(type: string, handler: MessageHandler) {
		if (!this.messageHandlers.has(type)) {
			this.messageHandlers.set(type, new Set());
		}
		this.messageHandlers.get(type)?.add(handler);
	}

	unsubscribe(type: string, handler: MessageHandler) {
		this.messageHandlers.get(type)?.delete(handler);
	}

	private handleMessage(type: string, data: any) {
		const handlers = this.messageHandlers.get(type);
		if (handlers) {
			for (const handler of handlers) {
				handler(data);
			}
		}
	}

	send(type: string, data: any) {
		if (this.ws?.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify({ type, data }));
		} else {
			console.error("WebSocket is not connected");
		}
	}

	disconnect() {
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}
	}
}

const wsUrl = import.meta.env["VITE_WS_URL"] || "ws://localhost:3000";
export const websocketClient = new WebSocketClient(wsUrl);
