import "reflect-metadata";

import {NestFactory} from "@nestjs/core";
import {VersioningType} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

/**
 * App Module
 */
import {CoreAppModule} from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(CoreAppModule);

    // Starts listening for shutdown hooks
    app.enableShutdownHooks();

    // Set a global prefix for all routes
    app.setGlobalPrefix("api");

    //Set version
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: "1",
    });

    /**
     * Import configuration
     */
    const configService = app.get(ConfigService);

    /**
     * Enable Global validation for endpoints
     */
    app.useGlobalPipes();

    await app.listen(configService.get<number>("app.port"));
}

bootstrap();
