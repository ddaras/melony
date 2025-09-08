export type FlowState = 'idle' | 'running' | 'awaiting-input' | 'completed' | 'error';

export interface FlowEvent<T = unknown> {
  type: string;
  payload?: T;
}

export interface FlowDefinition<Context = unknown> {
  id: string;
  initialState: FlowState;
  onEvent: (state: FlowState, event: FlowEvent, context: Context) => FlowState;
}

export class FlowManager<Context = unknown> {
  private state: FlowState;

  constructor(private readonly def: FlowDefinition<Context>, private readonly context: Context) {
    this.state = def.initialState;
  }

  getState(): FlowState {
    return this.state;
  }

  dispatch(event: FlowEvent): FlowState {
    try {
      this.state = this.def.onEvent(this.state, event, this.context);
      return this.state;
    } catch (err) {
      this.state = 'error';
      return this.state;
    }
  }
}
