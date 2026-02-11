import { melony } from "melony";
import { ChatEvent, ChatState } from "./types.js";
import { osAgentPlugin } from "./agents/os-agent.js";
import { browserAgentPlugin } from "./agents/browser-agent.js";
import { metaAgentPlugin, metaAgentToolDefinitions, buildSystemPrompt } from "./plugins/meta-agent/index.js";
import { metaAgentUIPlugin } from "./plugins/meta-agent/ui.js";
import { agentPlugin } from "./plugins/agent/index.js";
import { initHandler } from "./handlers/init.js";
import { loadConfig, resolvePath, DEFAULT_BASE_DIR } from "./config.js";
import { createModel } from "./models.js";
import path from "node:path";
import { z } from "zod";

/**
 * Create the OpenBot manager agent
 */
export async function createOpenBot(options?: {
  openaiApiKey?: string;
  anthropicApiKey?: string;
}) {
  const config = loadConfig();
  const baseDir = config.baseDir || DEFAULT_BASE_DIR;
  const resolvedBaseDir = resolvePath(baseDir);
  const model = createModel(options);

  const userDataDir = path.join(resolvedBaseDir, "browser-data");

  return melony<ChatState, ChatEvent>()
    .use(osAgentPlugin({ model: model as any }))
    .use(browserAgentPlugin({
      headless: true,
      userDataDir: userDataDir,
      channel: 'chrome',
      model: model as any
    }))
    .use(metaAgentPlugin({
      baseDir: resolvedBaseDir,
      allowSoulModification: false,
    }))
    .use(metaAgentUIPlugin())
    .use(agentPlugin({
      model: model as any,
      system: (context) => {
        const basePrompt = buildSystemPrompt(resolvedBaseDir, context);
        return `${basePrompt}\n\nYou are the Manager Agent. You have access to specialized agents.
Use the 'delegateTask' tool to delegate tasks to specialized agents.
- 'os': For file system and shell operations.
- 'browser': For web browsing and data extraction.
Include all necessary details in the task description.`;
      },
      toolDefinitions: {
        ...metaAgentToolDefinitions,
        delegateTask: {
          description: "Delegate a task to a specialized agent.",
          inputSchema: z.object({
            agent: z.enum(["os", "browser"]).describe("The specialized agent to use"),
            task: z.string().describe("The task description"),
          }),
        },
      },
    }))
    // Handler for the manager's delegation tool
    .on("action:delegateTask", async function* (event: any, { state }) {
      const { agent, task, toolCallId } = event.data;
      if (agent === "os") {
        (state as any).pendingOSTask = { toolCallId };
        yield {
          type: "agent:os:input",
          data: { content: task },
        };
      } else if (agent === "browser") {
        (state as any).pendingBrowserTask = { toolCallId };
        yield {
          type: "agent:browser:input",
          data: { content: task },
        };
      }
    })
    .on("init", initHandler);
}
