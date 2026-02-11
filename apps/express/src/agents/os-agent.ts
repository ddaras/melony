import { MelonyPlugin } from "melony";
import { agentPlugin } from "../plugins/agent/index.js";
import { shellPlugin, shellToolDefinitions } from "../plugins/shell/index.js";
import { shellUIPlugin } from "../plugins/shell/ui.js";
import { fileSystemPlugin, fileSystemToolDefinitions } from "../plugins/file-system/index.js";
import { fileSystemUIPlugin } from "../plugins/file-system/ui.js";
import { LanguageModel } from "ai";
import { ChatState, ChatEvent } from "../types.js";

export interface OSAgentOptions {
  model: LanguageModel;
  cwd?: string;
  systemPrompt?: string;
}

const DEFAULT_SYSTEM_PROMPT = `You are an OS Agent with access to the shell and file system.
Your job is to help the user with file operations and command execution.
You can read, write, list, and delete files, as well as execute shell commands.
Always be careful with destructive operations.
When you are done with the task, summarize what you did.`;

export const osAgentPlugin = (options: OSAgentOptions): MelonyPlugin<ChatState, ChatEvent> => (builder) => {
  const { model, cwd = process.cwd(), systemPrompt = DEFAULT_SYSTEM_PROMPT } = options;

  builder
    .use(shellPlugin({ cwd }))
    .use(shellUIPlugin())
    .use(fileSystemPlugin({ baseDir: "/" }))
    .use(fileSystemUIPlugin())
    .use(agentPlugin({
      model,
      system: systemPrompt,
      toolDefinitions: {
        ...shellToolDefinitions,
        ...fileSystemToolDefinitions,
      },
      promptInputType: "agent:os:input",
      actionResultInputType: "agent:os:result",
      completionEventType: "agent:os:output",
    }));

  // Bridge the OS agent's completion back to the manager
  builder.on("agent:os:output", async function* (event: any, { state }) {
    const s = state as any;
    if (s.pendingOSTask) {
      const toolCallId = s.pendingOSTask.toolCallId;
      delete s.pendingOSTask;
      
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
