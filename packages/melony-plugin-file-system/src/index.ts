import { MelonyPlugin } from "melony";
import { z } from "zod";
import * as fs from "node:fs/promises";
import * as path from "node:path";

export const fileSystemToolDefinitions = {
  readFile: {
    description: "Read the contents of a file. Path is relative to the system root (/).",
    inputSchema: z.object({
      path: z.string().describe("The absolute path to the file (e.g., '/home/user/file.txt')"),
    }),
  },
  writeFile: {
    description: "Write content to a file. Path is relative to the system root (/).",
    inputSchema: z.object({
      path: z.string().describe("The absolute path to the file (e.g., '/home/user/new-file.ts')"),
      content: z.string().describe("The content to write to the file"),
    }),
  },
  listFiles: {
    description: "List files in a directory. Path is relative to the system root (/).",
    inputSchema: z.object({
      path: z.string().describe("The absolute path to the directory (use '/' for system root)"),
    }),
  },
  deleteFile: {
    description: "Delete a file. Path is relative to the system root (/).",
    inputSchema: z.object({
      path: z.string().describe("The absolute path to the file"),
    }),
  },
};

export interface FileSystemPluginOptions {
  baseDir?: string;
  /**
   * Maximum number of characters to keep when reading a file.
   * If exceeded, the content will be truncated from the middle.
   * Default: 10000
   */
  maxFileReadLength?: number;
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

export const fileSystemPlugin = (options: FileSystemPluginOptions = {}): MelonyPlugin<any, any> => (builder) => {
  const { baseDir = process.cwd(), maxFileReadLength = 10000 } = options;

  const resolvePath = (p: string) => {
    const resolved = path.resolve(baseDir, p);
    if (!resolved.startsWith(path.resolve(baseDir))) {
      throw new Error(`Access denied: Path ${p} is outside of base directory ${baseDir}`);
    }
    return resolved;
  };

  builder.on("action:readFile", async function* (event) {
    const { path: filePath, toolCallId } = event.data;

    yield {
      type: "ui",
      data: {
        type: 'text',
        props: {
          value: `Reading file: ${filePath}`,
        }
      },
    };

    try {
      const content = await fs.readFile(resolvePath(filePath), "utf-8");
      yield {
        type: "action:result",
        data: { 
          action: "readFile", 
          result: { content: truncate(content, maxFileReadLength) }, 
          toolCallId 
        },
      };
      yield {
        type: "ui",
        data: {
          type: 'text',
          props: {
            value: `File read successfully`,
          }
        },
      };
    } catch (error: any) {
      yield {
        type: "action:result",
        data: { action: "readFile", result: { error: error.message }, toolCallId },
      };
      yield {
        type: "ui",
        data: {
          type: 'text',
          props: {
            value: `File read failed: ${error.message}`,
          }
        },
      };
    }
  });

  builder.on("action:writeFile", async function* (event) {
    const { path: filePath, content, toolCallId } = event.data;
    yield {
      type: "ui",
      data: {
        type: 'text',
        props: {
          value: `Writing file: ${filePath}`,
        }
      },
    };
    try {
      const fullPath = resolvePath(filePath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content, "utf-8");
      yield {
        type: "action:result",
        data: { action: "writeFile", result: { success: true }, toolCallId },
      };
    } catch (error: any) {
      yield {
        type: "action:result",
        data: { action: "writeFile", result: { error: error.message }, toolCallId },
      };
      yield {
        type: "ui",
        data: {
          type: 'text',
          props: {
            value: `File written successfully`,
          }
        },
      };
    }
  });

  builder.on("action:listFiles", async function* (event) {
    const { path: dirPath, toolCallId } = event.data;
    yield {
      type: "ui",
      data: {
        type: 'text',
        props: {
          value: `Listing files in: ${dirPath}`,
        }
      },
    };
    try {
      const files = await fs.readdir(resolvePath(dirPath));
      yield {
        type: "ui",
        data: {
          type: 'text',
          props: {
            value: `Files listed successfully`,
          }
        },
      };
      yield {
        type: "action:result",
        data: { action: "listFiles", result: { files }, toolCallId },
      };
    } catch (error: any) {
      yield {
        type: "ui",
        data: {
          type: 'text',
          props: {
            value: `Files listing failed: ${error.message}`,
          }
        },
      };
      yield {
        type: "action:result",
        data: { action: "listFiles", result: { error: error.message }, toolCallId },
      };
    }
  });

  builder.on("action:deleteFile", async function* (event) {
    const { path: filePath, toolCallId } = event.data;
    yield {
      type: "status",
      data: {
        type: 'text',
        props: {
          value: `Deleting file: ${filePath}`,
        }
      },
    };
    try {
      await fs.unlink(resolvePath(filePath));
      yield {
        type: "action:result",
        data: { action: "deleteFile", result: { success: true }, toolCallId },
      };
      yield {
        type: "ui",
        data: {
          type: 'text',
          props: {
            value: `File deleted successfully`,
          }
        },
      };
    } catch (error: any) {
      yield {
        type: "action:result",
        data: { action: "deleteFile", result: { error: error.message }, toolCallId },
      };
      yield {
        type: "ui",
        data: {
          type: 'text',
          props: {
            value: `File deletion failed: ${error.message}`,
          }
        },
      };
    }
  });
};
