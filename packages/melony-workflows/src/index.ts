import { AgentPlugin, AgentEvents, AgentBuilder } from "@melony/agents";
import { Event } from "melony";

export function sequential(steps: AgentBuilder<any, any>[]): AgentPlugin {
  return (builder) => {
    builder.on(AgentEvents.Run, async function* (event: any, context) {
      yield { type: "workflow:start", data: { type: "sequential" } } as any;

      for (const agent of steps) {
        yield { type: "workflow:step:start", data: { agent: agent.constructor.name } } as any;
        
        // In a real implementation, we would pass state between agents
        for await (const stepEvent of agent.run(event.data, { state: context.state })) {
          if (stepEvent.type === AgentEvents.Complete) continue;
          yield { 
            type: "workflow:step:event", 
            data: { agent: agent.constructor.name, event: stepEvent } 
          } as any;
        }

        yield { type: "workflow:step:complete", data: { agent: agent.constructor.name } } as any;
      }

      yield { type: "workflow:complete", data: { type: "sequential" } } as any;
    });
  };
}

export function parallel(branches: AgentBuilder<any, any>[]): AgentPlugin {
  return (builder) => {
    builder.on(AgentEvents.Run, async function* (event, context) {
      yield { type: "workflow:start", data: { type: "parallel" } } as any;
      
      // Parallel logic would go here
      // For each branch, start the agent.run and multiplex the streams
      
      yield { type: "workflow:complete", data: { type: "parallel" } } as any;
    });
  };
}

export interface LoopOptions {
  run: AgentBuilder<any, any>;
  while: (args: { iteration: number; state: any; lastResult?: any }) => boolean;
  maxIterations?: number;
}

export function loop(options: LoopOptions): AgentPlugin {
  return (builder) => {
    builder.on(AgentEvents.Run, async function* (event: any, context) {
      yield { type: "workflow:start", data: { type: "loop" } } as any;
      
      let iteration = 0;
      const max = options.maxIterations || 5;

      while (iteration < max) {
        iteration++;
        yield { type: "workflow:loop:iteration:start", data: { iteration } } as any;
        
        for await (const loopEvent of options.run.run(event.data, { state: context.state })) {
          if (loopEvent.type === AgentEvents.Complete) continue;
          yield loopEvent;
        }
        
        yield { type: "workflow:loop:iteration:complete", data: { iteration } } as any;
        
        if (!options.while({ iteration, state: context.state })) {
          break;
        }
      }

      yield { type: "workflow:complete", data: { type: "loop" } } as any;
    });
  };
}
