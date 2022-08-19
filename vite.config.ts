import path from "path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
      "@solidjs/router": path.resolve(__dirname, "solid-router/src"),
    },
  },
  plugins: [
    solidPlugin(),
    legacy({
      targets: ["defaults"],
    }),
  ],
  build: {
    target: "esnext",
    // polyfillDynamicImport: false,
  },
});
