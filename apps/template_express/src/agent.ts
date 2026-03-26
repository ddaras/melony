import { agent, AgentState as BaseAgentState } from '@melony/agents';
import { llm } from '@melony/llm';
import { createOpenAIProvider } from '@melony/openai';
import { RunEvent } from './events.js';
import { appStorage, inMemoryStoragePlugin } from './storage.js';

type AgentState = BaseAgentState & {
  messages: { role: 'user' | 'assistant'; content: string }[];
};

// Define a simple agent that responds to messages
export const sampleAgent = agent<AgentState, RunEvent>({
  name: 'Sample Agent',
  instructions: 'You are a helpful Melony agent. Respond to the user with enthusiasm!',
})
  .use(inMemoryStoragePlugin<AgentState>(appStorage))
  .use((builder) => {
    // Treat runs:list as an internal telemetry event
    builder.intercept('runs:list', (event) => {
      (event as any).meta ??= {};
      (event as any).meta.internal = true;
      return event;
    });

    builder.on('runs:list', async function* () {
      yield {
        type: 'runs:listed',
        data: { runs: appStorage.listRuns() },
        meta: { internal: true },
      } as RunEvent;
    });

    // Handle the user's intent by adding it to the state and triggering the agent run
    builder.on('user:intent', async function* (event, { state }) {
      const text = (event as any).data?.text;
      if (typeof text !== 'string' || text.trim() === '') {
        yield { type: 'run:error', message: 'No text provided in user intent' } as RunEvent;
        return;
      }

      state.messages ??= [];
      state.messages.push({ role: 'user', content: text });

      // Signal that we are starting to process the run
      yield { type: 'agent:run', data: { text } } as any;
    });

    // API to Runtime: Handlers yield events directly to the HTTP stream.
    builder.on('agent:run', async function* (event, { state }) {
      yield { type: 'agent:status', status: 'thinking' } as RunEvent;
    });
  })
  .use(llm({
    provider: createOpenAIProvider({
      model: 'gpt-4o-mini',
    }),
  }));
