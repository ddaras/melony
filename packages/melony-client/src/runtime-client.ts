import { MelonyEvent, MelonyMessage, generateId } from "@melony/core/browser";

import { TransportFn, TransportRequest } from "./transport";

export interface MelonyRuntimeClientOptions {
  transport?: TransportFn;
  threadId?: string; // Optional: provide existing threadId, or one will be generated
}

export interface MelonyRuntimeClientState {
  events: MelonyEvent[];
  messages: MelonyMessage[];
  isLoading: boolean;
  error: Error | null;
  threadId: string;
}

export class MelonyRuntimeClient {
  private transport: TransportFn;
  private state: MelonyRuntimeClientState = {
    events: [],
    messages: [],
    isLoading: false,
    error: null,
    threadId: generateId(),
  };
  private abortController: AbortController | null = null;
  private stateListeners: Set<(state: MelonyRuntimeClientState) => void> =
    new Set();

  constructor(options: MelonyRuntimeClientOptions) {
    if (options.transport) {
      this.transport = options.transport;
    } else {
      throw new Error("Transport must be provided to MelonyRuntimeClient");
    }

    // Use provided threadId or keep generated one
    if (options.threadId) {
      this.state.threadId = options.threadId;
    }
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: MelonyRuntimeClientState) => void): () => void {
    this.stateListeners.add(listener);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  /**
   * Get current state
   */
  getState(): MelonyRuntimeClientState {
    return { ...this.state };
  }

  /**
   * Update state and notify listeners
   */
  private setState(updates: Partial<MelonyRuntimeClientState>): void {
    this.state = { ...this.state, ...updates };
    this.stateListeners.forEach((listener) => listener(this.getState()));
  }

  /**
   * Send a message and stream events (chat-based API)
   * Only sends the new message with threadId - backend can fetch history if needed
   */
  async *sendMessage(message: MelonyMessage): AsyncGenerator<MelonyEvent> {
    // Abort previous run if still in progress
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();
    this.setState({ isLoading: true, error: null });

    // Add message to state
    const updatedMessages = [...this.state.messages, message];
    this.setState({ messages: updatedMessages });

    // Track which message index corresponds to which runId
    const runIdToMessageIndex = new Map<string | undefined, number>();

    try {
      // Send only the new message with threadId
      const transportRequest: TransportRequest = {
        message,
        threadId: this.state.threadId,
      };
      const stream = await this.transport(
        transportRequest,
        this.abortController.signal
      );

      if (!stream) {
        throw new Error("No stream returned from transport");
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        if (this.abortController?.signal.aborted) {
          reader.cancel();
          break;
        }

        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.trim() === "") continue;

          if (line.startsWith("data: ")) {
            try {
              const event: MelonyEvent = JSON.parse(line.slice(6));
              
              // Update events array for backward compatibility
              this.setState({
                events: [...this.state.events, event],
              });

              // Get or create message for this runId
              const eventRunId = event.runId;
              let messageIndex = runIdToMessageIndex.get(eventRunId);

              if (messageIndex === undefined) {
                // Create new assistant message for this runId
                const assistantMessage: MelonyMessage = {
                  role: "assistant",
                  content: [event],
                  runId: eventRunId,
                };
                
                const currentMessages = [...this.state.messages];
                messageIndex = currentMessages.length;
                currentMessages.push(assistantMessage);
                runIdToMessageIndex.set(eventRunId, messageIndex);
                
                this.setState({ messages: currentMessages });
              } else {
                // Append event to existing message
                const currentMessages = [...this.state.messages];
                const existingMessage = currentMessages[messageIndex];
                
                if (existingMessage && existingMessage.role === "assistant") {
                  const updatedContent = [...existingMessage.content];
                  
                  // Check if this is a text-delta event that should be merged
                  if (event.type === "text-delta" && event.data?.delta) {
                    // Find the last text-delta event in the content (search backwards)
                    let lastTextDeltaIndex = -1;
                    for (let i = updatedContent.length - 1; i >= 0; i--) {
                      if (updatedContent[i].type === "text-delta") {
                        lastTextDeltaIndex = i;
                        break;
                      }
                    }
                    
                    if (lastTextDeltaIndex !== -1) {
                      // Merge deltas: accumulate the new delta into the existing one
                      const lastTextDelta = updatedContent[lastTextDeltaIndex];
                      const accumulatedDelta = 
                        (lastTextDelta.data?.delta || "") + event.data.delta;
                      
                      updatedContent[lastTextDeltaIndex] = {
                        ...lastTextDelta,
                        data: {
                          ...lastTextDelta.data,
                          delta: accumulatedDelta,
                        },
                      };
                    } else {
                      // No existing text-delta event, add this one
                      updatedContent.push(event);
                    }
                  } else {
                    // Not a text-delta or doesn't have delta, add normally
                    updatedContent.push(event);
                  }
                  
                  currentMessages[messageIndex] = {
                    ...existingMessage,
                    content: updatedContent,
                  };
                  this.setState({ messages: currentMessages });
                }
              }

              yield event;
            } catch (e) {
              console.error("Failed to parse event:", e);
            }
          }
        }
      }

      this.setState({ isLoading: false });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // Abort is expected, don't set error
        this.setState({ isLoading: false });
        return;
      }
      const error = err instanceof Error ? err : new Error(String(err));
      this.setState({ error, isLoading: false });
      throw error;
    }
  }

  /**
   * Clear all events and reset state
   */
  clear(): void {
    if (this.abortController) {
      this.abortController.abort();
    }

    this.setState({
      events: [],
      messages: [],
      error: null,
      isLoading: false,
      threadId: generateId(), // Generate new threadId
    });
  }
}
