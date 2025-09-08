// src/core/client.ts
import { Message } from "./messages";

type SubscribeCallback = (msg: Message) => void;

export interface AIClient {
  send: (message: Message) => void;
  subscribe: (cb: SubscribeCallback) => { unsubscribe: () => void };
}

export interface AIClientOptions {
  endpoint: string;
  headers?: Record<string, string>;
}

// Simple in-memory subscription manager
class SubscriptionManager {
  private callbacks = new Set<SubscribeCallback>();
  subscribe(cb: SubscribeCallback) {
    this.callbacks.add(cb);
    return { unsubscribe: () => this.callbacks.delete(cb) };
  }
  emit(msg: Message) {
    this.callbacks.forEach((cb) => cb(msg));
  }
}

export class DefaultAIClient implements AIClient {
  private endpoint: string;
  private headers?: Record<string, string>;
  private subs = new SubscriptionManager();
  // AI SDK backend: HTTP-only

  constructor(opts: AIClientOptions) {
    this.endpoint = opts.endpoint;
    this.headers = opts.headers;
  }

  // No WS/SSE initialization paths; responses are emitted from HTTP results

  async send(message: Message) {
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.headers,
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Current message being built from streaming chunks
      let currentMessage: Partial<Message> | null = null;
      let currentTextContent = "";

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6); // Remove 'data: ' prefix
            
            if (data === '[DONE]') {
              // Stream is complete
              if (currentMessage) {
                this.subs.emit(currentMessage as Message);
              }
              return;
            }

            try {
              const parsed = JSON.parse(data);
              this.handleStreamEvent(parsed, currentMessage, currentTextContent);
              
              // Update current message and text content based on event
              if (parsed.type === 'start') {
                currentMessage = {
                  id: crypto.randomUUID(),
                  role: 'assistant',
                  parts: [],
                  createdAt: Date.now(),
                };
                currentTextContent = "";
              } else if (parsed.type === 'text-start') {
                // Initialize text part
                if (currentMessage && !currentMessage.parts?.find(p => p.type === 'text')) {
                  currentMessage.parts = [...(currentMessage.parts || []), { type: 'text', text: '' }];
                }
              } else if (parsed.type === 'text-delta' && parsed.delta) {
                currentTextContent += parsed.delta;
                // Update the text part in current message
                if (currentMessage && currentMessage.parts) {
                  const textPart = currentMessage.parts.find(p => p.type === 'text') as { type: 'text', text: string } | undefined;
                  if (textPart) {
                    textPart.text = currentTextContent;
                  }
                }
                // Emit updated message for real-time display
                if (currentMessage) {
                  this.subs.emit({ ...currentMessage } as Message);
                }
              } else if (parsed.type === 'text-end') {
                // Final text part is complete
                if (currentMessage && currentMessage.parts) {
                  const textPart = currentMessage.parts.find(p => p.type === 'text') as { type: 'text', text: string } | undefined;
                  if (textPart) {
                    textPart.text = currentTextContent;
                  }
                }
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', data, e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream error:', error);
      // Emit error message
      this.subs.emit({
        id: crypto.randomUUID(),
        role: 'assistant',
        parts: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        createdAt: Date.now(),
      });
    }
  }

  private handleStreamEvent(event: any, currentMessage: Partial<Message> | null, currentTextContent: string) {
    // Handle different event types if needed for debugging or special processing
    switch (event.type) {
      case 'start':
        console.log('Stream started');
        break;
      case 'start-step':
        console.log('Step started');
        break;
      case 'text-start':
        console.log('Text started:', event.id);
        break;
      case 'text-delta':
        // Real-time text updates are handled in the main loop
        break;
      case 'text-end':
        console.log('Text ended:', event.id);
        break;
      case 'finish-step':
        console.log('Step finished');
        break;
      case 'finish':
        console.log('Stream finished');
        break;
      default:
        console.log('Unknown event type:', event.type, event);
    }
  }

  subscribe(cb: SubscribeCallback) {
    return this.subs.subscribe(cb);
  }
}
