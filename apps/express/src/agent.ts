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
import path from "node:path";

type Provider = "openai" | "anthropic";

interface ParsedModel {
  provider: Provider;
  modelId: string;
}

/**
 * Parse model string to extract provider and model ID
 * Supports formats: "provider:model", "provider/model", or just "model" (defaults to openai)
 */
function parseModelString(modelString: string): ParsedModel {
  // Check for provider:model format
  if (modelString.includes(":")) {
    const [provider, modelId] = modelString.split(":");
    if (provider === "openai" || provider === "anthropic") {
      return { provider, modelId };
    }
  }

  // Check for provider/model format
  if (modelString.includes("/")) {
    const [provider, modelId] = modelString.split("/");
    if (provider === "openai" || provider === "anthropic") {
      return { provider, modelId };
    }
  }

  // Auto-detect provider based on model name
  if (modelString.startsWith("claude") || modelString.startsWith("claude-")) {
    return { provider: "anthropic", modelId: modelString };
  }

  // Default to OpenAI
  return { provider: "openai", modelId: modelString };
}

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

  // Parse model configuration
  const { provider, modelId } = parseModelString(config.model || "gpt-5-nano");

  // Tool definitions shared by both providers
  const toolDefinitions = {
    ...shellToolDefinitions,
    ...browserToolDefinitions,
    ...fileSystemToolDefinitions,
    ...metaAgentToolDefinitions,
  };

  // Create the appropriate LLM plugin based on provider
  let model;

  if (provider === "anthropic") {
    if (!anthropicKey) {
      console.warn("Warning: Anthropic model selected but ANTHROPIC_API_KEY is not set");
    }
    model = anthropic(modelId);
  } else {
    if (!openaiKey) {
      console.warn("Warning: OpenAI model selected but OPENAI_API_KEY is not set");
    }
    model = openai(modelId);
  }

  const llmPlugin = aiSDKPlugin({
    model: model as any,
    system: (_context) => buildSystemPrompt(resolvedBaseDir),
    toolDefinitions,
  });

  // Use a dedicated directory for the agent's browser data to avoid conflicts with your main Chrome.
  // Using the root Chrome directory causes conflicts and can log you out of your main browser.
  const userDataDir = path.join(os.homedir(), ".openbot", "browser-data");

  return melony<ChatState, ChatEvent>()
    .use(shellPlugin({ cwd: process.cwd() }))
    .use(browserPlugin({
      headless: true, // Set to false once to log in manually if needed
      userDataDir: userDataDir,
      channel: 'chrome'
    }))
    .use(fileSystemPlugin({
      baseDir: "/", // Global access
    }))
    .use(metaAgentPlugin({
      baseDir: resolvedBaseDir,
      allowSoulModification: false, // Protect core values
    }))
    .use(llmPlugin)
    .on("init", initHandler);
}
