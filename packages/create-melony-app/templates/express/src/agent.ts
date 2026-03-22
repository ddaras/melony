import { agent } from '@melony/agents';
import { llm } from '@melony/llm';
import { createOpenAIProvider } from '@melony/openai';

// Define a simple agent that responds to messages
export const sampleAgent = agent({
  name: 'Sample Agent',
  instructions: 'You are a helpful Melony agent. Respond to the user with enthusiasm!',
})
.use(llm({
  provider: createOpenAIProvider({
    model: 'gpt-4o-mini',
  }),
}));
