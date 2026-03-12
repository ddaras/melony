import { LlmMessage, LlmProvider, LlmProviderEvent, LlmTool } from "@melony/llm";

type GeminiContent = {
  role: "user" | "model";
  parts: Array<Record<string, any>>;
};

export interface GeminiProviderOptions {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

function toGeminiSchema(value: any): any {
  if (Array.isArray(value)) {
    return value.map((entry) => toGeminiSchema(entry));
  }
  if (value && typeof value === "object") {
    const result: Record<string, any> = {};
    for (const [key, entry] of Object.entries(value)) {
      if (key === "type" && typeof entry === "string") {
        result[key] = entry.toUpperCase();
      } else {
        result[key] = toGeminiSchema(entry);
      }
    }
    return result;
  }
  return value;
}

function toGeminiContents(messages: LlmMessage[]): GeminiContent[] {
  const contents: GeminiContent[] = [];

  for (const message of messages) {
    const assistantWithToolCalls = message as LlmMessage & {
      toolCalls?: Array<{ id: string; name: string; input: any }>;
    };

    if (
      message.role === "assistant" &&
      Array.isArray(assistantWithToolCalls.toolCalls) &&
      assistantWithToolCalls.toolCalls.length > 0
    ) {
      const parts: Array<Record<string, any>> = [];
      if (typeof message.content === "string" && message.content.length > 0) {
        parts.push({ text: message.content });
      }
      for (const toolCall of assistantWithToolCalls.toolCalls) {
        let args: any = toolCall.input ?? {};
        if (typeof args === "string") {
          try {
            args = JSON.parse(args);
          } catch {
            args = { raw: args };
          }
        }
        parts.push({
          functionCall: {
            name: toolCall.name,
            args
          }
        });
      }
      if (parts.length > 0) {
        contents.push({ role: "model", parts });
      }
      continue;
    }

    if (message.role === "tool") {
      let response: any = message.content;
      if (typeof message.content === "string") {
        try {
          response = JSON.parse(message.content);
        } catch {
          response = { content: message.content };
        }
      }
      contents.push({
        role: "user",
        parts: [
          {
            functionResponse: {
              name: message.name || "tool",
              response
            }
          }
        ]
      });
      continue;
    }

    if (message.role === "system") {
      // System instructions are passed via `systemInstruction` in request body.
      continue;
    }

    const role = message.role === "assistant" ? "model" : "user";
    contents.push({
      role,
      parts: [{ text: message.content }]
    });
  }

  return contents;
}

const toGeminiTools = (tools: LlmTool[] = []) => {
  if (tools.length === 0) {
    return undefined;
  }
  return [
    {
      functionDeclarations: tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        parameters: toGeminiSchema(tool.parameters)
      }))
    }
  ];
};

export function createGeminiProvider(options: GeminiProviderOptions = {}): LlmProvider {
  const model = options.model || "gemini-2.0-flash";
  const baseUrl = options.baseUrl || "https://generativelanguage.googleapis.com/v1beta";
  const fetchImpl = options.fetchImpl || fetch;

  return {
    name: "google-gemini-generate-content",
    async *generate(args) {
      const apiKey = options.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      if (!apiKey) {
        yield {
          type: "error",
          error: "Missing Gemini API key. Set GEMINI_API_KEY/GOOGLE_API_KEY or pass apiKey to createGeminiProvider()."
        } as LlmProviderEvent;
        return;
      }

      const endpoint = `${baseUrl.replace(/\/$/, "")}/models/${model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;
      const response = await fetchImpl(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: toGeminiContents(args.messages),
          tools: toGeminiTools(args.tools),
          generationConfig: {
            temperature: args.temperature,
            maxOutputTokens: args.maxOutputTokens
          },
          systemInstruction: args.system
            ? {
                parts: [{ text: args.system }]
              }
            : undefined
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        yield {
          type: "error",
          error: `Gemini request failed (${response.status}): ${errorBody}`
        } as LlmProviderEvent;
        return;
      }

      if (!response.body) {
        yield { type: "error", error: "Gemini response body was empty." } as LlmProviderEvent;
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";
      let toolCallCounter = 0;

      const processPayload = (payload: string): LlmProviderEvent[] => {
        const events: LlmProviderEvent[] = [];
        const parsed = JSON.parse(payload);
        const candidates = Array.isArray(parsed?.candidates) ? parsed.candidates : [];

        for (const candidate of candidates) {
          const parts = Array.isArray(candidate?.content?.parts) ? candidate.content.parts : [];

          for (const part of parts) {
            if (typeof part?.text === "string" && part.text.length > 0) {
              fullText += part.text;
              events.push({ type: "text:delta", text: part.text });
            }

            if (part?.functionCall?.name) {
              const argsValue = part.functionCall.args;
              let parsedInput: any = argsValue;
              if (typeof argsValue === "string") {
                try {
                  parsedInput = argsValue.length ? JSON.parse(argsValue) : {};
                } catch {
                  parsedInput = argsValue;
                }
              }
              events.push({
                type: "tool:call",
                callId: `gemini_call_${toolCallCounter++}`,
                name: part.functionCall.name,
                input: parsedInput ?? {}
              });
            }
          }
        }

        return events;
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const packets = buffer.split("\n\n");
        buffer = packets.pop() || "";

        for (const packet of packets) {
          for (const line of packet.split("\n")) {
            if (!line.startsWith("data:")) {
              continue;
            }
            const payload = line.slice(5).trim();
            if (!payload) {
              continue;
            }
            try {
              for (const providerEvent of processPayload(payload)) {
                yield providerEvent;
              }
            } catch (error) {
              yield {
                type: "error",
                error: error instanceof Error ? error.message : String(error)
              } as LlmProviderEvent;
            }
          }
        }
      }

      if (buffer.trim()) {
        for (const line of buffer.split("\n")) {
          if (!line.startsWith("data:")) {
            continue;
          }
          const payload = line.slice(5).trim();
          if (!payload) {
            continue;
          }
          try {
            for (const providerEvent of processPayload(payload)) {
              yield providerEvent;
            }
          } catch (error) {
            yield {
              type: "error",
              error: error instanceof Error ? error.message : String(error)
            } as LlmProviderEvent;
          }
        }
      }

      if (fullText.length > 0) {
        yield { type: "text:done", text: fullText } as LlmProviderEvent;
      }

      yield { type: "done" } as LlmProviderEvent;
    }
  };
}
