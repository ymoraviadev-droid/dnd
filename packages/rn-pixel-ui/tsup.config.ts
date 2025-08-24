import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  sourcemap: true,
  clean: true,
  target: "es2022",
  platform: "neutral",
  treeshake: true,

  // ✅ Do not bundle / parse RN deps — the app provides them
  external: [
    "react",
    "react-dom",
    "react-native",
    "@expo/vector-icons",
    "react-native-select-dropdown"
  ],

  // ✅ Generate .d.ts without resolving dep typings (prevents walking into RN's nested @types/react)
  dts: {
    resolve: false  // <-- the key fix
  },

  // Safety net: some deps publish JSX in .js files
  esbuildOptions(options) {
    options.jsx = "automatic";
    options.loader = { ...options.loader, ".js": "jsx" };
  }
});
