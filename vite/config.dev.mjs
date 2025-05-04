import {defineConfig} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser']
        }
      }
    },
  },
  plugins: [tsconfigPaths()],
  server: {
    port: 8080
  }
});
