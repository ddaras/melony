import { AgentPlugin } from "@melony/agents";

export interface MemoryOptions {
  type: "memory" | "sqlite" | "redis";
  namespace?: string;
}

export function memory(options: MemoryOptions): AgentPlugin {
  return (builder) => {
    builder.intercept((event, context) => {
      // In a real implementation, we would load memory into the state
      // and save it when events occur
      return event;
    });

    builder.on("memory:save", async function* (event, context) {
      // Manual save trigger
      yield { type: "memory:saved", data: { success: true } } as any;
    });
  };
}
