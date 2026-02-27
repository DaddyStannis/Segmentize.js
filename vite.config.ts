import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dts from "vite-plugin-dts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        react: resolve(__dirname, "src/react.tsx"),
      },
      formats: ["es", "cjs"],
      name: "Segment Board",
      fileName: (format, entryName) => {
        const extension = format === "es" ? "js" : "cjs";
        return `${entryName}.${extension}`;
      },
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  plugins: [dts({ rollupTypes: true, insertTypesEntry: true })],
});
