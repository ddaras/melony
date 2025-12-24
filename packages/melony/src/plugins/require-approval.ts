import { plugin } from "../runtime";
import { ui } from "../types";
import type { Action, RuntimeContext } from "../types";

export interface RequireApprovalOptions {
  /**
   * List of action names that require explicit approval.
   * If not provided, all actions will require approval.
   */
  actions?: string[];

  /**
   * Optional secret to sign the approval payload.
   * If provided, the plugin will verify that the parameters haven't been 
   * tampered with between the request and the approval.
   */
  secret?: string;

  /**
   * Custom message to show in the approval card.
   */
  message?: string | ((action: string, params: any) => string);

  /**
   * Optional condition to check if approval is needed dynamically.
   */
  shouldApprove?: (action: Action<any>, params: any, context: RuntimeContext) => boolean | Promise<boolean>;
}

/**
 * A plugin that intercepts actions and requires human approval before execution.
 * It uses SDUI to prompt the user and handles the resumption of the agentic loop.
 */
export const requireApproval = (options: RequireApprovalOptions = {}) => {
  return plugin({
    name: "require-approval",

    /**
     * Step 1: Handle the resumption when the user clicks "Approve".
     */
    onBeforeRun: async ({ event }, context) => {
      if (event.type === "action-approved") {
        const { action, params, token } = event.data;

        // Security: Verify the token if a secret was provided
        if (options.secret) {
          const expectedToken = await signPayload({ action, params }, options.secret);
          if (token !== expectedToken) {
            return {
              type: "error",
              data: { message: "Security Warning: Approval token mismatch. Execution blocked." },
            };
          }
        }

        // Store approval in ephemeral state for the upcoming action execution
        context.state.__approved_action = { action, params };

        // Return the action to jump-start the loop exactly where we left off
        return { action, params };
      }
    },

    /**
     * Step 2: Intercept actions that require approval.
     */
    onBeforeAction: async ({ action, params }, context) => {
      // 1. Check if this action needs approval
      const isTargetAction = !options.actions || options.actions.includes(action.name);
      if (!isTargetAction) return;

      if (options.shouldApprove) {
        const needsApproval = await options.shouldApprove(action, params, context);
        if (!needsApproval) return;
      }

      // 2. Check if it was ALREADY approved in this run
      const approval = context.state.__approved_action;
      if (
        approval &&
        approval.action === action.name &&
        JSON.stringify(approval.params) === JSON.stringify(params)
      ) {
        delete context.state.__approved_action;
        return; // Proceed to execution
      }

      // 3. Suspend and request approval
      context.suspend();

      const token = options.secret 
        ? await signPayload({ action: action.name, params }, options.secret)
        : undefined;

      const message = typeof options.message === "function"
        ? options.message(action.name, params)
        : options.message || `The agent wants to execute **${action.name}**. Do you approve?`;

      return {
        type: "hitl-required",
        data: { action: action.name, params, token },
        ui: ui.card({
          title: "Approval Required",
          children: [
            ui.text(message),
            ui.box({
              padding: "md",
              background: "muted",
              children: [
                ui.text(JSON.stringify(params, null, 2), { size: "xs" }),
              ],
            }),
            ui.row({
              gap: "md",
              children: [
                ui.button({
                  label: "Approve",
                  variant: "success",
                  onClickAction: {
                    type: "action-approved",
                    data: { action: action.name, params, token },
                  },
                }),
                ui.button({
                  label: "Cancel",
                  variant: "outline",
                  onClickAction: {
                    type: "action-rejected",
                    data: { action: action.name },
                  },
                }),
              ],
            }),
          ],
        }),
      };
    },
  });
};

/**
 * Simple HMAC signing using the Web Crypto API (supported in Node 16+ and Browsers).
 */
async function signPayload(data: any, secret: string): Promise<string> {
  const msg = JSON.stringify(data);
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const dataToSign = encoder.encode(msg);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, dataToSign);
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

