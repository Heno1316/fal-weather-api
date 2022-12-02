import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { CityModule } from '../city/city.module';
import { WeatherController } from './weather.controller';

@Module({
    imports: [SharedModule, CityModule],
    controllers: [WeatherController],
})
export class WeatherModule {}
