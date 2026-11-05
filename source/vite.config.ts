import vinext from "vinext";
import { defineConfig } from "vite";
import { releaseModuleAudit } from './scripts/release-module-audit.mjs';

export default defineConfig(({ command }) => ({
  // Release assets are selected from the emitted application by build-production.
  // Development continues serving the complete original public directory.
  publicDir: 'public',
  build: { copyPublicDir: command !== 'build' },
  resolve: { dedupe: ["react", "react-dom", "three"] },
  plugins: [vinext(), releaseModuleAudit()],
}));
