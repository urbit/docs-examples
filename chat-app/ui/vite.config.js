import { loadEnv, defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import svgrPlugin from "vite-plugin-svgr";
import { urbitPlugin } from "@urbit/vite-plugin-urbit";
import fs from "fs/promises";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd()));
  const SHIP_URL =
    process.env.SHIP_URL || process.env.VITE_SHIP_URL || "http://localhost:80";

  return {
    esbuild: {
      loader: "jsx",
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
    plugins: [
      svgrPlugin({
        svgrOptions: {
          icon: true,
          // ...svgr options (https://react-svgr.com/docs/options/)
        },
      }),
      urbitPlugin({ base: "hut", target: SHIP_URL, secure: false }),
      reactRefresh(),
    ],
  };
});
