import { generateObject, streamText, tool } from "ai";
import type { Action } from "./types";
import { openai } from "@ai-sdk/openai";
import z from "zod";

interface HandlerOptions {
  actions: Action[];
}

export function createHandler({ actions }: HandlerOptions) {
  return async function handler(req: Request) {
    const { input } = await req.json();

    const { object: plan } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: z.object({
        steps: z.array(
          z.object({
            agentId: z.string(),
            defaultValues: z.record(z.string(), z.any()),
          })
        ),
      }),
      prompt: `Generate a plan for the user's input.

      User input: ${input}
      
      Available Actions: ${actions
        .map((action) => {
          return `${action.id}: ${action.name} - ${
            action.description
          }. parameters: ${JSON.stringify(action.parameters)}`;
        })
        .join("\n")}
      `,
    });

    try {
      const result = streamText({
        model: openai("gpt-4o-mini"),
        system: `You are a helpful assistant.

        Plan: ${JSON.stringify(plan)}
        `,
        messages: [
          {
            role: "user",
            content: input,
          },
        ],
        tools: {
          execute_action: tool({
            name: "execute_action",
            description: "Execute an action",
            inputSchema: z.object({
              actionId: z.string(),
              parameters: z.record(z.string(), z.any()),
            }),
            outputSchema: z.object({
              response: z.any(),
            }),
            execute: async ({ actionId, parameters }) => {
              const action = actions.find((a) => a.id === actionId);

              if (!action) {
                return { response: "Action not found" };
              }

              const response = await action.run(parameters);

              return { response: response };
            },
          }),
        },
      });

      return result.toUIMessageStreamResponse();
    } catch (err: any) {
      console.error(err);
      return new Response("Internal Server Error", { status: 500 });
    }
  };
}
