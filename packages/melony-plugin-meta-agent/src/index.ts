import { MelonyPlugin } from "melony";
import { z } from "zod";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import matter from "gray-matter";

// Tool definitions for the meta-agent capabilities
export const metaAgentToolDefinitions = {
  loadSkill: {
    description: "Load a skill's full instructions when you need to use it. Call this before executing a skill.",
    inputSchema: z.object({
      skillId: z.string().describe("The skill folder name (e.g., 'code-review')"),
    }),
  },
  createSkill: {
    description: "Create a new skill from learned knowledge. Use when you discover a reusable pattern.",
    inputSchema: z.object({
      id: z.string().describe("Skill folder name in kebab-case (e.g., 'web-search')"),
      title: z.string().describe("Human-readable skill title"),
      description: z.string().describe("Brief description of what the skill does"),
      content: z.string().describe("Full skill instructions in markdown"),
    }),
  },
  updateSkill: {
    description: "Update an existing skill with new knowledge or improvements.",
    inputSchema: z.object({
      id: z.string().describe("The skill folder name (e.g., 'code-review')"),
      title: z.string().optional().describe("New title for the skill"),
      description: z.string().optional().describe("New description for the skill"),
      content: z.string().describe("Updated full skill instructions in markdown"),
    }),
  },
  listSkills: {
    description: "List all available skills with their metadata",
    inputSchema: z.object({}),
  },
  updateIdentity: {
    description: "Update your identity file to refine your personality and traits",
    inputSchema: z.object({
      content: z.string().describe("New content for IDENTITY.md"),
    }),
  },
  readIdentity: {
    description: "Read your current identity or soul configuration",
    inputSchema: z.object({
      file: z.enum(["IDENTITY.md", "SOUL.md"]).describe("Which identity file to read"),
    }),
  },
  appendToMemory: {
    description: "Add a fact or note to your long-term memory",
    inputSchema: z.object({
      category: z.enum(["facts", "journal"]).describe("Memory category"),
      content: z.string().describe("Content to append"),
    }),
  },
};

export interface SkillMeta {
  id: string;
  title: string;
  description: string;
  version?: string;
  tools?: string[];
  triggers?: string[];
}

export interface MetaAgentPluginOptions {
  baseDir: string; // e.g., "~/mel"
  allowSoulModification?: boolean; // default: false (safety)
}

// Default content for identity files
const DEFAULT_SOUL = `# Soul

## Core Values
- Be helpful, honest, and harmless
- Respect user privacy and data
- Learn and improve continuously
- Be transparent about capabilities and limitations

## Ethical Guidelines
- Never assist with harmful or illegal activities
- Protect sensitive information
- Acknowledge uncertainty when unsure
- Prioritize user well-being
`;

const DEFAULT_IDENTITY = `# Identity

I am OpenBot, a self-evolving AI assistant built on the OpenBot framework.

## Personality
- Friendly and approachable
- Technically competent
- Eager to learn and adapt

## Capabilities
- Shell command execution
- File system operations
- Skill-based task execution
- Self-modification and learning
`;

/**
 * Expand ~ to home directory
 */
function expandPath(p: string): string {
  if (p.startsWith("~/")) {
    return path.join(process.env.HOME || "", p.slice(2));
  }
  return p;
}

/**
 * Build the dynamic system prompt from identity files and skills
 */
export async function buildSystemPrompt(baseDir: string): Promise<string> {
  const expandedBase = expandPath(baseDir);
  const parts: string[] = [];

  // Load SOUL.md
  try {
    const soul = await fs.readFile(path.join(expandedBase, "SOUL.md"), "utf-8");
    parts.push(soul.trim());
  } catch {
    // File doesn't exist yet
  }

  // Load IDENTITY.md
  try {
    const identity = await fs.readFile(path.join(expandedBase, "IDENTITY.md"), "utf-8");
    parts.push(identity.trim());
  } catch {
    // File doesn't exist yet
  }

  // Scan skills and build index
  const skillsDir = path.join(expandedBase, "skills");
  const skillsIndex: SkillMeta[] = [];

  try {
    const skillFolders = await fs.readdir(skillsDir);

    for (const folder of skillFolders) {
      if (folder.startsWith("_") || folder.startsWith(".")) continue;

      const skillPath = path.join(skillsDir, folder, "SKILL.md");
      try {
        const content = await fs.readFile(skillPath, "utf-8");
        const { data } = matter(content);
        skillsIndex.push({
          id: folder,
          title: data.title || folder,
          description: data.description || "No description",
          version: data.version,
          tools: data.tools,
          triggers: data.triggers,
        });
      } catch {
        // Skill doesn't have a valid SKILL.md
      }
    }
  } catch {
    // Skills directory doesn't exist yet
  }

  // Add skills section
  if (skillsIndex.length > 0) {
    parts.push(`## Available Skills

You have the following skills available. Use \`loadSkill\` with the skill id to get full instructions before executing.

${skillsIndex.map((s) => `- **${s.title}** (\`${s.id}\`): ${s.description}`).join("\n")}`);
  } else {
    parts.push(`## Skills

You have no skills yet. When you learn reusable patterns, create skills using \`createSkill\` so you can use them again later.`);
  }

  // Add self-modification instructions
  parts.push(`## Self-Modification

You can evolve and improve yourself:
- Use \`updateIdentity\` to refine your personality in IDENTITY.md
- Use \`createSkill\` to save reusable patterns as skills
- Use \`updateSkill\` to improve or expand existing skills with new knowledge
- Use \`appendToMemory\` to remember important facts or journal your learnings
- SOUL.md contains your core values and is protected from modification`);

  return parts.join("\n\n");
}

/**
 * Meta-Agent Plugin for Melony
 * Provides self-modification, skill management, and identity persistence
 */
export const metaAgentPlugin = (options: MetaAgentPluginOptions): MelonyPlugin<any, any> => (builder) => {
  const { baseDir, allowSoulModification = false } = options;
  const expandedBase = expandPath(baseDir);

  const resolvePath = (p: string) => path.join(expandedBase, p);

  // Ensure directory structure exists
  const ensureStructure = async () => {
    await fs.mkdir(resolvePath("skills"), { recursive: true });
    await fs.mkdir(resolvePath("memory"), { recursive: true });

    // Create default files if they don't exist
    const defaults: Record<string, string> = {
      "SOUL.md": DEFAULT_SOUL,
      "IDENTITY.md": DEFAULT_IDENTITY,
      "memory/facts.md": "# Facts\n\nLearned facts about the user and environment:\n",
      "memory/journal.md": "# Journal\n\nSession notes and learnings:\n",
    };

    for (const [file, content] of Object.entries(defaults)) {
      const filePath = resolvePath(file);
      try {
        await fs.access(filePath);
      } catch {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, content, "utf-8");
      }
    }
  };

  // Initialize on the "init" event
  builder.on("init", async function* () {
    await ensureStructure();

    const systemPrompt = await buildSystemPrompt(baseDir);

    yield {
      type: "meta:initialized",
      data: {
        baseDir: expandedBase,
        systemPrompt,
      },
    };
  });

  // Load a skill's full content
  builder.on("action:loadSkill", async function* (event) {
    const { skillId, toolCallId } = event.data;
    const skillPath = resolvePath(`skills/${skillId}/SKILL.md`);

    try {
      const content = await fs.readFile(skillPath, "utf-8");
      const { data, content: body } = matter(content);

      yield {
        type: "action:result",
        data: {
          action: "loadSkill",
          toolCallId,
          result: {
            id: skillId,
            meta: data,
            instructions: body.trim(),
          },
        },
      };
    } catch (error: any) {
      yield {
        type: "action:result",
        data: {
          action: "loadSkill",
          toolCallId,
          result: { error: `Skill "${skillId}" not found` },
        },
      };
    }
  });

  // List all available skills
  builder.on("action:listSkills", async function* (event) {
    const { toolCallId } = event.data;
    const skillsDir = resolvePath("skills");
    const skills: SkillMeta[] = [];

    try {
      const folders = await fs.readdir(skillsDir);

      for (const folder of folders) {
        if (folder.startsWith("_") || folder.startsWith(".")) continue;

        const skillPath = path.join(skillsDir, folder, "SKILL.md");
        try {
          const content = await fs.readFile(skillPath, "utf-8");
          const { data } = matter(content);
          skills.push({
            id: folder,
            title: data.title || folder,
            description: data.description || "No description",
            version: data.version,
            tools: data.tools,
            triggers: data.triggers,
          });
        } catch {
          // Invalid skill, skip
        }
      }
    } catch {
      // Skills directory doesn't exist
    }

    yield {
      type: "action:result",
      data: {
        action: "listSkills",
        toolCallId,
        result: { skills },
      },
    };
  });

  // Create a new skill
  builder.on("action:createSkill", async function* (event) {
    const { id, title, description, content, toolCallId } = event.data;

    // Validate skill id (kebab-case)
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
      yield {
        type: "action:result",
        data: {
          action: "createSkill",
          toolCallId,
          result: { error: "Skill id must be kebab-case (e.g., 'my-skill')" },
        },
      };
      return;
    }

    try {
      const skillDir = resolvePath(`skills/${id}`);
      await fs.mkdir(skillDir, { recursive: true });

      // Build SKILL.md with frontmatter
      const skillContent = `---
title: ${title}
description: ${description}
version: 1.0.0
createdAt: ${new Date().toISOString()}
---

${content}`;

      await fs.writeFile(path.join(skillDir, "SKILL.md"), skillContent, "utf-8");

      yield {
        type: "action:result",
        data: {
          action: "createSkill",
          toolCallId,
          result: {
            success: true,
            path: `skills/${id}/SKILL.md`,
            message: `Skill "${title}" created successfully`,
          },
        },
      };
    } catch (error: any) {
      yield {
        type: "action:result",
        data: {
          action: "createSkill",
          toolCallId,
          result: { error: error.message },
        },
      };
    }
  });

  // Update an existing skill
  builder.on("action:updateSkill", async function* (event) {
    const { id, title, description, content, toolCallId } = event.data;
    const skillDir = resolvePath(`skills/${id}`);
    const skillPath = path.join(skillDir, "SKILL.md");

    try {
      // Check if skill exists
      await fs.access(skillPath);

      // Read existing skill to get metadata if not provided
      const existingContent = await fs.readFile(skillPath, "utf-8");
      const { data: existingData } = matter(existingContent);

      const newTitle = title || existingData.title || id;
      const newDescription = description || existingData.description || "No description";
      
      // Basic versioning: bump patch version
      let version = existingData.version || "1.0.0";
      const parts = version.split(".");
      if (parts.length === 3) {
        parts[2] = (parseInt(parts[2]) + 1).toString();
        version = parts.join(".");
      }

      // Build updated SKILL.md
      const skillContent = `---
title: ${newTitle}
description: ${newDescription}
version: ${version}
updatedAt: ${new Date().toISOString()}
createdAt: ${existingData.createdAt || new Date().toISOString()}
---

${content}`;

      await fs.writeFile(skillPath, skillContent, "utf-8");

      yield {
        type: "action:result",
        data: {
          action: "updateSkill",
          toolCallId,
          result: {
            success: true,
            path: `skills/${id}/SKILL.md`,
            version,
            message: `Skill "${newTitle}" updated to version ${version}`,
          },
        },
      };
    } catch (error: any) {
      yield {
        type: "action:result",
        data: {
          action: "updateSkill",
          toolCallId,
          result: { error: error.code === "ENOENT" ? `Skill "${id}" does not exist` : error.message },
        },
      };
    }
  });

  // Update identity
  builder.on("action:updateIdentity", async function* (event) {
    const { content, toolCallId } = event.data;

    try {
      await fs.writeFile(resolvePath("IDENTITY.md"), content, "utf-8");

      yield {
        type: "action:result",
        data: {
          action: "updateIdentity",
          toolCallId,
          result: {
            success: true,
            message: "Identity updated. Changes will take effect on next initialization.",
          },
        },
      };
    } catch (error: any) {
      yield {
        type: "action:result",
        data: {
          action: "updateIdentity",
          toolCallId,
          result: { error: error.message },
        },
      };
    }
  });

  // Read identity files
  builder.on("action:readIdentity", async function* (event) {
    const { file, toolCallId } = event.data;

    try {
      const content = await fs.readFile(resolvePath(file), "utf-8");

      yield {
        type: "action:result",
        data: {
          action: "readIdentity",
          toolCallId,
          result: { file, content },
        },
      };
    } catch (error: any) {
      yield {
        type: "action:result",
        data: {
          action: "readIdentity",
          toolCallId,
          result: { error: `Could not read ${file}: ${error.message}` },
        },
      };
    }
  });

  // Append to memory
  builder.on("action:appendToMemory", async function* (event) {
    const { category, content, toolCallId } = event.data;
    const memoryFile = resolvePath(`memory/${category}.md`);

    try {
      const timestamp = new Date().toISOString();
      const entry = `\n## ${timestamp}\n${content}\n`;

      await fs.appendFile(memoryFile, entry, "utf-8");

      yield {
        type: "action:result",
        data: {
          action: "appendToMemory",
          toolCallId,
          result: {
            success: true,
            message: `Added to ${category} memory`,
          },
        },
      };
    } catch (error: any) {
      yield {
        type: "action:result",
        data: {
          action: "appendToMemory",
          toolCallId,
          result: { error: error.message },
        },
      };
    }
  });
};

export default metaAgentPlugin;
