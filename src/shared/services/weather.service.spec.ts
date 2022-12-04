import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { WeatherService } from './weather.service';
import { AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';
import { find } from 'lodash';

const { readFileSync } = require('fs');
const weathers = JSON.parse(readFileSync('test/mocks/weather.json'));
const city = find(weathers, (weather) => weather['London']);
const mockedWeather = city['London'];

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
