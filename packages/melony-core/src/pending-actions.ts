import { createHmac, randomBytes, randomUUID, timingSafeEqual } from "crypto";
import { PendingAction, PendingActionsStore } from "./types";

/**
 * In-memory implementation of PendingActionsStore.
 * Suitable for development and single-server deployments.
 * For production with multiple servers, use Redis or database-backed store.
 */
export class InMemoryPendingActionsStore implements PendingActionsStore {
  private store = new Map<string, PendingAction>();
  private secret: string;

  constructor(secret?: string) {
    // Use provided secret or generate a random one
    // In production, always provide a consistent secret across restarts
    this.secret = secret || randomBytes(32).toString("hex");
  }

  /**
   * Create HMAC signature for a pending action.
   * Note: We intentionally DON'T sign params - this allows users to modify
   * parameters in the approval form (e.g., change unit from fahrenheit to celsius).
   * The signature protects:
   * - Which action can be executed (prevents switching to different actions)
   * - The pending action ID (prevents replay/forgery)
   * - Expiration (time-limited tokens)
   * 
   * For sensitive actions where params must be immutable, consider adding
   * per-action "lockedParams" support in the future.
   */
  private sign(data: Omit<PendingAction, "signature">): string {
    const payload = JSON.stringify({
      id: data.id,
      actionName: data.actionName,
      // params intentionally excluded - allows user to edit in approval form
      createdAt: data.createdAt,
      expiresAt: data.expiresAt,
      runId: data.runId,
    });

    return createHmac("sha256", this.secret).update(payload).digest("hex");
  }

  async create(
    action: Omit<PendingAction, "id" | "signature">
  ): Promise<PendingAction> {
    const id = randomUUID();
    const pendingWithId = { id, ...action };
    const signature = this.sign(pendingWithId);

    const pending: PendingAction = {
      ...pendingWithId,
      signature,
    };

    this.store.set(id, pending);
    return pending;
  }

  async get(id: string): Promise<PendingAction | null> {
    const action = this.store.get(id);

    if (!action) {
      return null;
    }

    // Check expiration
    if (action.expiresAt < Date.now()) {
      this.store.delete(id);
      return null;
    }

    return action;
  }

  async verify(id: string, signature: string): Promise<PendingAction | null> {
    const action = await this.get(id);

    if (!action) {
      return null;
    }

    // Recalculate expected signature (params excluded - allows user edits)
    const expectedSignature = this.sign({
      id: action.id,
      actionName: action.actionName,
      params: action.params, // Not used in sign(), but required by type
      createdAt: action.createdAt,
      expiresAt: action.expiresAt,
      runId: action.runId,
      state: action.state,
    });

    // Use timing-safe comparison to prevent timing attacks
    try {
      const sigBuffer = Buffer.from(signature, "hex");
      const expectedBuffer = Buffer.from(expectedSignature, "hex");

      if (sigBuffer.length !== expectedBuffer.length) {
        return null;
      }

      if (!timingSafeEqual(sigBuffer, expectedBuffer)) {
        return null;
      }
    } catch {
      // Invalid hex string or other error
      return null;
    }

    return action;
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }

  /**
   * Clean up expired pending actions (call periodically in long-running processes)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [id, action] of this.store.entries()) {
      if (action.expiresAt < now) {
        this.store.delete(id);
      }
    }
  }

  /**
   * Get the number of pending actions (useful for monitoring)
   */
  size(): number {
    return this.store.size;
  }
}

