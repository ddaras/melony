import { agent, AgentEvents } from '@melony/agents';
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
  )
  .on(AgentEvents.UserIntent, async function* (event: any, { state }) {
    const text = event.data?.text;
    if (!text || text.trim() === '') {
      yield {
        type: AgentEvents.Error,
        data: {
          message: 'No text provided in user intent',
        },
      };
      return;
    }

    state.messages ??= [];
    state.messages.push({
      role: 'user',
      content: text,
    });

    // Signal that we are starting to process the run
    yield {
      type: AgentEvents.Run,
      data: { text },
    };
  });
