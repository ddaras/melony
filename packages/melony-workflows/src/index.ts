import { AgentPlugin, AgentEvents, AgentBuilder } from "@melony/agents";

type BranchIterator = AsyncIterator<any>;

function getAgentName(agent: AgentBuilder<any, any>, fallbackIndex: number): string {
  const candidate = (agent as any)?.constructor?.name;
  if (typeof candidate === "string" && candidate.length > 0 && candidate !== "AgentBuilder") {
    return candidate;
  }
  return `branch-${fallbackIndex + 1}`;
}

export function sequential(steps: AgentBuilder<any, any>[]): AgentPlugin {
  return (builder) => {
    builder.on(AgentEvents.Run, async function* (event: any, context) {
      yield { type: "workflow:start", data: { type: "sequential" } } as any;

      for (const [index, agent] of steps.entries()) {
        const agentName = getAgentName(agent, index);
        yield { type: "workflow:step:start", data: { agent: agentName } } as any;

        for await (const stepEvent of agent.run(event.data, { state: context.state })) {
          if (stepEvent.type === AgentEvents.Complete) continue;
          yield {
            type: "workflow:step:event",
            data: { agent: agentName, event: stepEvent }
          } as any;
        }

        yield { type: "workflow:step:complete", data: { agent: agentName } } as any;
      }

      yield { type: "workflow:complete", data: { type: "sequential" } } as any;
    });
  };
}

export function parallel(branches: AgentBuilder<any, any>[]): AgentPlugin {
  return (builder) => {
    builder.on(AgentEvents.Run, async function* (event: any, context) {
      yield { type: "workflow:start", data: { type: "parallel" } } as any;

      const branchNames = branches.map((branch, index) => getAgentName(branch, index));
      const iterators: BranchIterator[] = branches.map((branch) =>
        branch.run(event.data, { state: context.state, runId: context.runId })[Symbol.asyncIterator]()
      );
      const pending = new Map<number, Promise<{ index: number; result?: IteratorResult<any>; error?: unknown }>>();

      const schedule = (index: number) => {
        const iterator = iterators[index];
        pending.set(
          index,
          iterator
            .next()
            .then((result) => ({ index, result }))
            .catch((error) => ({ index, error }))
        );
      };

      for (let index = 0; index < iterators.length; index += 1) {
        yield { type: "workflow:branch:start", data: { branch: branchNames[index], index } } as any;
        schedule(index);
      }

      while (pending.size > 0) {
        const outcome = await Promise.race(pending.values());
        pending.delete(outcome.index);

        if (outcome.error) {
          yield {
            type: "workflow:branch:error",
            data: {
              branch: branchNames[outcome.index],
              index: outcome.index,
              error: outcome.error instanceof Error ? outcome.error.message : String(outcome.error)
            }
          } as any;
          continue;
        }

        const result = outcome.result;
        if (!result) {
          continue;
        }

        if (result.done) {
          yield {
            type: "workflow:branch:complete",
            data: { branch: branchNames[outcome.index], index: outcome.index }
          } as any;
          continue;
        }

        const branchEvent = result.value;
        if (branchEvent?.type !== AgentEvents.Complete) {
          yield {
            type: "workflow:branch:event",
            data: { branch: branchNames[outcome.index], index: outcome.index, event: branchEvent }
          } as any;
        }
        schedule(outcome.index);
      }

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
