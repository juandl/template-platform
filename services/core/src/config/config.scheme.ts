import { z } from "zod";

export const EnvSchema = z.object({
	PORT: z.number().optional().default(3000),
});

type EnvType = z.infer<typeof EnvSchema>;

export type EnvSchemeType = {
	app: {
		port: EnvType["PORT"];
	};
};
