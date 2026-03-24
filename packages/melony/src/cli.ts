#!/usr/bin/env node
import "dotenv/config";
import { Command } from "commander";

const program = new Command();

program
  .name("melony")
  .description("Melony CLI - Fast, minimalist AI agent framework")
  .version("0.0.0");

// Default to chat if no command is provided
if (!process.argv.slice(2).length) {
  process.argv.push("chat");
}

program.parse();
