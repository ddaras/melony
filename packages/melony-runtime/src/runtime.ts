import {
  Action,
  MelonyEvent,
  NextAction,
  RuntimeContext,
  generateId,
  RuntimeConfig,
  RuntimeInput,
  Runtime,
  UINode,
  PendingAction,
} from "@melony/core";

/**
 * Simple action runner - executes actions and yields events
 * Actions are always async generators and can chain to other actions
 * Supports built-in Human-in-the-Loop (HITL) approval flow
 */
export class MelonyRuntime implements Runtime {
  private config: RuntimeConfig;

  constructor(config: RuntimeConfig) {
    this.config = config;
  }

  public async *run({
    start: initialAction,
    runId: initialRunId,
    state: initialState,
  }: RuntimeInput): AsyncGenerator<MelonyEvent> {
    const runId = initialRunId ?? generateId();

    const actions = this.config.actions;

    const context: RuntimeContext = {
      state: initialState ?? {},
      initialAction: initialAction ?? { action: Object.keys(actions)[0] },
      runId,
      stepCount: 0,
      isDone: false,
      actions,
    };

    const action =
      actions[context.initialAction?.action ?? Object.keys(actions)[0]];

    if (!action) {
      yield {
        type: "error",
        version: "1.0.0",
        runId: runId,
        timestamp: Date.now(),
        data: {
          message: `Action "${initialAction}" not found`,
        },
      };

      return;
    }

    yield* this.executeAction(action, context.initialAction?.params, context);
  }

  /**
   * Check if an action requires approval
   */
  private actionRequiresApproval(action: Action, args: any): boolean {
    if (typeof action.requiresApproval === "function") {
      return action.requiresApproval(args);
    }
    return action.requiresApproval === true;
  }

  /**
   * Generate default approval UI for an action
   */
  private generateDefaultApprovalUI(
    action: Action,
    params: any,
    pending: PendingAction
  ): UINode {
    const formChildren: UINode[] = [];

    // Add all params as editable inputs
    const paramEntries = Object.entries(params || {});
    for (const [key, value] of paramEntries) {
      formChildren.push({
        type: "input",
        props: {
          name: key,
          label: key,
          defaultValue: value !== undefined ? String(value) : "",
        },
      });
    }

    // Add approve button
    formChildren.push({
      type: "row",
      props: { gap: "sm", justify: "end" },
      children: [
        {
          type: "button",
          props: {
            label: "Approve",
            variant: "primary",
          },
        },
      ],
    });

    return {
      type: "card",
      props: { title: `Approve: ${action.name}` },
      children: [
        {
          type: "text",
          props: {
            value:
              action.description ||
              `Action "${action.name}" requires your approval before execution.`,
          },
        },
        { type: "spacer", props: { size: "sm" } },
        {
          type: "form",
          props: {
            onSubmitAction: {
              type: "sendMessage",
              data: {
                role: "system",
                content: [
                  {
                    type: "resumeWithApproval",
                    data: {
                      pendingActionId: pending.id,
                      signature: pending.signature,
                      actionName: action.name,
                    },
                  },
                ],
              },
            },
          },
          children: formChildren,
        },
      ],
    };
  }

  private async *executeAction(
    action: Action,
    args: any,
    context: RuntimeContext
  ): AsyncGenerator<MelonyEvent> {
    if (
      context.stepCount >= (this.config.safetyMaxSteps ?? 10) ||
      context.isDone
    ) {
      return;
    }

    context.stepCount++;

    // ============================================
    // Human-in-the-Loop (HITL) Approval Check
    // ============================================
    const needsApproval = this.actionRequiresApproval(action, args);

    if (needsApproval && this.config.pendingActionsStore) {
      // Check if this is an approved resumption
      const approvalToken = context.state?.__approvalToken as
        | { id: string; signature: string; editedParams?: Record<string, any> }
        | undefined;

      if (!approvalToken) {
        // First time - create pending action and suspend for approval
        const expiresIn = action.approvalConfig?.expiresIn ?? 5 * 60 * 1000; // Default 5 minutes

        const pending = await this.config.pendingActionsStore.create({
          actionName: action.name,
          params: args,
          createdAt: Date.now(),
          expiresAt: Date.now() + expiresIn,
          runId: context.runId,
          state: context.state,
        });

        // Generate approval UI (custom or default)
        const approvalUI =
          action.approvalConfig?.ui?.(args, pending.id, pending.signature) ??
          this.generateDefaultApprovalUI(action, args, pending);

        yield {
          type: "approval-required",
          version: "1.0.0",
          runId: context.runId,
          timestamp: Date.now(),
          ui: approvalUI,
          data: {
            pendingActionId: pending.id,
            signature: pending.signature,
            actionName: action.name,
            expiresAt: pending.expiresAt,
          },
        };

        // Stop execution - waiting for approval
        context.isDone = true;
        return;
      }

      // Verify the approval token
      const verified = await this.config.pendingActionsStore.verify(
        approvalToken.id,
        approvalToken.signature
      );

      if (!verified) {
        yield {
          type: "error",
          version: "1.0.0",
          runId: context.runId,
          timestamp: Date.now(),
          data: {
            message: "Invalid or expired approval token",
            code: "INVALID_APPROVAL",
          },
        };
        return;
      }

      // Emit event to notify client that approval was consumed
      // Client should hide/disable the approval UI
      yield {
        type: "approval-consumed",
        version: "1.0.0",
        runId: context.runId,
        timestamp: Date.now(),
        data: {
          pendingActionId: approvalToken.id,
          actionName: action.name,
        },
      };

      // Merge stored params with user-edited params
      // User can freely modify any params via the approval form
      args = {
        ...verified.params,
        ...(approvalToken.editedParams || {}),
      };

      // Clean up the pending action
      await this.config.pendingActionsStore.delete(approvalToken.id);

      // Clean up approval token from state
      delete context.state.__approvalToken;
    } else if (needsApproval && !this.config.pendingActionsStore) {
      // Action requires approval but no store configured
      yield {
        type: "error",
        version: "1.0.0",
        runId: context.runId,
        timestamp: Date.now(),
        data: {
          message: `Action "${action.name}" requires approval but no pendingActionsStore is configured`,
          code: "MISSING_PENDING_ACTIONS_STORE",
        },
      };
      return;
    }

    // ============================================
    // Execute the Action
    // ============================================
    try {
      const generator = action.execute(args, context);
      let nextAction: NextAction | void;

      // execute the action until it returns a next action or the action is done or the context is done
      while (true) {
        const { value, done } = await generator.next();

        if (done) {
          nextAction = value;
          break;
        }

        // Yield event with runId and timestamp
        yield { ...value, runId: context.runId, timestamp: Date.now() };

        // Check if context was marked as done
        if (context.isDone) {
          return; // stop the execution loop
        }
      }

      // If action returned a next action, execute it
      if (
        nextAction &&
        typeof nextAction === "object" &&
        "action" in nextAction
      ) {
        const next =
          context.actions[
            nextAction?.action ?? Object.keys(context.actions)[0]
          ];

        if (next) {
          yield* this.executeAction(next, nextAction?.params, context);
        } else {
          yield {
            type: "error",
            version: "1.0.0",
            runId: context.runId,
            timestamp: Date.now(),
            data: {
              message: `Action "${nextAction.action}" not found`,
              requestedBy: action.name,
            },
          };
        }
      }
    } catch (error) {
      yield {
        type: "error",
        version: "1.0.0",
        runId: context.runId,
        timestamp: Date.now(),
        data: {
          action: action?.name ?? "unknown",
          error: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }
}
