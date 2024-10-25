import { vitePlugin as remix } from "@remix-run/dev";

import { defineConfig, type UserConfig, loadEnv, mergeConfig } from "vite";

import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

import "dotenv/config";
import * as process from "node:process";

//Routes
import { AppRouters } from "./routes";

export default defineConfig((config) => {
	//Load envs
	const ENVS = { ...process.env, ...loadEnv(config.mode, process.cwd()) };

	const CONFIG: UserConfig = {
		plugins: [
			remix({
				future: {
					v3_fetcherPersist: true,
					v3_relativeSplatPath: true,
					v3_throwAbortReason: true,
				},
				routes: AppRouters,
			}),
			svgr({ include: "**/*.svg" }),
			tsconfigPaths(),
		],
		build: {
			// sourcemap: true,
			rollupOptions: {
				external: [], // Ensure no externals are specified
			},
		},
		ssr: {},
		server: {
			proxy: {
				// Proxy service
				"/proxy/service/core": {
					target: ENVS.VITE_SERVICE_CORE_URL,
					changeOrigin: true, // Needed for virtual-hosted sites
					rewrite: (path) => path.replace(/^\/proxy\/service\/core/, "/api"),
				},
			},
		},
	};

	//Required to work as "production build"
	if (ENVS.VITE_BUILD_SERVER === "true") {
		console.log("SSR Build Enabled..");

		if (CONFIG.ssr) {
			CONFIG.ssr.noExternal = true;
		}
	}

	return mergeConfig(config, CONFIG);
});
