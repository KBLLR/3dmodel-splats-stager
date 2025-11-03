import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [glsl()],
  optimizeDeps: {
    include: ["tweakpane"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      // Core
      "@core": resolve(__dirname, "./src/core"),
      "@components": resolve(__dirname, "./src/core/components"),
      "@managers": resolve(__dirname, "./src/core/managers"),
      "@generators": resolve(__dirname, "./src/core/generators"),
      "@scenes": resolve(__dirname, "./src/core/scenes"),
      "@utils": resolve(__dirname, "./src/utils"),
      "@gui": resolve(__dirname, "./src/gui"),

      // Components sub-directories
      "@encoders": resolve(__dirname, "./src/core/components/encoders"),
      "@environments": resolve(__dirname, "./src/core/components/environments"),
      "@controls": resolve(__dirname, "./src/core/controls"),
      "@geometries": resolve(__dirname, "./src/core/components/geometries"),
      "@lights": resolve(__dirname, "./src/core/components/lights"),
      "@loaders": resolve(__dirname, "./src/core/components/loaders"),
      "@materials": resolve(__dirname, "./src/core/components/materials"),
      "@cameras": resolve(__dirname, "./src/core/cameras"),

      // Assets
      "@assets": resolve(__dirname, "./src/assets"),
      "@models": resolve(__dirname, "./src/assets/models"),
      "@textures": resolve(__dirname, "./src/assets/textures"),
      "@environmentMaps": resolve(__dirname, "./src/assets/environmentMaps"),
      "@panoramas": resolve(__dirname, "./src/assets/panoramas"),

      // Other directories
      "@effects": resolve(__dirname, "./src/core/effects"),
      "@monitoring": resolve(__dirname, "./src/monitoring"),
      "@postprocessing": resolve(__dirname, "./src/core/postprocessing"),
      "@shaders": resolve(__dirname, "./src/shaders"),
      "@config": resolve(__dirname, "./src/config"),
      "@presets": resolve(__dirname, "./src/presets"),
      "@renderers": resolve(__dirname, "./src/core/renderers"),
      "@tests": resolve(__dirname, "./src/tests"),
    },
    hmr: {
      overlay: false, // Disable error overlay if needed
      port: 5174,
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: true,
    },
  },
});
