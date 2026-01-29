#!/usr/bin/env node
import "dotenv/config";
import * as readline from "node:readline/promises";
import * as http from "node:http";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import open from "open";
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

program
  .command("studio")
  .description("Open Melony Studio")
  .option("-p, --port <port>", "Port to run the studio on", "4000")
  .option("-u, --url <url>", "Agent server BASE_URL", process.env.MELONY_SERVER_URL ?? "http://localhost:4001")
  .action(async (options) => {
    const port = parseInt(options.port);
    const baseUrl = options.url;
    
    // Path to the studio files (relative to the compiled cli.js in dist/)
    const studioRoot = path.resolve(__dirname, "../studio");
    
    if (!fs.existsSync(studioRoot)) {
      console.error("❌ Studio files not found. Please run 'pnpm build' in the root first.");
      process.exit(1);
    }

    const server = http.createServer((req, res) => {
      let filePath = path.join(studioRoot, req.url === "/" ? "index.html" : req.url!);
      
      // Basic security: prevent directory traversal
      if (!filePath.startsWith(studioRoot)) {
        res.statusCode = 403;
        res.end("Forbidden");
        return;
      }

      // If file doesn't exist, serve index.html (for SPA routing)
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(studioRoot, "index.html");
      }

      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes: Record<string, string> = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".wav": "audio/wav",
        ".mp4": "video/mp4",
        ".woff": "application/font-woff",
        ".ttf": "application/font-ttf",
        ".eot": "application/vnd.ms-fontobject",
        ".otf": "application/font-otf",
        ".wasm": "application/wasm",
      };

      const contentType = mimeTypes[ext] || "application/octet-stream";

      fs.readFile(filePath, "utf8", (err, content) => {
        if (err) {
          if (err.code === "ENOENT") {
            res.statusCode = 404;
            res.end("File not found");
          } else {
            res.statusCode = 500;
            res.end(`Server error: ${err.code}`);
          }
          return;
        }

        res.writeHead(200, { "Content-Type": contentType });

        // Inject BASE_URL into index.html
        if (filePath.endsWith("index.html")) {
          const injectedScript = `<script>window.MELONY_BASE_URL = "${baseUrl}";</script>`;
          content = content.replace("<head>", `<head>${injectedScript}`);
        }

        res.end(content);
      });
    });

    server.listen(port, () => {
      const studioUrl = `http://localhost:${port}`;
      console.log("------------------------------------------");
      console.log("🍎 Melony Studio");
      console.log(`Studio running at: ${studioUrl}`);
      console.log(`Connecting to agent server: ${baseUrl}`);
      console.log("Press Ctrl+C to stop");
      console.log("------------------------------------------");
      
      open(studioUrl);
    });
  });

// Default to chat if no command is provided
if (!process.argv.slice(2).length) {
  process.argv.push("chat");
}

program.parse();
