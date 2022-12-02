import { ConfigModule, ConfigService } from '@nestjs/config';
import {
    MongooseModuleAsyncOptions,
    MongooseModuleOptions,
} from '@nestjs/mongoose';

export const mongooseAsyncConfig: MongooseModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (
        configService: ConfigService,
    ): Promise<MongooseModuleOptions> => {
        return {
            uri: configService.get<string>('database.uri'),
        };
    },
};
