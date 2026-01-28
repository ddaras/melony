import { melony } from "melony";
import { ChatEvent, ChatState } from "./types";
import { shellPlugin, shellToolDefinitions } from "@melony/plugin-shell";
import { fileSystemPlugin, fileSystemToolDefinitions } from "@melony/plugin-file-system";
import { aiSDKPlugin } from "@melony/plugin-ai-sdk";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const normalize = (value: string | undefined): string => value?.trim() ?? "";

export const expressAgent = melony<ChatState, ChatEvent>()
  .use(shellPlugin())
  .use(fileSystemPlugin())
  .use(aiSDKPlugin({
    model: openai("gpt-4o-mini"),
    system: "You are a helpful assistant.",
    toolDefinitions: {
      ...shellToolDefinitions,
      ...fileSystemToolDefinitions,
    }
  }))
  .on("init", async function* () {
    yield {
      type: "assistant:text",
      data: {
        content: "Welcome to Melony Express! Send `user:text` events to get started.",
      },
    };
  })
  .on("user:text", async function* (event, context) {
    const userMessage = normalize(event.data.content);
    const reply = userMessage
      ? `I heard you say "${userMessage}". This Express demo just echoes your message for now.`
      : "Looks like you sent an empty message! Try typing anything and I'll echo it back.";

    context.state.lastUserMessage = userMessage;

    yield {
      type: "assistant:text",
      data: {
        content: reply,
      },
    };
  });
