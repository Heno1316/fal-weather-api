import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class WeatherService {
    @Inject(HttpService)
    private _httpService: HttpService;
    @Inject(ConfigService)
    private _configService: ConfigService;

    byLocationName(q: string): Observable<AxiosResponse<any>> {
        return this._httpService
            .get('https://api.openweathermap.org/data/2.5/forecast', {
                params: {
                    q,
                    appid: this._configService.get<string>('weatherApiKey'),
                },
            })
            .pipe(map(({ data }) => data));
    }
}
