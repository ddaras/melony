import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { ChatState, ChatEvent } from "./types.js";

const SESSIONS_DIR = path.join(os.homedir(), ".openbot", "sessions");

function getSessionDir(sessionId: string): string {
  if (!fs.existsSync(SESSIONS_DIR)) {
    const today = new Date().toISOString().slice(0, 10);
    return path.join(SESSIONS_DIR, today, sessionId);
  }

  // 1. Check if it already exists in a date-based folder (YYYY-MM-DD or YYYY-MM)
  const dateFolders = fs.readdirSync(SESSIONS_DIR).filter(d => /^\d{4}-\d{2}(-\d{2})?$/.test(d));
  for (const folder of dateFolders) {
    const dir = path.join(SESSIONS_DIR, folder, sessionId);
    if (fs.existsSync(dir)) {
      return dir;
    }
  }

  // 2. Check if it exists in the root (legacy)
  const legacyDir = path.join(SESSIONS_DIR, sessionId);
  if (fs.existsSync(legacyDir) && fs.statSync(legacyDir).isDirectory()) {
    const stats = fs.statSync(legacyDir);
    const day = stats.mtime.toISOString().slice(0, 10);
    const newDir = path.join(SESSIONS_DIR, day, sessionId);
    
    fs.mkdirSync(path.dirname(newDir), { recursive: true });
    try {
      fs.renameSync(legacyDir, newDir);
      return newDir;
    } catch (error) {
      console.warn(`Failed to migrate session ${sessionId} to ${day}:`, error);
      return legacyDir;
    }
  }

  // 3. New session - use current day
  const today = new Date().toISOString().slice(0, 10);
  return path.join(SESSIONS_DIR, today, sessionId);
}

export async function loadSession(sessionId: string): Promise<ChatState | null> {
  const sessionDir = getSessionDir(sessionId);
  const statePath = path.join(sessionDir, "state.json");

  if (!fs.existsSync(statePath)) {
    return null;
  }

  try {
    const data = fs.readFileSync(statePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Failed to load session ${sessionId}:`, error);
    return null;
  }
}

export async function saveSession(sessionId: string, state: ChatState) {
  const sessionDir = getSessionDir(sessionId);
  
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  const statePath = path.join(sessionDir, "state.json");
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2), "utf-8");
}

export async function logEvent(sessionId: string, runId: string, event: ChatEvent) {
  const sessionDir = getSessionDir(sessionId);
  
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }
  
  const logPath = path.join(sessionDir, `events.jsonl`);

  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    runId,
    ...event,
  });

  fs.appendFileSync(logPath, entry + "\n", "utf-8");
}
