import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { PendingAction, PendingActionsStore } from "./types";

/**
 * Stateless implementation of PendingActionsStore.
 * Encodes all pending action data into a signed token.
 * Suitable for serverless and distributed environments without a database.
 */
export class StatelessPendingActionsStore implements PendingActionsStore {
  private secret: string;

  constructor(secret?: string) {
    this.secret = secret || randomBytes(32).toString("hex");
  }

  // Encodes data into a url-safe signed token: "base64(json).hmac"
  private encode(data: any): string {
    const json = JSON.stringify(data);
    const base64 = Buffer.from(json).toString("base64url");
    const signature = createHmac("sha256", this.secret)
      .update(base64)
      .digest("base64url");
    return `${base64}.${signature}`;
  }

  // Decodes and verifies the token
  private decode(token: string): any | null {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    
    const [base64, signature] = parts;
    if (!base64 || !signature) return null;

    const expectedSignature = createHmac("sha256", this.secret)
      .update(base64)
      .digest("base64url");

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSignature);

    // Timing safe comparison to prevent forgery
    if (
      sigBuf.length !== expectedBuf.length ||
      !timingSafeEqual(sigBuf, expectedBuf)
    ) {
      return null;
    }

    try {
      return JSON.parse(Buffer.from(base64, "base64url").toString());
    } catch {
      return null;
    }
  }

  async create(
    action: Omit<PendingAction, "id" | "signature">
  ): Promise<PendingAction> {
    // Prepare payload. We omit 'state' to keep the token size small, 
    // as the runtime re-executes the action and doesn't rely on stored state.
    // If state is crucial for resumption, it would need to be included or stored externally.
    const payload = {
      actionName: action.actionName,
      params: action.params,
      createdAt: action.createdAt,
      expiresAt: action.expiresAt,
      runId: action.runId,
      // We don't include state by default to avoid huge tokens
    };

    // The ID itself is the signed token containing all data
    const token = this.encode(payload);

    return {
      id: token,
      signature: token, // Can mirror the token
      ...action,
      state: undefined, // State is not persisted in the token
    };
  }

  async get(id: string): Promise<PendingAction | null> {
    const data = this.decode(id);
    if (!data) return null;

    if (data.expiresAt < Date.now()) return null;

    return {
      id,
      signature: id,
      ...data,
      state: undefined, 
    };
  }

  async verify(id: string, signature: string): Promise<PendingAction | null> {
    // In this pattern, 'id' IS the token. We can just verify 'id'.
    // Signature provided by client might be the same as ID.
    return this.get(id);
  }

  async delete(id: string): Promise<void> {
    // Stateless tokens cannot be deleted server-side; they simply expire.
    // This is a trade-off for simplicity (no revocation list).
  }
}
