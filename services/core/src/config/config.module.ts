import {Module} from "@nestjs/common";

import {ConfigModule} from "@nestjs/config";

//Config
import {AppConfig,} from "./configuration";

//Scheme
import {EnvSchema} from "@App/config/config.scheme";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [AppConfig,],
            validate: (v) => EnvSchema.parse(v),
        }),
    ],
    exports: [ConfigModule]
})
export class AppConfigModule {
}
