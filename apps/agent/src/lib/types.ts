import { Event } from "@melony/core";

export interface EventStorage {
  store(event: Event, metadata?: Record<string, any>): Promise<void>;
}

export interface PendingAction {
  token: string;
  actionName: string;
  params: any;
  createdAt: number;
  expiresAt: number;
  runId: string;
  state?: any;
}

export interface PendingActionStorage {
  create(
    action: Omit<PendingAction, "id" | "token">
  ): Promise<PendingAction>;
  get(token: string): Promise<PendingAction | null>;
  verify(token: string): Promise<PendingAction | null>;
  delete(token: string): Promise<void>;
}
