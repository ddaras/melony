import { AuthService, ThreadService, ThreadData } from "../types";
import { generateId } from "melony/client";

const TOKEN_STORAGE_KEY = "melony_auth_token";
const DEFAULT_AUTH_URL =
  "https://auth-service-549776254754.us-central1.run.app";
const DEFAULT_THREADS_ENDPOINT =
  "https://melony-cloud-api-549776254754.us-central1.run.app/api/v1/threads";
const DEFAULT_EVENTS_ENDPOINT =
  "https://melony-cloud-api-549776254754.us-central1.run.app/api/v1/events";

export interface MelonyCloudConfig {
  authBaseUrl?: string;
  threadsEndpoint?: string;
  eventsEndpoint?: string;
  getToken?: () => string | null;
}

export const createMelonyAuthService = (
  config: MelonyCloudConfig = {}
): AuthService => {
  const authBaseUrl = config.authBaseUrl || DEFAULT_AUTH_URL;

  const getToken = () => {
    if (config.getToken) return config.getToken();

    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) return storedToken;

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      urlParams.delete("token");
      const newUrl =
        window.location.pathname +
        (urlParams.toString() ? `?${urlParams.toString()}` : "") +
        window.location.hash;
      window.history.replaceState({}, "", newUrl);
      return token;
    }

    return null;
  };

  return {
    getToken,
    getMe: async () => {
      const token = getToken();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${authBaseUrl}/api/auth/me`, {
        method: "GET",
        credentials: "include",
        headers,
      });

      if (response.ok) return await response.json();
      return null;
    },
    login: () => {
      window.location.href = `${authBaseUrl}/api/auth/google`;
    },
    logout: async () => {
      const response = await fetch(`${authBaseUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    },
  };
};

export const createMelonyThreadService = (
  config: MelonyCloudConfig = {}
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
