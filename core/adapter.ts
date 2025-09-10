import { Message } from "./types";

export type SubscribeCallback = (message: Message) => void;
export type Subscription = { unsubscribe: () => void };

export interface AIAdapter {
  send(messages: Message[]): Promise<void>;
  subscribe(callback: SubscribeCallback): Subscription;
  dispose?(): void;
}

export interface AIAdapterOptions {
  endpoint: string;
  headers?: Record<string, string>;
  body?: Record<string, any>;
  debug?: boolean;
}
