import "dotenv/config";
import * as http from "node:http";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import open from "open";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const program = new Command();

program
  .name("melony-studio")
  .description("Melony Studio - A local UI for interacting with and debugging Melony agents")
  .version("0.2.5")
  .option("-p, --port <port>", "Port to run the studio on", "4000")
  .option("-u, --url <url>", "Agent server BASE_URL", process.env.MELONY_SERVER_URL ?? "http://localhost:4001")
  .action(async (options) => {
    const port = parseInt(options.port);
    const baseUrl = options.url;
    
    // Path to the studio files (relative to the compiled cli.js in dist/)
    const studioRoot = path.resolve(__dirname, "./studio");
    
    if (!fs.existsSync(studioRoot)) {
      console.error("❌ Studio files not found. Please run 'pnpm build' first.");
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

program.parse();
