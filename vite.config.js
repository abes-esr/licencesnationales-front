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
  optimizeDeps: {
    // Exclure vue-i18n de la pré-optimisation en dev pour éviter l'erreur de référence
    // sur init_runtime_dom_esm_bundler provoquée par l'optimiseur de dépendances de Vite 8.
    exclude: ["vue-i18n"]
  },
  build: {
    // Configuration spécifique à Vite 8 (qui utilise le bundler Rolldown) pour le découpage de code.
    // Remplace l'ancien "rollupOptions.manualChunks" déprécié qui causait des erreurs de référence
    // sur les chunks externes (ex: "init_runtime_dom_esm_bundler is not defined").
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "fontawesome",
              test: /node_modules[\\/]@fortawesome/
            },
            {
              name: "i18n",
              test: /node_modules[\\/]vue-i18n/
            }
          ]
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
