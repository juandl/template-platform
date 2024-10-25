import { createRequestHandler } from "@remix-run/express";
import { createProxyMiddleware } from "http-proxy-middleware";

import express from "express";
import compression from "compression";
import morgan from "morgan";

import { ENV } from "./env.js";

//Env
const iDev = ENV.NODE_ENV !== "production";
const port = ENV.PORT || 3000;

const handlers = {
	dev: null,
	remix: null,
};

//Create vite dev
if (iDev) {
	try {
		handlers.dev = await import("vite").then((vite) =>
			vite.createServer({
				server: { middlewareMode: true },
			}),
		);
	} catch (error) {
		console.error("Failed to create Vite dev server:", error);
		process.exit(1);
	}
}

const app = express();

//Compress requests
app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle vite dev middleware requests
if (handlers.dev) {
	app.use(handlers.dev.middlewares);
}

app.use(express.static("assets", {}));

// Logging middleware
app.use(morgan("tiny"));

/**
 * Create proxy - API core
 */
app.use(
	"/api/",
	createProxyMiddleware({
		target: ENV.VITE_SERVICE_CORE_URL,
		changeOrigin: true,
		logger: console,
		logLevel: "debug",
		pathRewrite: { "^": "api" },
	}),
);

/**
 * Create server
 */
const server = async () => {
	try {
		//If env is "dev" create vite remix server
		if (handlers.dev) {
			handlers.remix = {
				build: () => handlers.dev.ssrLoadModule("virtual:remix/server-build"),
			};
		} else {
			//Import build
			handlers.remix = { build: await import(path.join(process.cwd(), "build/server/index.js")) };
		}

		app.all("*", createRequestHandler(handlers.remix));

		app.listen(port, () => {
			console.log(`Server listening at http://localhost:${port}`);
		});
	} catch (error) {
		console.error("Error starting server:", error);
		process.exit(1);
	}
};

server().catch((error) => {
	console.error(error);
	process.exit(1);
});
