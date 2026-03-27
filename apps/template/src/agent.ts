import { agent, AgentEvents } from '@melony/agents';
import { llm } from '@melony/llm';
import { createOpenAIProvider } from '@melony/openai';
import { AgentState, AgentEvent, AgentEventTypes, isEventsListEvent } from './types.js';
import { appStorage, inMemoryStoragePlugin } from './storage.js';

// Define a simple agent that responds to messages
export const sampleAgent = agent<AgentState, AgentEvent>({
  name: 'Sample Agent',
  instructions: 'You are a helpful Melony agent. Respond to the user with enthusiasm!',
})
  .use(inMemoryStoragePlugin<AgentState, AgentEvent>(appStorage))
  .use((builder) => {
    builder.on(AgentEventTypes.RunsList, async function* () {
      const runs = appStorage.listRuns();

      yield {
        type: AgentEventTypes.RunsListed,
        data: { runs },
        meta: { internal: true },
      };
    });

    builder.on(AgentEventTypes.EventsList, async function* (event) {
      if (!isEventsListEvent(event)) {
        return;
      }
      const events = appStorage.listEvents(event.data.runId);

      yield {
        type: AgentEventTypes.EventsListed,
        data: { events },
        meta: { internal: true },
      };
    });

    // Handle the user's intent by adding it to the state and triggering the agent run
    builder.on(AgentEvents.UserIntent, async function* (event: any, { state }) {
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
  })
  .use(
    llm({
      provider: createOpenAIProvider({
        model: 'gpt-4o-mini',
      }),
    }),
  );
