import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  cpSync,
  readdirSync,
  statSync,
} from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import chalk from "chalk";
import prompts from "prompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEMPLATES_DIR = resolve(__dirname, "../templates");

async function main() {
  console.log(chalk.blue.bold("\n✨ Welcome to Melony!\n"));

  const response = await prompts([
    {
      type: "text",
      name: "projectName",
      message: "What is your project named?",
      initial: "my-melony-app",
      validate: (value: string) => {
        if (!value || value.trim().length === 0) {
          return "Project name cannot be empty";
        }
        if (!/^[a-z0-9-]+$/.test(value)) {
          return "Project name can only contain lowercase letters, numbers, and hyphens";
        }
        return true;
      },
    },
    {
      type: "select",
      name: "template",
      message: "Which template would you like to use?",
      choices: [
        { title: "Next.js (App Router)", value: "nextjs" },
        { title: "Vite + React", value: "vite" },
        { title: "Hono (Backend only)", value: "hono" },
      ],
      initial: 0,
    },
    {
      type: "select",
      name: "packageManager",
      message: "Which package manager would you like to use?",
      choices: [
        { title: "pnpm", value: "pnpm" },
        { title: "npm", value: "npm" },
        { title: "yarn", value: "yarn" },
      ],
      initial: 0,
    },
  ]);

  if (!response.projectName || !response.template) {
    console.log(chalk.red("\n❌ Cancelled."));
    process.exit(1);
  }

  const projectName = response.projectName.trim();
  const template = response.template;
  const packageManager = response.packageManager || "pnpm";

  const projectPath = resolve(process.cwd(), projectName);

  if (existsSync(projectPath)) {
    console.log(chalk.red(`\n❌ Directory ${projectName} already exists.`));
    process.exit(1);
  }

  console.log(
    chalk.blue(`\n📦 Creating ${projectName} with ${template} template...\n`)
  );

  try {
    // Create project directory
    mkdirSync(projectPath, { recursive: true });

    // Copy template files
    const templatePath = join(TEMPLATES_DIR, template);
    if (!existsSync(templatePath)) {
      console.log(chalk.red(`\n❌ Template ${template} not found.`));
      process.exit(1);
    }

    cpSync(templatePath, projectPath, { recursive: true });

    // Replace template variables in files
    const replaceInFile = (filePath: string) => {
      if (!existsSync(filePath)) return;

      try {
        const content = readFileSync(filePath, "utf-8");
        const updated = content.replace(/\{\{PROJECT_NAME\}\}/g, projectName);
        if (content !== updated) {
          writeFileSync(filePath, updated, "utf-8");
        }
      } catch (error) {
        // Skip binary files or files that can't be read
      }
    };

    // Recursively replace in all files
    const replaceInDirectory = (dir: string) => {
      const entries = readdirSync(dir);

      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          // Skip node_modules and other common directories
          if (!entry.startsWith(".") && entry !== "node_modules") {
            replaceInDirectory(fullPath);
          }
        } else if (stat.isFile()) {
          // Only process text files
          if (
            !entry.endsWith(".png") &&
            !entry.endsWith(".jpg") &&
            !entry.endsWith(".jpeg") &&
            !entry.endsWith(".gif") &&
            !entry.endsWith(".svg") &&
            !entry.endsWith(".ico") &&
            !entry.endsWith(".woff") &&
            !entry.endsWith(".woff2") &&
            !entry.endsWith(".ttf")
          ) {
            replaceInFile(fullPath);
          }
        }
      }
    };

    replaceInDirectory(projectPath);

    console.log(chalk.green("✓ Project files created\n"));

    // Install dependencies
    console.log(
      chalk.blue(`📥 Installing dependencies with ${packageManager}...\n`)
    );

    const installCmd =
      packageManager === "pnpm"
        ? "pnpm install"
        : packageManager === "yarn"
          ? "yarn install"
          : "npm install";

    execSync(installCmd, {
      cwd: projectPath,
      stdio: "inherit",
    });

    console.log(chalk.green("\n✓ Dependencies installed\n"));

    // Success message
    console.log(chalk.green.bold("🎉 Success! Your Melony app is ready.\n"));
    console.log(chalk.cyan("Next steps:\n"));
    console.log(chalk.white(`  cd ${projectName}`));

    if (template === "nextjs") {
      console.log(
        chalk.white(
          `  ${packageManager === "pnpm" ? "pnpm" : packageManager === "yarn" ? "yarn" : "npm"} dev`
        )
      );
    } else if (template === "vite") {
      console.log(
        chalk.white(
          `  ${packageManager === "pnpm" ? "pnpm" : packageManager === "yarn" ? "yarn" : "npm"} dev`
        )
      );
    } else if (template === "hono") {
      console.log(
        chalk.white(
          `  ${packageManager === "pnpm" ? "pnpm" : packageManager === "yarn" ? "yarn" : "npm"} dev`
        )
      );
    }

    console.log(
      chalk.cyan("\n📚 Learn more: https://github.com/yourusername/melony\n")
    );
  } catch (error: any) {
    console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(chalk.red(`\n❌ Unexpected error: ${error.message}\n`));
  process.exit(1);
});
