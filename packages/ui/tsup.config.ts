import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/utils.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  minify: false,
  target: 'es2022',
  esbuildOptions(options) {
    options.banner = {
      js: `/**
 * @yyc3/ui v1.0.0
 * YYC3 UI Component Library
 * Built from AI Family Project
 * https://github.com/YYC-Cube/yyc3-reusable-components
 */`,
    };
  },
});
