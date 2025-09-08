export type ToolHandler<Args = unknown, Result = unknown> = (args: Args) => Promise<Result> | Result;

export interface ToolDefinition<Args = unknown, Result = unknown> {
  name: string;
  description?: string;
  handler: ToolHandler<Args, Result>;
}

export class ToolRegistry {
  private readonly tools = new Map<string, ToolDefinition<any, any>>();

  register<Args, Result>(def: ToolDefinition<Args, Result>): void {
    this.tools.set(def.name, def as ToolDefinition<any, any>);
  }

  get(name: string): ToolDefinition<any, any> | undefined {
    return this.tools.get(name);
  }

  async call(name: string, args: unknown): Promise<unknown> {
    const tool = this.tools.get(name);
    if (!tool) throw new Error(`Tool not found: ${name}`);
    return tool.handler(args as any);
  }
}
