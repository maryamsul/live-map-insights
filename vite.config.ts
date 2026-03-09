import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

import { cloudflare } from "@cloudflare/vite-plugin";

// Always export a proper plugins array
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), componentTagger(), cloudflare()], // <-- static array, no conditionals
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});