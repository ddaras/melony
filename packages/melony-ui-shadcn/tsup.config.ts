import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/style.css"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2022",
  splitting: true,
  treeshake: true,
  skipNodeModulesBundle: true,
  external: ["react", "react-dom", "@melony/react", "@melony/ui-kit", "melony"],
});
