import {
  parseIncomingMessage,
  IncomingMessage,
  PendingActionsStore,
  StatelessPendingActionsStore,
} from "@melony/core";
import { createStreamResponse } from "@melony/runtime";
import type { Agent } from "./index";

export interface AgentHandlerOptions {
  /**
   * Store for HITL pending actions.
   * If not provided, creates a StatelessPendingActionsStore internally.
   * For production with multiple servers, provide a Redis or database-backed store.
   */
  pendingActionsStore?: PendingActionsStore;
  /**
   * Secret for signing pending actions.
   * Only used when pendingActionsStore is not provided (using internal store).
   * Defaults to HITL_SECRET env var or a dev secret.
   */
  secret?: string;
}

/**
 * Creates an HTTP request handler for an agent.
 * Handles all message parsing, approval flow, and routing automatically.
 *
 * @example
 * ```ts
 * // app/api/chat/route.ts
 * import { defineAgent, createAgentHandler } from "@melony/agents";
 *
 * const myAgent = defineAgent({
 *   name: "Assistant",
 *   actions: { ... },
 *   brain: async function* (context, tools, options) { ... },
 * });
 *
 * export const POST = createAgentHandler(myAgent);
 * ```
 */
export function createAgentHandler(
  agent: Agent,
  options: AgentHandlerOptions = {}
) {
  // Use provided store or create internal one
  const pendingActionsStore =
    options.pendingActionsStore ??
    agent.config.pendingActionsStore ??
    new StatelessPendingActionsStore(
      options.secret ?? process.env.HITL_SECRET ?? "dev-secret-change-in-production"
    );

  return async (req: Request): Promise<Response> => {
    const body = await req.json();
    const message = body.message as IncomingMessage | undefined;
    // threadId can be used for multi-turn conversations (future feature)
    // const threadId = body.threadId as string | undefined;

    const parsed = parseIncomingMessage(message);

    // Handle invalid messages
    if (parsed.type === "invalid") {
      return new Response(
        JSON.stringify({
          error: "Invalid message format",
          reason: parsed.reason,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let startAction: { action: string; params?: Record<string, unknown> };
    let initialState: Record<string, unknown> = {};

    // Handle user text message - start with brain
    if (parsed.type === "user") {
      startAction = {
        action: "brain",
        params: { input: parsed.userText },
      };
    }
    // Handle secure approval resumption
    else if (parsed.type === "approval") {
      const { pendingActionId, signature, editedParams } = parsed.approvalData;

      // Get the pending action to find the action name and original params
      const pending = await pendingActionsStore.get(pendingActionId);

      if (!pending) {
        return new Response(
          JSON.stringify({ error: "Invalid or expired approval" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      startAction = {
        action: pending.actionName,
        params: pending.params,
      };

      // Set the approval token in state for the runtime to verify
      initialState = {
        __approvalToken: {
          id: pendingActionId,
          signature,
          editedParams,
        },
      };
    }
    // This shouldn't happen due to type checking, but just in case
    else {
      return new Response(
        JSON.stringify({ error: "Unsupported message type" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return createStreamResponse(
      agent.run(startAction, {
        state: initialState,
        pendingActionsStore,
      })
    );
  };
}

