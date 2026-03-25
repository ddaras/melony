import { agent } from '@melony/agents';
import { llm } from '@melony/llm';
import { createOpenAIProvider } from '@melony/openai';
import { RunEvent } from './events.js';

type AgentState = {
  messages: { role: 'user' | 'assistant'; content: string }[];
};

// Define a simple agent that responds to messages
export const sampleAgent = agent<AgentState, RunEvent>({
  name: 'Sample Agent',
  instructions: 'You are a helpful Melony agent. Respond to the user with enthusiasm!',
})
  .use(llm({
    provider: createOpenAIProvider({
      model: 'gpt-4o-mini',
    }),
  }));
