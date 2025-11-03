import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import { fileURLToPath } from "node:url";

const resolveSrc = (path) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

export default defineConfig({
  plugins: [glsl({ query: '?url', import: 'default' })],
  optimizeDeps: {
    include: ["tweakpane"],
  },
  resolve: {
    alias: {
      "@": resolveSrc(""),
      // Core
      "@core": resolveSrc("core"),
      "@components": resolveSrc("core/components"),
      "@managers": resolveSrc("core/managers"),
      "@generators": resolveSrc("core/generators"),
      "@scenes": resolveSrc("core/scenes"),
      "@utils": resolveSrc("core/utils"),
      // Components sub-directories
      "@encoders": resolveSrc("core/components/encoders"),
      "@environments": resolveSrc("core/components/environments"),
      "@geometries": resolveSrc("core/components/geometries"),
      "@lights": resolveSrc("core/components/lights"),
      "@loaders": resolveSrc("core/components/loaders"),
      "@materials": resolveSrc("core/components/materials"),
      "@cameras": resolveSrc("core/components/cameras"),

      // Assets
      "@assets": resolveSrc("assets"),
      "@models": resolveSrc("assets/models"),
      "@textures": resolveSrc("assets/textures"),
      "@environmentMaps": resolveSrc("assets/environmentMaps"),
      "@panoramas": resolveSrc("assets/panoramas"),

      // Other directories
      "@effects": resolveSrc("effects"),
      "@monitoring": resolveSrc("monitoring"),
      "@postprocessing": resolveSrc("postprocessing"),
      "@shaders": resolveSrc("shaders"),
      "@controls": resolveSrc("controls"),
      "@config": resolveSrc("config"),
      "@presets": resolveSrc("presets"),
      "@renderers": resolveSrc("core/renderers"),
      "@tests": resolveSrc("tests"),
    },
  },
  server: {
    open: true,
    hmr: {
      overlay: false, // Disable error overlay if needed
      port: 3000,
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
  },
});
