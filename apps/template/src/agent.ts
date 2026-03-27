import { agent } from '@melony/agents';
import { llm } from '@melony/llm';
import { createOpenAIProvider } from '@melony/openai';
import { AgentState, AgentEvent } from './types.js';
import { appStorage, inMemoryStoragePlugin } from './storage.js';

// Define a simple agent that responds to messages
export const sampleAgent = agent<AgentState, AgentEvent>({
  name: 'Sample Agent',
  instructions: 'You are a helpful Melony agent. Respond to the user with enthusiasm!',
})
  .use(inMemoryStoragePlugin<AgentState, AgentEvent>(appStorage))
  .use(
    llm({
      provider: createOpenAIProvider({
        model: 'gpt-4o-mini',
      }),
    }),
  );
