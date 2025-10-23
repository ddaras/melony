// Action types
export interface ActionDefinition {
  action: string;
  payload?: Record<string, any>;
}

export type ActionHandler = (
  action: string,
  payload?: Record<string, any>
) => void | Promise<void>;
