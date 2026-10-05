import vinext from "vinext";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: { dedupe: ["react", "react-dom", "three"] },
  plugins: [vinext()],
});
