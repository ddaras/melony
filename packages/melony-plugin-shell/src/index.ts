import { MelonyPlugin } from "melony";
import { z } from "zod";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export const shellToolDefinitions = {
  executeCommand: {
    description: "Execute a shell command",
    inputSchema: z.object({
      command: z.string().describe("The shell command to execute"),
    }),
  },
};

export interface ShellPluginOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
}

export const shellPlugin = (options: ShellPluginOptions = {}): MelonyPlugin<any, any> => (builder) => {
  const { cwd = process.cwd(), env = process.env } = options;

  builder.on("action:executeCommand", async function* (event) {
    const { command, toolCallId } = event.data;
    try {
      const { stdout, stderr } = await execAsync(command, { cwd, env });
      yield {
        type: "action:result",
        data: {
          action: "executeCommand",
          toolCallId,
          result: { stdout, stderr, success: true },
        },
      };
    } catch (error: any) {
      yield {
        type: "action:result",
        data: {
          action: "executeCommand",
          toolCallId,
          result: {
            error: error.message,
            stdout: error.stdout,
            stderr: error.stderr,
            success: false,
          },
        },
      };
    }
  });
};
