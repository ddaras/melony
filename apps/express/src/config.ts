import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export interface MelonyConfig {
  model?: string;
  openaiApiKey?: string;
  baseDir?: string;
  port?: number;
}

export const DEFAULT_BASE_DIR = "~/mel";

export function loadConfig(): MelonyConfig {
  const configPath = path.join(os.homedir(), ".openbot", "config.json");
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch (error) {
      console.error(`Warning: Failed to parse config at ${configPath}`, error);
    }
  }
  return {};
}

export function resolvePath(p: string) {
  return p.startsWith("~/") ? path.join(os.homedir(), p.slice(2)) : path.resolve(p);
}
