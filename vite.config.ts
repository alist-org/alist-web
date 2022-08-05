import path from "path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
      "@solidjs/router": path.resolve(__dirname, "solid-router/src"),
    },
  },
  plugins: [solidPlugin()],
  build: {
    target: "esnext",
    // polyfillDynamicImport: false,
  },
});
