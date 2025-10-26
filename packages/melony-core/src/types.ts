export type Action = { type: string; payload?: any };
export type ActionHandler = (action: Action) => void;
