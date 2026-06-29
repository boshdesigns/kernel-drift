import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  base: "/kernel-drift/",
  root: "src",
  build: {
    outDir: "../dist",
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [{ src: "assets/models/*", dest: "assets/models" }],
    }),
  ],
});
