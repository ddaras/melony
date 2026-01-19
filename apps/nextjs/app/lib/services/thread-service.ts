import type { ThreadService, ThreadData } from "@melony/react";
import { generateId } from "melony/client";

export const createMelonyThreadService = (): ThreadService => {
  return {
    getThreads: async () => {
      return [];
    },
    deleteThread: async (threadId: string) => {
      // No-op for this example
    },
    getEvents: async (threadId: string) => {
      return [];
    },
    createThread: async () => {
      return generateId();
    },
  };
};
