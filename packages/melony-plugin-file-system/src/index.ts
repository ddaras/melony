import { MelonyPlugin } from "melony";
import { z } from "zod";
import * as fs from "node:fs/promises";
import * as path from "node:path";

export const fileSystemToolDefinitions = {
  readFile: {
    description: "Read the contents of a file",
    inputSchema: z.object({
      path: z.string().describe("The path to the file to read"),
    }),
  },
  writeFile: {
    description: "Write content to a file",
    inputSchema: z.object({
      path: z.string().describe("The path to the file to write"),
      content: z.string().describe("The content to write to the file"),
    }),
  },
  listFiles: {
    description: "List files in a directory",
    inputSchema: z.object({
      path: z.string().describe("The path to the directory to list"),
    }),
  },
  deleteFile: {
    description: "Delete a file",
    inputSchema: z.object({
      path: z.string().describe("The path to the file to delete"),
    }),
  },
};

export interface FileSystemPluginOptions {
  baseDir?: string;
}

export const fileSystemPlugin = (options: FileSystemPluginOptions = {}): MelonyPlugin<any, any> => (builder) => {
  const { baseDir = process.cwd() } = options;

  const resolvePath = (p: string) => {
    const resolved = path.resolve(baseDir, p);
    if (!resolved.startsWith(path.resolve(baseDir))) {
      throw new Error(`Access denied: Path ${p} is outside of base directory ${baseDir}`);
    }
    return resolved;
  };

  builder.on("action:readFile", async function* (event) {
    const { path: filePath } = event.data;
    try {
      const content = await fs.readFile(resolvePath(filePath), "utf-8");
      yield {
        type: "action:result",
        data: { action: "readFile", result: { content } },
      };
    } catch (error: any) {
      yield {
        type: "action:result",
        data: { action: "readFile", result: { error: error.message } },
      };
    }
  });

  builder.on("action:writeFile", async function* (event) {
    const { path: filePath, content } = event.data;
    try {
      const fullPath = resolvePath(filePath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content, "utf-8");
      yield {
        type: "action:result",
        data: { action: "writeFile", result: { success: true } },
      };
    } catch (error: any) {
      yield {
        type: "action:result",
        data: { action: "writeFile", result: { error: error.message } },
      };
    }
  });

  builder.on("action:listFiles", async function* (event) {
    const { path: dirPath } = event.data;
    try {
      const files = await fs.readdir(resolvePath(dirPath));
      yield {
        type: "action:result",
        data: { action: "listFiles", result: { files } },
      };
    } catch (error: any) {
      yield {
        type: "action:result",
        data: { action: "listFiles", result: { error: error.message } },
      };
    }
  });

  builder.on("action:deleteFile", async function* (event) {
    const { path: filePath } = event.data;
    try {
      await fs.unlink(resolvePath(filePath));
      yield {
        type: "action:result",
        data: { action: "deleteFile", result: { success: true } },
      };
    } catch (error: any) {
      yield {
        type: "action:result",
        data: { action: "deleteFile", result: { error: error.message } },
      };
    }
  });
};
