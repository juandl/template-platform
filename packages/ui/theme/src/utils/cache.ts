import createCache, { type EmotionCache, type Options } from "@emotion/cache";

//Create cache
export const createThemeCache = (params: { prefix?: string } = {}): EmotionCache => {
	const options: Options = {
		key: "theevents",
		stylisPlugins: [],
	};

	if (params.prefix) {
		options.key += `-${params.prefix}`;
	}

	return createCache(options);
};
