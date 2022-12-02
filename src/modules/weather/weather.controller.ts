import {
    Controller,
    Get,
    Inject,
    NotFoundException,
    Param,
} from '@nestjs/common';
import { WeatherService } from 'src/shared/services/weather.service';
import { lastValueFrom } from 'rxjs';
import WeatherUtils from 'src/utils/weather.util';
import { CityService } from '../city/city.service';
import { CityParam } from './weather.dto';

@Controller('weather')
export class WeatherController {
    @Inject(CityService)
    private _cityService: CityService;
    @Inject(WeatherService)
    private _weatherService: WeatherService;

    @Get('cities')
    async allCities() {
        try {
            const cities = await this._cityService.findAll();
            if (cities.length === 0) {
                throw new NotFoundException('Cities not found!');
            }
            const response = [];
            for (const data of cities) {
                const { name, state, country } = data;
                try {
                    const location: string = WeatherUtils.getLocationName({
                        name,
                        state,
                        country,
                    });
                    const request = await this._weatherService.byLocationName(
                        location,
                    );
                    const { list }: any = await lastValueFrom(request);
                    response.push({ [name]: { list } });
                } catch (error) {
                    response.push({ [name]: { list: null } });
                }
            }

            return { status: true, response };
        } catch (error) {
            return {
                status: false,
                error: error.message ?? 'Something went wrong!',
            };
        }
    }

    @Get('city/:name')
    async city(@Param() param: CityParam) {
        try {
            const data = await this._cityService.findByName(param.name);
            if (!data) {
                throw new NotFoundException('City not found!');
            }
            const { name, state, country } = data;
            const location: string = WeatherUtils.getLocationName({
                name,
                state,
                country,
            });
            const request = await this._weatherService.byLocationName(location);
            const { list, city }: any = await lastValueFrom(request);

            return { status: true, response: { city, list } };
        } catch (error) {
            return {
                status: false,
                error: error.message ?? 'Something went wrong!',
            };
        }
    }
}
