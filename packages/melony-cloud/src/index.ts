import { MelonyPlugin, Event } from "melony";

export interface MelonyCloudOptions {
  /** 
   * Your Melony Cloud API Key. 
   * If not provided, it will look for the MELONY_API_KEY environment variable.
   */
  apiKey?: string;
  /** Optional project identifier for multi-project support */
  projectId?: string;
  /** Base URL for the Melony Cloud API (defaults to production) */
  baseUrl?: string;
  /** Disable event reporting (useful for local development) */
  disabled?: boolean;
  /** 
   * Whitelist of event types to store. 
   * If provided, only these events will be sent to Melony Cloud.
   * If not provided, all events are stored.
   */
  events?: string[];
}

/**
 * Melony Cloud Plugin
 * 
 * Provides instant observability, event persistence, and auth integration.
 */
export const cloud = <TState = any, TEvent extends Event = Event>(
  options: MelonyCloudOptions = {}
): MelonyPlugin<TState, TEvent> => {
  const { 
    apiKey: providedApiKey, 
    projectId, 
    baseUrl = "https://api.melony.cloud", 
    disabled = false,
    events: whitelistedEvents
  } = options;

  // Resolve API Key from options or environment
  const apiKey = providedApiKey || (typeof process !== "undefined" ? process.env.MELONY_API_KEY : undefined);
  const endpoint = `${baseUrl.replace(/\/$/, "")}/api/v1/ingest`;

  return (builder) => {
    if (disabled || !apiKey) {
      if (!apiKey && !disabled) {
        console.warn("[Melony Cloud] No API key provided. Observability features are disabled.");
      }
      return;
    }

    // --- 1. Observability & Persistence ---
    // We listen to all events (*) and forward them to Melony Cloud if they match the whitelist.
    builder.on("*", (event, context) => {
      // Check if event is whitelisted
      if (whitelistedEvents && !whitelistedEvents.includes(event.type)) {
        return;
      }

      const payload = {
        apiKey,
        projectId,
        runId: context.runId,
        timestamp: Date.now(),
        event,
        state: context.state,
      };

      // Fire and forget to keep the agent execution fast
      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload),
      }).catch(err => {
        // Silently handle ingestion errors
        console.error("[Melony Cloud] Failed to persist event:", err);
      });
    });

    // --- 2. Authentication Context ---
    // Inject cloud configuration into the runtime state so other handlers 
    // can access the project ID or environment if needed.
    builder.intercept(async (event, context) => {
      const state = context.state as any;
      if (!state.cloud) {
        state.cloud = { projectId, authenticated: true };
      }
      return event;
    });

    // --- 3. Managed Auth Handlers ---
    // Built-in handlers for 'auth:verify' events
    // We use any casting to avoid type errors with narrowed TEvent unions
    builder.on("auth:verify" as any, (async function* (event: any, context: any) {
      const { token } = event.data || {};
      
      if (!token) {
        yield { type: "auth:fail", data: { message: "No token provided" } };
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/v1/auth/verify`, {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token })
        });

        if (response.ok) {
          const userData = await response.json();
          context.state.user = userData;
          yield { type: "auth:success", data: userData };
        } else {
          yield { type: "auth:fail", data: { message: "Invalid token" } };
        }
      } catch (err) {
        yield { type: "auth:fail", data: { message: "Auth service unavailable" } };
      }
    }) as any);
  };
};
