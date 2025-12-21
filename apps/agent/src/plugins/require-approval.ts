import { ui, plugin } from "@melony/core";
import { StatelessPendingActionStorage } from "../lib/pending-action-storage";

const actionStorage = new StatelessPendingActionStorage(
  process.env.ACTION_STORAGE_SECRET
);

/**
 * Handles Human-In-The-Loop (HITL) by requiring approval for actions.
 */
export const requireApprovalPlugin = (options?: {
  /** Actions that require approval. If not provided, all actions require approval. */
  actions?: string[];
}) =>
  plugin({
    name: "require-approval",
    onBeforeRun: async ({ event }) => {
      if (event.type === "action-approved") {
        const pendingAction = await actionStorage.verify(
          event.data?.pendingActionToken
        );

        if (!pendingAction) {
          return {
            type: "error",
            data: {
              message: "Invalid pending action",
            },
          };
        }

        return {
          action: event.data?.actionName,
          params: event.data?.params ?? {},
        };
      }
    },
    onBeforeAction: async ({ action, params }, context) => {
      console.log("onBeforeAction", action?.name, params);

      // Check if this action requires approval
      const needsApproval = options?.actions
        ? options.actions.includes(action.name)
        : true;

      // Skip if already confirmed in params
      if (needsApproval && !params.confirmed) {
        const pending = await actionStorage.create({
          actionName: action.name,
          params,
          runId: context.runId,
          createdAt: Date.now(),
          expiresAt: Date.now() + 3600000, // 1 hour
        });

        context.suspend();

        return {
          type: "hitl-required",
          data: {
            message: `Approval needed for ${action.name}`,
            pendingActionToken: pending.token,
          },
          ui: ui.card({
            title: "Approval Needed",
            children: [
              ui.text(`Do you want to proceed with action: ${action.name}?`),
              ui.row({
                children: [
                  ui.button({
                    label: "Approve",
                    onClickAction: {
                      type: "action-approved",
                      role: "system",
                      data: {
                        pendingActionToken: pending.token,
                        actionName: action.name,
                        params: { ...params, confirmed: true },
                      },
                    },
                  }),
                  ui.button({
                    label: "Cancel",
                    onClickAction: {
                      type: "action-rejected",
                      role: "system",
                      data: {
                        actionName: action.name,
                      },
                    },
                    variant: "danger",
                  }),
                ],
              }),
            ],
          }),
        };
      }

      if (needsApproval && params.confirmed) {
        return {
          type: "action-approved",
          data: {
            actionName: action.name,
            params: params,
          },
        };
      }
    },
  });
