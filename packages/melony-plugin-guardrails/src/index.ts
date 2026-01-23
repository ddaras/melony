import { MelonyPlugin, Event } from "melony";

export interface GuardrailsPluginOptions {
  /**
   * Function to check if a text is safe.
   * Should return true if safe, false otherwise.
   */
  check: (text: string) => Promise<boolean>;
  /**
   * Optional message to yield when content is blocked.
   */
  blockedMessage?: string;
  /**
   * Optional list of event types to check.
   * Defaults to ["text", "text-delta"].
   */
  eventTypes?: string[];
}

/**
 * Guardrails Plugin for Melony.
 * Monitors events and blocks content that violates safety policies.
 */
export const guardrailsPlugin = (options: GuardrailsPluginOptions): MelonyPlugin<any, any> => (builder) => {
  const { 
    check, 
    blockedMessage = "I'm sorry, but I cannot process that request as it violates my safety policy.",
    eventTypes = ["text", "text-delta"]
  } = options;

  builder.on("*", async function* (event, { suspend }) {
    if (!eventTypes.includes(event.type)) return;

    const text = (event.data as any).content || (event.data as any).delta || (event.data as any).text || "";
    if (!text) return;

    try {
      const isSafe = await check(text);
      if (!isSafe) {
        // Yield an error event
        yield {
          type: "error",
          data: { message: "Safety violation detected." },
        };

        // Suspend the runtime with a blocked message
        suspend({
          type: "text",
          data: { content: blockedMessage },
        } as any);
      }
    } catch (error) {
      console.error("[GuardrailsPlugin] Failed to check content safety:", error);
    }
  });
};
