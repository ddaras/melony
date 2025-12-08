/**
 * Message parsing utilities for handling incoming requests
 * Abstracts the complexity of parsing different message formats
 */

export interface IncomingMessageContent {
  type: string;
  data?: Record<string, unknown>;
}

export interface IncomingMessage {
  role: string;
  content: IncomingMessageContent[];
}

export interface ParsedUserMessage {
  type: "user";
  userText: string;
}

export interface ParsedApprovalMessage {
  type: "approval";
  approvalData: {
    pendingActionId: string;
    signature: string;
    editedParams: Record<string, unknown>;
  };
}

export interface ParsedInvalidMessage {
  type: "invalid";
  reason?: string;
}

export type ParsedMessage =
  | ParsedUserMessage
  | ParsedApprovalMessage
  | ParsedInvalidMessage;

/**
 * Parse an incoming message into a typed structure.
 * Handles user messages, approval resumptions, and validation.
 *
 * @example
 * ```ts
 * const { message } = await req.json();
 * const parsed = parseIncomingMessage(message);
 *
 * if (parsed.type === "user") {
 *   console.log(parsed.userText);
 * } else if (parsed.type === "approval") {
 *   console.log(parsed.approvalData.pendingActionId);
 * }
 * ```
 */
export function parseIncomingMessage(
  message: IncomingMessage | null | undefined
): ParsedMessage {
  if (!message) {
    return { type: "invalid", reason: "No message provided" };
  }

  // User message with text content
  if (message.role === "user" && Array.isArray(message.content)) {
    const userText = message.content
      .filter((c) => c.type === "text")
      .map((c) => (c.data?.content as string) ?? "")
      .join("");

    if (userText.trim()) {
      return { type: "user", userText };
    }
  }

  // System message with approval data (secure format)
  if (message.role === "system" && Array.isArray(message.content)) {
    const approvalContent = message.content.find(
      (c) => c.type === "resumeWithApproval"
    );

    if (approvalContent?.data) {
      const data = approvalContent.data as Record<string, unknown>;
      const pendingActionId = data.pendingActionId as string | undefined;
      const signature = data.signature as string | undefined;

      if (pendingActionId && signature) {
        // Extract edited params (everything except metadata fields)
        const editedParams: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(data)) {
          if (
            key !== "pendingActionId" &&
            key !== "signature" &&
            key !== "actionName"
          ) {
            editedParams[key] = value;
          }
        }

        return {
          type: "approval",
          approvalData: { pendingActionId, signature, editedParams },
        };
      }
    }
  }

  return { type: "invalid", reason: "Unrecognized message format" };
}

