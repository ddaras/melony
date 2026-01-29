#!/usr/bin/env node
import "dotenv/config";
import * as readline from "node:readline/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { MelonyClient } from "./client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const program = new Command();

program
  .name("melony")
  .description("Melony CLI - Fast, minimalist AI agent framework")
  .version("0.1.0");

program
  .command("chat")
  .description("Start an interactive chat session with a Melony agent")
  .option("-u, --url <url>", "Server URL", process.env.MELONY_SERVER_URL ?? "http://localhost:4001/api/chat")
  .action(async (options) => {
    const client = new MelonyClient({
      url: options.url,
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("------------------------------------------");
    console.log("🍎 Melony Interactive CLI");
    console.log(`Connected to: ${options.url}`);
    console.log("Type your message and press Enter. Type 'exit' to quit.");
    console.log("------------------------------------------");

    while (true) {
      const input = await rl.question("\nYou: ");

      if (input.toLowerCase() === "exit" || input.toLowerCase() === "quit") {
        break;
      }

      if (!input.trim()) continue;

      process.stdout.write("Agent: ");

      try {
        const stream = client.send({
          type: "user:text",
          data: { content: input },
        } as any);

        let fullResponse = "";

        for await (const event of stream) {
          if (event.type === "assistant:text-delta") {
            const delta = (event.data as any).delta;
            process.stdout.write(delta);
            fullResponse += delta;
          } else if (event.type === "assistant:text") {
            if (!fullResponse) {
              process.stdout.write((event.data as any).content);
            }
          } else if (event.type.startsWith("action:")) {
            console.log(`\n[Action: ${JSON.stringify(event.data, null, 2)}]`);
          }
        }
        process.stdout.write("\n");
      } catch (error) {
        console.error("\nError:", error instanceof Error ? error.message : String(error));
      }
    }

    console.log("\nGoodbye!");
    rl.close();
  });

// Default to chat if no command is provided
if (!process.argv.slice(2).length) {
  process.argv.push("chat");
}

program.parse();
