export type Transport = 'sse' | 'ws' | 'http';

export interface AgentClientOptions {
  baseUrl: string;
  transport?: Transport;
  apiKey?: string;
}

export class AgentClient {
  private readonly baseUrl: string;
  private readonly transport: Transport;
  private readonly apiKey?: string;

  constructor(options: AgentClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.transport = options.transport ?? 'sse';
    this.apiKey = options.apiKey;
  }

  // Placeholder: connect to an agent stream
  connect(conversationId: string): void {
    void conversationId; // placeholder
  }

  // Placeholder: send a user message
  async sendMessage(conversationId: string, content: string): Promise<void> {
    void conversationId;
    void content;
  }
}
