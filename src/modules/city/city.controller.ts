import { Controller, Post, Body, Inject } from '@nestjs/common';
import { WeatherService } from 'src/shared/services/weather.service';
import { CityService } from './city.service';
import { CreateCity } from './city.dto';
import { lastValueFrom } from 'rxjs';
import WeatherUtils from 'src/utils/weather.util';

@Controller('city')
export class CityController {
    @Inject(WeatherService)
    private _weatherService: WeatherService;
    @Inject(CityService)
    private _cityService: CityService;

    @Post('add')
    async add(@Body() body: CreateCity) {
        try {
            const location: string = WeatherUtils.getLocationName(body);
            const request = await this._weatherService.byLocationName(location);
            const { list, city }: any = await lastValueFrom(request);
            const { id, name, country, coord } = city;
            await this._cityService.findByIdAndUpdate(id, {
                id,
                name,
                state: body.state ?? null,
                country,
                latitude: coord.lat,
                longitude: coord.lon,
            });

            return { status: true, response: { city, list } };
        } catch (error) {
            return {
                status: false,
                error: error.message ?? 'Something went wrong!',
            };
        }
    }
}
