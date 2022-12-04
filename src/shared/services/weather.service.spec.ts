import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { WeatherService } from './weather.service';
import { AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';

const mockedWeather = {
    list: [
        {
            dt: 1670058000,
            main: {
                temp: 286.04,
                feels_like: 285.42,
                temp_min: 285.93,
                temp_max: 286.04,
                pressure: 1021,
                sea_level: 1021,
                grnd_level: 976,
                humidity: 78,
                temp_kf: 0.11,
            },
            weather: [
                {
                    id: 500,
                    main: 'Rain',
                    description: 'light rain',
                    icon: '10n',
                },
            ],
            clouds: {
                all: 100,
            },
            wind: {
                speed: 7.44,
                deg: 208,
                gust: 19.51,
            },
            visibility: 10000,
            pop: 0.91,
            rain: {
                '3h': 1.53,
            },
            sys: {
                pod: 'n',
            },
            dt_txt: '2022-12-03 09:00:00',
        },
    ],
    city: {
        id: 4298960,
        name: 'London',
        coord: {
            lat: 37.129,
            lon: -84.0833,
        },
        country: 'US',
    },
};

describe('WeatherService', () => {
    let weatherService: WeatherService;
    let httpService: HttpService;
    let configService: ConfigService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                WeatherService,
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        weatherService = app.get<WeatherService>(WeatherService);
        httpService = app.get<HttpService>(HttpService);
        configService = app.get<ConfigService>(ConfigService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Invoke byLocationName', () => {
        it('should return weather details for given location', (done) => {
            let data = {};
            const response: AxiosResponse<any> = {
                data: mockedWeather,
                headers: {},
                config: { url: 'http://localhost:3000/mockUrl' },
                status: 200,
                statusText: 'OK',
            };
            jest.spyOn(httpService, 'get').mockReturnValue(
                of({
                    data: mockedWeather,
                    headers: {},
                    config: { url: 'http://localhost:3000/mockUrl' },
                    status: 200,
                    statusText: 'OK',
                } as any),
            );
            jest.spyOn(configService, 'get').mockReturnValue('weatherApiKey');

            weatherService.byLocationName('London,ky,us').subscribe({
                next: (val) => {
                    data = val;
                },
                error: (error) => {
                    throw error;
                },
                complete: () => {
                    expect(data).toEqual(response.data);
                    done();
                },
            });
        });

        it('should return null for invalid location', (done) => {
            let data = {};
            const response: AxiosResponse<any> = {
                data: null,
                headers: {},
                config: { url: 'http://localhost:3000/mockUrl' },
                status: 200,
                statusText: 'OK',
            };
            jest.spyOn(httpService, 'get').mockReturnValue(
                of({
                    data: null,
                    headers: {},
                    config: { url: 'http://localhost:3000/mockUrl' },
                    status: 200,
                    statusText: 'OK',
                } as any),
            );
            jest.spyOn(configService, 'get').mockReturnValue('weatherApiKey');

            weatherService.byLocationName(null).subscribe({
                next: (val) => {
                    data = val;
                },
                error: (error) => {
                    throw error;
                },
                complete: () => {
                    expect(data).toEqual(response.data);
                    done();
                },
            });
        });

        it('should throw error for invalid request', (done) => {
            let data = {};
            const response: AxiosResponse<any> = {
                data: null,
                headers: {},
                config: { url: 'http://localhost:3000/mockUrl' },
                status: 500,
                statusText: 'OK',
            };
            jest.spyOn(httpService, 'get').mockReturnValue(
                throwError('Invalid request'),
            );
            jest.spyOn(configService, 'get').mockReturnValue('weatherApiKey');

            weatherService.byLocationName(null).subscribe({
                next: (val) => {
                    data = val;
                },
                error: (error) => {
                    expect(error).toBe('Invalid request');
                    done();
                },
                complete: () => {
                    expect(data).toBeUndefined();
                    done();
                },
            });
        });
    });
});
