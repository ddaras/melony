import { LlmMessage, LlmProvider, LlmProviderEvent, LlmTool } from "@melony/llm";

type OpenAiToolCallAccumulator = {
  id?: string;
  name?: string;
  arguments: string;
};

export interface OpenAIProviderOptions {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

const toOpenAiMessages = (messages: LlmMessage[], system?: string) => {
  const openAiMessages: Array<{ role: string; content?: string; tool_call_id?: string; name?: string }> = [];

  if (system) {
    openAiMessages.push({ role: "system", content: system });
  }

  for (const message of messages) {
    if (message.role === "tool") {
      openAiMessages.push({
        role: "tool",
        content: message.content,
        tool_call_id: message.toolCallId,
        name: message.name
      });
      continue;
    }

    openAiMessages.push({
      role: message.role,
      content: message.content
    });
  }

  return openAiMessages;
};

const toOpenAiTools = (tools: LlmTool[] = []) =>
  tools.map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }
  }));

export function createOpenAIProvider(options: OpenAIProviderOptions = {}): LlmProvider {
  const model = options.model || "gpt-4o-mini";
  const baseUrl = options.baseUrl || "https://api.openai.com/v1";
  const fetchImpl = options.fetchImpl || fetch;

  return {
    name: "openai-chat-completions",
    async *generate(args) {
      const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        yield {
          type: "error",
          error: "Missing OpenAI API key. Set OPENAI_API_KEY or pass apiKey to createOpenAIProvider()."
        } as LlmProviderEvent;
        return;
      }

      const response = await fetchImpl(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: toOpenAiMessages(args.messages, args.system),
          tools: toOpenAiTools(args.tools),
          temperature: args.temperature,
          max_tokens: args.maxOutputTokens,
          stream: true
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        yield {
          type: "error",
          error: `OpenAI request failed (${response.status}): ${errorBody}`
        } as LlmProviderEvent;
        return;
      }

      if (!response.body) {
        yield { type: "error", error: "OpenAI response body was empty." } as LlmProviderEvent;
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";
      const toolCalls: OpenAiToolCallAccumulator[] = [];

      const processPayload = (payload: string): LlmProviderEvent[] => {
        const events: LlmProviderEvent[] = [];
        if (payload === "[DONE]") {
          return events;
        }

        const parsed = JSON.parse(payload);
        const choice = parsed?.choices?.[0];
        const delta = choice?.delta;

        if (typeof delta?.content === "string" && delta.content.length > 0) {
          fullText += delta.content;
          events.push({ type: "text:delta", text: delta.content });
        }

        if (Array.isArray(delta?.tool_calls)) {
          for (const toolDelta of delta.tool_calls) {
            const index = Number(toolDelta.index ?? 0);
            if (!toolCalls[index]) {
              toolCalls[index] = { arguments: "" };
            }

            if (typeof toolDelta.id === "string") {
              toolCalls[index].id = toolDelta.id;
            }

            if (typeof toolDelta.function?.name === "string") {
              toolCalls[index].name = toolDelta.function.name;
            }

            if (typeof toolDelta.function?.arguments === "string") {
              toolCalls[index].arguments += toolDelta.function.arguments;
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

      for (const call of toolCalls) {
        if (!call?.name) {
          continue;
        }
        let parsedInput: any = call.arguments;
        try {
          parsedInput = call.arguments ? JSON.parse(call.arguments) : {};
        } catch {
          // Keep raw input if it isn't valid JSON.
        }
        yield {
          type: "tool:call",
          callId: call.id || `call_${Math.random().toString(36).slice(2)}`,
          name: call.name,
          input: parsedInput
        } as LlmProviderEvent;
      }

      if (fullText.length > 0) {
        yield { type: "text:done", text: fullText } as LlmProviderEvent;
      }

      yield { type: "done" } as LlmProviderEvent;
    }
  };
}
