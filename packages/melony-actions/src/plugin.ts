import { AgentPlugin } from "@melony/agents";
import { Event } from "melony";
import { ActionRegistry, createActionRegistry } from "./registry";
import {
  ActionCallEventData,
  ActionDefinition,
  ActionErrorEventData,
  ActionEvents,
  ActionResultEventData,
  ActionStateShape,
  ActionsPluginOptions,
} from "./types";

function setByPath(target: Record<string, any>, path: string, value: unknown): void {
  const segments = path.split(".").filter(Boolean);
  if (segments.length === 0) return;

  let cursor: Record<string, any> = target;
  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i]!;
    if (typeof cursor[key] !== "object" || cursor[key] === null) {
      cursor[key] = {};
    }
    cursor = cursor[key];
  }

  const last = segments[segments.length - 1]!;
  cursor[last] = value;
}

function toErrorData(action: string, toolCallId: string | undefined, error: unknown): ActionErrorEventData {
  return {
    action,
    toolCallId,
    error:
      error instanceof Error
        ? { message: error.message, stack: error.stack }
        : error,
  };
}

export function actions<TState extends ActionStateShape = ActionStateShape, TEvent extends Event = Event>(
  options: ActionsPluginOptions<TState, TEvent>
): AgentPlugin<TState, TEvent> {
  const registry = createActionRegistry<TState, TEvent>(options.actions);
  const callEventType = options.callEventType ?? ActionEvents.Call;
  const resultEventType = options.resultEventType ?? ActionEvents.Result;
  const errorEventType = options.errorEventType ?? ActionEvents.Error;
  const includeInState = options.includeInState ?? options.includeInCapabilities ?? true;
  const actionsPath = options.actionsPath ?? options.capabilitiesPath ?? "actions";

  return (builder) => {
    if (includeInState) {
      builder.intercept((event, context) => {
        setByPath(context.state as Record<string, any>, actionsPath, registry.toTools());
        return event;
      });
    }

    builder.on(callEventType, async function* (event, context) {
      const call = event.data as ActionCallEventData;
      const action = registry.get(call.name);

      if (!action) {
        const errorData = toErrorData(call.name, call.id, new Error(`Unknown action "${call.name}"`));
        yield { type: errorEventType, data: errorData } as TEvent;
        return;
      }

      try {
        const result = await action.run({
          input: call.args,
          context,
          toolCallId: call.id,
        });

        const resultData: ActionResultEventData = {
          action: action.name,
          toolCallId: call.id,
          result,
        };

        yield { type: resultEventType, data: resultData } as TEvent;
      } catch (error) {
        const errorData = toErrorData(action.name, call.id, error);
        yield { type: errorEventType, data: errorData } as TEvent;
      }
    });
  };
}

export function defineAction<
  TState = any,
  TEvent extends Event = Event,
  TInput = any,
  TResult = any
>(
  definition: ActionDefinition<TState, TEvent, TInput, TResult>
): ActionDefinition<TState, TEvent, TInput, TResult> {
  return definition;
}

export function createActionsPlugin<
  TState extends ActionStateShape = ActionStateShape,
  TEvent extends Event = Event
>(
  options: ActionsPluginOptions<TState, TEvent>
): AgentPlugin<TState, TEvent> {
  return actions(options);
}

export { ActionRegistry };
