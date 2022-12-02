import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseAsyncConfig } from './configs';
import { HealthModule } from './modules/health/health.module';
import { CityModule } from './modules/city/city.module';
import { WeatherModule } from './modules/weather/weather.module';
import environment from './environments/environment';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [environment],
            isGlobal: true,
        }),
        MongooseModule.forRootAsync(mongooseAsyncConfig),
        HealthModule,
        CityModule,
        WeatherModule,
    ],
})
export class AppModule {}
