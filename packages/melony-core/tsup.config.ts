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
    outExtension({ format }) {
      return {
        js: format === "esm" ? ".js" : ".cjs",
      };
    },
  },
  // Zod schema utilities build (includes Zod dependency, safe for server-side)
  {
    entry: ["src/zod-schema-utils.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    target: "es2020",
    splitting: false,
    treeshake: true,
    skipNodeModulesBundle: true,
    external: ["zod"],
    outExtension({ format }) {
      return {
        js: format === "esm" ? ".js" : ".cjs",
      };
    },
  },
]);
