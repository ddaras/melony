import { defineConfig } from 'tsup';

export default defineConfig([
  // Main library build (without "use client")
  {
    entry: ['index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    target: 'es2020',
    splitting: false,
    treeshake: true,
    skipNodeModulesBundle: true,
    external: ['react', 'react-dom'],
    outExtension({ format }) {
      return {
        js: format === 'esm' ? '.js' : '.cjs',
      }
    },
  },
  // React client components build (with "use client")
  {
    entry: ['react.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: false, // Don't clean to preserve main build
    target: 'es2020',
    splitting: false,
    treeshake: false, // Disable treeshaking to preserve "use client"
    skipNodeModulesBundle: true,
    external: ['react', 'react-dom'],
    outExtension({ format }) {
      return {
        js: format === 'esm' ? '.js' : '.cjs',
      }
    },
  },
]);
