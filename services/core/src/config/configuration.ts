import { registerAs } from "@nestjs/config";

import { EnvSchemeType } from "./config.scheme";

/**
 * Common app config
 */
export const AppConfig = registerAs<EnvSchemeType["app"]>("app", () => ({
	port: Number.parseInt(process.env.PORT || "4000"),
}));
