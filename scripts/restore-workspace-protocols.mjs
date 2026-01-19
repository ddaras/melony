#!/usr/bin/env node

/**
 * Restores workspace:* protocol after publishing
 * This script runs during postpack to restore workspace:* for development
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync } from "fs";
import { resolve } from "path";

// Get package.json path from current working directory
const pkgJsonPath = resolve(process.cwd(), "package.json");

if (!pkgJsonPath.includes("packages")) {
  process.exit(0);
}

// Restore from backup
const backupPath = pkgJsonPath + ".original";

if (!existsSync(backupPath)) {
  console.log("No backup found, skipping restoration");
  process.exit(0);
}

try {
  const originalPkgJson = readFileSync(backupPath, "utf-8");
  writeFileSync(pkgJsonPath, originalPkgJson);
  unlinkSync(backupPath);
  console.log(`Restored workspace:* protocols in ${pkgJsonPath}`);
} catch (e) {
  console.error("Error restoring package.json:", e.message);
  process.exit(1);
}
