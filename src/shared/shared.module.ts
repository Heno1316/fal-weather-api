import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherService } from './services/weather.service';

@Global()
@Module({
    imports: [HttpModule],
    providers: [WeatherService],
    exports: [WeatherService],
})
export class SharedModule {}
