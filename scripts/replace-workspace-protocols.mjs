#!/usr/bin/env node

/**
 * Replaces workspace:* protocol with actual version numbers from workspace packages
 * This script runs during prepack to ensure published packages have real versions
 */

import { readFileSync, writeFileSync, copyFileSync, existsSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// Get package.json path from current working directory
const pkgJsonPath = resolve(process.cwd(), 'package.json');

if (!pkgJsonPath.includes('packages')) {
  console.log('Not a package directory, skipping workspace protocol replacement');
  process.exit(0);
}

// Backup original package.json before modifying
const backupPath = pkgJsonPath + '.original';
if (!existsSync(backupPath)) {
  copyFileSync(pkgJsonPath, backupPath);
}

// Find all package.json files in packages directory
const packagesDir = join(rootDir, 'packages');
const packageDirs = readdirSync(packagesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

// Read all package versions into a map
const packageVersions = new Map();
for (const pkgDir of packageDirs) {
  const pkgPath = join(packagesDir, pkgDir, 'package.json');
  try {
    const pkgContent = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    packageVersions.set(pkgContent.name, pkgContent.version);
  } catch (e) {
    // Skip if package.json doesn't exist or is invalid
  }
}

// Read the target package.json
const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
let modified = false;

// Replace workspace:* in dependencies
if (pkgJson.dependencies) {
  for (const [depName, depVersion] of Object.entries(pkgJson.dependencies)) {
    if (depVersion === 'workspace:*' && packageVersions.has(depName)) {
      pkgJson.dependencies[depName] = `^${packageVersions.get(depName)}`;
      modified = true;
      console.log(`Replaced ${depName}: workspace:* with ^${packageVersions.get(depName)}`);
    }
  }
}

// Replace workspace:* in devDependencies (less common but possible)
if (pkgJson.devDependencies) {
  for (const [depName, depVersion] of Object.entries(pkgJson.devDependencies)) {
    if (depVersion === 'workspace:*' && packageVersions.has(depName)) {
      pkgJson.devDependencies[depName] = `^${packageVersions.get(depName)}`;
      modified = true;
      console.log(`Replaced ${depName}: workspace:* with ^${packageVersions.get(depName)}`);
    }
  }
}

// Replace workspace:* in peerDependencies (less common but possible)
if (pkgJson.peerDependencies) {
  for (const [depName, depVersion] of Object.entries(pkgJson.peerDependencies)) {
    if (depVersion === 'workspace:*' && packageVersions.has(depName)) {
      pkgJson.peerDependencies[depName] = `^${packageVersions.get(depName)}`;
      modified = true;
      console.log(`Replaced ${depName}: workspace:* with ^${packageVersions.get(depName)}`);
    }
  }
}

// Write back if modified
if (modified) {
  writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');
  console.log(`Updated ${pkgJsonPath} for publishing`);
} else {
  console.log('No workspace:* protocols found to replace');
}

