import { melony, generateId, plugin } from "melony";
import { requireApproval } from "melony/plugins/require-approval";

import { checkWeather } from "./actions/check-weather";
import { persistEventsPlugin } from "./plugins/persist-events";
import { brain } from "./brains/brain";

/**
 * Ensures every conversation has a threadId and updates the client URL.
 */
const threadManagementPlugin = plugin({
  name: "thread-management",
  onBeforeRun: async function* ({ event }, context) {
    if (!context.state?.threadId) {
      // If your service generates the ID, you can get it here.
      // For now, we generate a fresh one if missing.
      const newThreadId = generateId();

      if (!context.state) {
        context.state = {};
      }
      context.state.threadId = newThreadId;

      // Force the client to update its URL with the new threadId
      yield {
        type: "client:navigate",
        data: { url: `?threadId=${newThreadId}` },
        role: "assistant"
      };
    }
  }
});

export const rootAgent = melony({
  brain,
  actions: { checkWeather },
  plugins: [
    threadManagementPlugin,
    persistEventsPlugin,
    requireApproval({ actions: ["checkWeather"] }),
  ],
  starterPrompts: [
    {
      label: "Generate a banner with make up data",
      prompt: "generate a banner with make up data",
    },
    {
      label: "What is the weather in London?",
      prompt: "What is the weather in London?",
    },
    {
      label: "What is the weather in Paris?",
      prompt: "What is the weather in Paris?",
    },
    {
      label: "What is the weather in Berlin?",
      prompt: "What is the weather in Berlin?",
    },
  ],
  options: [
    {
      id: "size",
      label: "Size",
      options: [
        { id: "vertical", label: "Vertical", value: "vertical" },
        { id: "square", label: "Square", value: "square" },
        { id: "landscape", label: "Landscape", value: "landscape" },
      ],
    },
    {
      id: "capabilities",
      label: "Capabilities",
      options: [
        { id: "search", label: "Web Search", value: true },
        { id: "vision", label: "Image Analysis", value: true },
      ],
    },
  ],
});
