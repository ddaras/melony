import os from "node:os";
import { melony } from "melony";
import { ChatEvent, ChatState } from "./types.js";
import { shellPlugin, shellToolDefinitions } from "@melony/plugin-shell";
import { browserPlugin, browserToolDefinitions } from "@melony/plugin-browser";
import { fileSystemPlugin, fileSystemToolDefinitions } from "@melony/plugin-file-system";
import { metaAgentPlugin, metaAgentToolDefinitions, buildSystemPrompt } from "@melony/plugin-meta-agent";
import { aiSDKPlugin } from "@melony/plugin-ai-sdk";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { initHandler } from "./handlers/init.js";
import { loadConfig, resolvePath, DEFAULT_BASE_DIR } from "./config.js";

/**
 * Create the OpenBot meta-agent
 * This bot has self-modification capabilities, skill management, and persistent identity
 */
export async function createOpenBot(options?: {
  openaiApiKey?: string;
  anthropicApiKey?: string;
}) {
  const config = loadConfig();

  const openaiKey = options?.openaiApiKey || config.openaiApiKey || process.env.OPENAI_API_KEY;
  const anthropicKey = options?.anthropicApiKey || config.anthropicApiKey || process.env.ANTHROPIC_API_KEY;

  if (openaiKey) {
    process.env.OPENAI_API_KEY = openaiKey;
  }

  if (anthropicKey) {
    process.env.ANTHROPIC_API_KEY = anthropicKey;
  }

  const baseDir = config.baseDir || DEFAULT_BASE_DIR;
  const resolvedBaseDir = resolvePath(baseDir);

  // Resolve model
  let model: any = openai("gpt-4o"); // Default to gpt-4o
  if (config.model) {
    const [provider, modelId] = config.model.includes(":")
      ? config.model.split(":")
      : config.model.includes("/")
      ? config.model.split("/")
      : ["openai", config.model];

    if (provider === "openai") {
      model = openai(modelId);
    } else if (provider === "anthropic") {
      model = anthropic(modelId);
    }
  }

  // Build dynamic system prompt from identity files and skills
  const systemPrompt = await buildSystemPrompt(resolvedBaseDir);

  return melony<ChatState, ChatEvent>()
    .use(shellPlugin({ cwd: os.homedir() }))
    .use(browserPlugin({ headless: true }))
    .use(fileSystemPlugin({
      baseDir: os.homedir(),
    }))
    .use(metaAgentPlugin({
      baseDir: resolvedBaseDir,
      allowSoulModification: false, // Protect core values
    }))
    .use(aiSDKPlugin({
      model,
      system: systemPrompt,
      toolDefinitions: {
        ...shellToolDefinitions,
        ...browserToolDefinitions,
        ...fileSystemToolDefinitions,
        ...metaAgentToolDefinitions,
      }
    }))
    .on("init", initHandler);
}
