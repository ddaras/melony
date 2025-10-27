import { defineConfig } from "tsup";

export default defineConfig([
  // Main library build (without "use client")
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    target: "es2020",
    splitting: false,
    treeshake: true,
    skipNodeModulesBundle: true,
    external: ["react", "react-dom"],
    esbuildOptions(options) {
      options.jsx = "automatic";
    },
    outExtension({ format }) {
      return {
        js: format === "esm" ? ".js" : ".cjs",
      };
    },
  },
  // Server utilities build (system prompt and other server-side utilities)
  {
    entry: ["src/server.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    target: "es2020",
    splitting: false,
    treeshake: true,
    skipNodeModulesBundle: true,
    outExtension({ format }) {
      return {
        js: format === "esm" ? ".js" : ".cjs",
      };
    },
  },
  // Builder API build (type-safe widget building)
  {
    entry: ["src/builder-entry.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    target: "es2020",
    splitting: false,
    treeshake: true,
    skipNodeModulesBundle: true,
    external: ["react", "react-dom", "zod"],
    outExtension({ format }) {
      return {
        js: format === "esm" ? ".js" : ".cjs",
      };
    },
    outDir: "dist",
    esbuildOptions(options) {
      options.outbase = "./src";
    },
  },
]);
