import { weatherCardUIComponentPrompt } from "@/components/cards/weather-card.schema";
import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-5-nano"),
    system: `You are a helpful assistant. You can use the following components to display information: ${weatherCardUIComponentPrompt}. If user asks the weather in San Francisco, you should use some dummy data instead of responding that you have no access to real-time data.`,
    messages: convertToModelMessages(messages),
  });

  console.log(
    `You are a helpful assistant. You can use the following components to display information: ${weatherCardUIComponentPrompt}`,
  );

  return result.toUIMessageStreamResponse();
}
