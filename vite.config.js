import { defineConfig } from 'vite';

// Set to '/repository-name/' before Pages evaluation. No server-dependent routes.
const base = '/bab-example-uploads/';
export default defineConfig(({ mode }) => ({
  root: mode === 'test' ? '.' : 'app',
  base: mode === 'test' ? '/' : base,
  server: { host: '127.0.0.1', strictPort: true },
  preview: { host: '127.0.0.1', strictPort: true },
  build: { outDir: '../dist', emptyOutDir: true },
}));
