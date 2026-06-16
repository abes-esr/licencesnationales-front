// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { fileURLToPath, URL } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    visualizer({
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true,
      open: false
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/@fortawesome")) {
            return "fontawesome";
          }
          if (id.includes("node_modules/vue-i18n")) {
            return "i18n";
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    watch: {
      usePolling: true,
      interval: 1000
    },
    port: 8080,
    host: "0.0.0.0"
  },
  hmr: {
    host: "localhost", // <-- important
    port: 8080,
    protocol: "ws" // ou "wss" si HTTPS
  }
});
