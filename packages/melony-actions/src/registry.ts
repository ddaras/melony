import { ActionDefinition, ActionTool } from "./types";

export class ActionRegistry<TState = any, TEvent = any> {
  private readonly actions = new Map<string, ActionDefinition<TState, TEvent, any, any>>();

  register(...items: ActionDefinition<TState, TEvent, any, any>[]): this {
    for (const item of items) {
      if (this.actions.has(item.name)) {
        throw new Error(`Action "${item.name}" is already registered.`);
      }
      this.actions.set(item.name, item);
    }
    return this;
  }

  has(name: string): boolean {
    return this.actions.has(name);
  }

  get(name: string): ActionDefinition<TState, TEvent, any, any> | undefined {
    return this.actions.get(name);
  }

  list(): ActionDefinition<TState, TEvent, any, any>[] {
    return Array.from(this.actions.values());
  }

  toTools(): ActionTool[] {
    return this.list().map((action) => ({
      name: action.name,
      description: action.description,
      parameters: action.parameters,
    }));
  }
}

export function createActionRegistry<TState = any, TEvent = any>(
  actions: ActionDefinition<TState, TEvent, any, any>[] = []
): ActionRegistry<TState, TEvent> {
  const registry = new ActionRegistry<TState, TEvent>();
  if (actions.length > 0) {
    registry.register(...actions);
  }
  return registry;
}
