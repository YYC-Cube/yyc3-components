import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@yyc3/core': path.resolve(__dirname, '../../packages/core/src'),
      '@yyc3/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@yyc3/hooks': path.resolve(__dirname, '../../packages/hooks/src'),
    },
  },
});
