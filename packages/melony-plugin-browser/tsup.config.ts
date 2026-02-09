import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/ui.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  minify: false,
  sourcemap: true,
});
