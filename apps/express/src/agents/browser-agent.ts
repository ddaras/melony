import { MelonyPlugin } from "melony";
import { agentPlugin } from "../plugins/agent/index.js";
import { browserPlugin, browserToolDefinitions, BrowserPluginOptions } from "../plugins/browser/index.js";
import { browserUIPlugin } from "../plugins/browser/ui.js";
import { LanguageModel } from "ai";
import { ChatState, ChatEvent } from "../types.js";

export interface BrowserAgentOptions extends BrowserPluginOptions {
  model: LanguageModel;
  systemPrompt?: string;
}

const DEFAULT_SYSTEM_PROMPT = `You are a Browser Agent with access to a web browser.
Your job is to help the user with web-based tasks like searching, navigating, and extracting information.
You can act on pages (click, type, scroll), observe possible actions, and extract data.
When you are done with the task, summarize what you found or did.`;

export const browserAgentPlugin = (options: BrowserAgentOptions): MelonyPlugin<ChatState, ChatEvent> => (builder) => {
  const { model, systemPrompt = DEFAULT_SYSTEM_PROMPT, ...browserOptions } = options;

  builder
    .use(browserPlugin({ ...browserOptions, model }))
    .use(browserUIPlugin())
    .use(agentPlugin({
      model,
      system: systemPrompt,
      toolDefinitions: {
        ...browserToolDefinitions,
      },
      promptInputType: "agent:browser:input",
      actionResultInputType: "agent:browser:result",
      completionEventType: "agent:browser:output",
    }));

  // Bridge the Browser agent's completion back to the manager
  builder.on("agent:browser:output", async function* (event: any, { state }) {
    const s = state as any;
    if (s.pendingBrowserTask) {
      const toolCallId = s.pendingBrowserTask.toolCallId;
      delete s.pendingBrowserTask;
      
      yield {
        type: "action:result",
        data: {
          action: "delegateTask",
          toolCallId,
          result: event.data.content,
        },
      } as any;
    }
  });
};
