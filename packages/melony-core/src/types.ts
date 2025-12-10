import z from "zod";
import { UINode } from "./ui-protocol";

// events
export type MelonyEvent = {
  type: string;
  data?: any;
  ui?: UINode; // Server-Driven UI payload
  id?: string;
  runId?: string;
  version?: string;
  timestamp?: number;
};

/**
 * Chat message format used for transport
 *
 * Key concepts:
 * - Events are the fundamental unit (MelonyEvent)
 * - Messages group events by runId (from backend, always assistant role)
 * - Client can send messages (user/system role) with events inside
 */
export interface MelonyMessage {
  role: "user" | "assistant" | "system";
  /**
   * Content is always an array of events for consistency
   * - For assistant messages (from backend): array of events grouped by runId
   * - For user/system messages (from client): array of events
   */
  content: MelonyEvent[]; // Always events array
  runId?: string; // Only present for assistant messages (grouped events from backend)
}

// ============================================
// Human-in-the-Loop (HITL) Types
// ============================================

/**
 * Configuration for action approval flow
 */
export interface ApprovalConfig<TParams = any> {
  /** Custom UI for the approval form. If not provided, uses default. */
  ui?: (params: TParams, pendingActionId: string, signature: string) => UINode;
  /** Expiration time in ms (default: 5 minutes) */
  expiresIn?: number;
}

/**
 * A pending action awaiting user approval
 */
export interface PendingAction {
  id: string;
  actionName: string;
  params: Record<string, any>;
  signature: string;
  createdAt: number;
  expiresAt: number;
  runId: string;
  state?: Record<string, any>;
}

/**
 * Store for managing pending actions that require approval.
 * Implement this interface for custom storage (Redis, DB, etc.)
 */
export interface PendingActionsStore {
  /** Create a new pending action and return it with id and signature */
  create(
    action: Omit<PendingAction, "id" | "signature">
  ): Promise<PendingAction>;
  /** Get a pending action by id (returns null if expired or not found) */
  get(id: string): Promise<PendingAction | null>;
  /** Verify a pending action's signature and return it if valid */
  verify(id: string, signature: string): Promise<PendingAction | null>;
  /** Delete a pending action (called after approval/rejection) */
  delete(id: string): Promise<void>;
}

// ============================================
// Runtime Types
// ============================================

// runtime
export interface RuntimeConfig {
  actions: Record<string, Action>;
  safetyMaxSteps?: number;
  /** Optional store for HITL pending actions. Required if any action uses requiresApproval. */
  pendingActionsStore?: PendingActionsStore;
}

export interface RuntimeInput {
  start: NextAction;
  runId?: string;
  state?: Record<string, any>;
}

export interface Runtime {
  run(input: RuntimeInput): AsyncGenerator<MelonyEvent>;
}

export interface RuntimeContext<TState = any> {
  state: TState;
  initialAction: NextAction;
  runId: string;
  stepCount: number;
  isDone: boolean;
  actions: Record<string, Action>;
}

// actions
// none of the fields are required, because it might be used with Agent which only looks for description
export interface NextAction {
  action?: string;
  params?: any;
  description?: string;
}

export interface Action<TParams extends z.ZodSchema = z.ZodObject<any>> {
  name: string;
  description?: string;
  paramsSchema: TParams;
  /**
   * Whether this action requires user approval before execution.
   * Can be a boolean or a function that receives params and returns boolean.
   */
  requiresApproval?: boolean | ((params: z.infer<TParams>) => boolean);
  /**
   * Configuration for the approval flow (custom UI, expiration, editable params)
   */
  approvalConfig?: ApprovalConfig<z.infer<TParams>>;
  execute: (
    params: z.infer<TParams>,
    context: RuntimeContext
  ) => AsyncGenerator<MelonyEvent, NextAction | void, unknown>;
}
