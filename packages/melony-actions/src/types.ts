import { Event, RuntimeContext } from "melony";

export interface ActionTool {
  name: string;
  description: string;
  parameters: any;
}

export interface ActionCallEventData<TInput = any> {
  id?: string;
  name: string;
  args: TInput;
}

export interface ActionResultEventData<TResult = any> {
  action: string;
  toolCallId?: string;
  result: TResult;
}

export interface ActionErrorEventData {
  action: string;
  toolCallId?: string;
  error: any;
}

export interface ActionContext<TState = any, TEvent extends Event = Event, TInput = any> {
  input: TInput;
  context: RuntimeContext<TState, TEvent>;
  toolCallId?: string;
}

export interface ActionDefinition<
  TState = any,
  TEvent extends Event = Event,
  TInput = any,
  TResult = any
> {
  name: string;
  description: string;
  parameters: any;
  run(args: ActionContext<TState, TEvent, TInput>): Promise<TResult> | TResult;
}

export interface ActionStateShape {
  actions?: ActionTool[];
  /**
   * @deprecated Prefer `state.actions`.
   */
  capabilities?: {
    actions?: ActionTool[];
    [key: string]: any;
  };
  [key: string]: any;
}

export interface ActionsPluginOptions<TState = any, TEvent extends Event = Event> {
  actions: ActionDefinition<TState, TEvent, any, any>[];
  callEventType?: string;
  resultEventType?: string;
  errorEventType?: string;
  includeInState?: boolean;
  actionsPath?: string;
  /**
   * @deprecated Prefer `includeInState`.
   */
  includeInCapabilities?: boolean;
  /**
   * @deprecated Prefer `actionsPath`.
   */
  capabilitiesPath?: string;
}

export const ActionEvents = {
  Call: "action:call",
  Result: "action:result",
  Error: "action:error",
} as const;
