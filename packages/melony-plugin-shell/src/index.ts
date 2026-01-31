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
  /**
   * Maximum number of characters to keep in stdout/stderr.
   * If exceeded, the output will be truncated from the middle.
   * Default: 2000 (1000 from start, 1000 from end)
   */
  maxOutputLength?: number;
}

/**
 * Truncates a string by keeping the first and last N characters.
 */
function truncate(str: string | undefined | null, maxChars: number): string | undefined | null {
  if (!str || str.length <= maxChars) return str;
  const half = Math.floor(maxChars / 2);
  const truncatedCount = str.length - maxChars;
  return `${str.slice(0, half)}\n\n[... ${truncatedCount} characters truncated ...]\n\n${str.slice(-half)}`;
}

export const shellPlugin = (options: ShellPluginOptions = {}): MelonyPlugin<any, any> => (builder) => {
  const { cwd = process.cwd(), env = process.env, maxOutputLength = 10000 } = options;

  builder.on("action:executeCommand", async function* (event) {
    const { command, toolCallId } = event.data;

    yield {
      type: "ui",
      data: {
        type: 'text',
        props: {
          value: `Executing command: ${command}`,
        }
      },
    };


    try {
      const { stdout, stderr } = await execAsync(command, { cwd, env });

      yield {
        type: "ui",
        data: {
          type: 'text',
          props: {
            value: `Command executed successfully`,
          }
        },
      };

      yield {
        type: "action:result",
        data: {
          action: "executeCommand",
          toolCallId,
          result: {
            stdout: truncate(stdout, maxOutputLength),
            stderr: truncate(stderr, maxOutputLength),
            success: true
          },
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
            stdout: truncate(error.stdout, maxOutputLength),
            stderr: truncate(error.stderr, maxOutputLength),
            success: false,
          },
        },
      };

      yield {
        type: "ui",
        data: {
          type: 'text',
          props: {
            value: `Command failed: ${error.message}`,
          }
        },
      };
    }
  });
};
