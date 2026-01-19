import type { ThreadService, ThreadData } from "@melony/react";
import { generateId } from "melony/client";
import { TOKEN_STORAGE_KEY } from "./auth-service";

const DEFAULT_THREADS_ENDPOINT =
  "https://melony-cloud-api-549776254754.us-central1.run.app/api/v1/threads";
const DEFAULT_EVENTS_ENDPOINT =
  "https://melony-cloud-api-549776254754.us-central1.run.app/api/v1/events";

export const createMelonyThreadService = (
  config: {
    threadsEndpoint?: string;
    eventsEndpoint?: string;
    getToken?: () => string | null;
  } = {},
): ThreadService => {
  const threadsEndpoint = config.threadsEndpoint || DEFAULT_THREADS_ENDPOINT;
  const eventsEndpoint = config.eventsEndpoint || DEFAULT_EVENTS_ENDPOINT;

  const getAuthHeaders = () => {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    const token = config.getToken
      ? config.getToken()
      : localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  return {
    getThreads: async () => {
      const response = await fetch(threadsEndpoint, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      if (!response.ok)
        throw new Error(`Failed to fetch threads: ${response.statusText}`);
      const data = await response.json();
      const threadsData: ThreadData[] = Array.isArray(data)
        ? data
        : data.threads || [];
      return threadsData.map((thread) => ({
        ...thread,
        updatedAt: thread.updatedAt ? new Date(thread.updatedAt) : undefined,
      }));
    },
    deleteThread: async (threadId: string) => {
      const response = await fetch(`${threadsEndpoint}/${threadId}`, {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      if (!response.ok)
        throw new Error(`Failed to delete thread: ${response.statusText}`);
    },
    getEvents: async (threadId: string) => {
      const url = new URL(eventsEndpoint);
      url.searchParams.set("threadId", threadId);
      const response = await fetch(url.toString(), {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      if (!response.ok)
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      const data = await response.json();
      return Array.isArray(data) ? data : data.events || [];
    },
    createThread: async () => {
      return generateId();
    },
  };
};
