import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from 'src/shared/services/weather.service';
import { CityService } from '../city/city.service';
import { of, throwError } from 'rxjs';
import { find, split } from 'lodash';

const { readFileSync } = require('fs');
const mockCities = [
    {
        _id: 'ObjectIdLondon',
        id: 2643743,
        name: 'London',
        state: 'ky',
        country: 'us',
        latitude: 37.129,
        longitude: -84.0833,
    },
    {
        _id: 'ObjectIdDubai',
        id: 292223,
        name: 'Dubai',
        state: null,
        country: 'ue',
        latitude: 25.2582,
        longitude: 55.3047,
    },
    {
        _id: 'ObjectIdStockholm',
        id: 2673730,
        name: 'Stockholm',
        state: null,
        country: null,
        latitude: 59.3326,
        longitude: 18.0649,
    },
];

describe('WeatherController', () => {
    let weatherController: WeatherController;
    let weatherService: WeatherService;
    let cityService: CityService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [WeatherController],
            providers: [
                {
                    provide: WeatherService,
                    useValue: {
                        byLocationName: jest.fn(),
                    },
                },
                {
                    provide: CityService,
                    useValue: {
                        findByName: jest
                            .fn()
                            .mockImplementation((name: string) =>
                                Promise.resolve(find(mockCities, { name })),
                            ),
                        findAll: jest
                            .fn()
                            .mockImplementation(() =>
                                Promise.resolve(mockCities),
                            ),
                    },
                },
            ],
        }).compile();

        weatherController = app.get<WeatherController>(WeatherController);
        weatherService = app.get<WeatherService>(WeatherService);
        cityService = app.get<CityService>(CityService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET request to weather/cities', () => {
        it('should return weather details for all the cities', async () => {
            const weathers = JSON.parse(
                readFileSync('test/mocks/weather.json'),
            );
            jest.spyOn(weatherService, 'byLocationName').mockImplementation(
                (name: string) => {
                    const city = split(name, ',', 1)[0];
                    const data = find(weathers, (weather) => weather[city]);
                    return of(data[city]);
                },
            );
            const response = await weatherController.allCities();
            expect(response).toStrictEqual({
                status: true,
                response: weathers,
            });
        });

        it('should return cities not found', async () => {
            jest.spyOn(cityService, 'findAll').mockReturnValue([] as any);
            const response = await weatherController.allCities();
            expect(response).toStrictEqual({
                status: false,
                error: 'Cities not found!',
            });
        });

        it('should return null if weather service api failed', async () => {
            jest.spyOn(weatherService, 'byLocationName').mockReturnValue(
                throwError(() => new Error('Invalid request')),
            );
            jest.spyOn(cityService, 'findAll').mockReturnValue([
                mockCities[0],
            ] as any);
            const response = await weatherController.allCities();
            expect(response).toStrictEqual({
                status: true,
                response: [{ London: { list: null } }],
            });
        });

        it('should throw error if query failed to return cities', async () => {
            jest.spyOn(cityService, 'findAll').mockReturnValue(
                throwError(() => new Error('Invalid request')) as any,
            );
            const response = await weatherController.allCities();
            expect(response).toStrictEqual({
                status: false,
                error: 'cities is not iterable',
            });
        });
    });

    describe('GET request to weather/city/:name', () => {
        it('should return weather details for the given city', async () => {
            const weather = JSON.parse(
                readFileSync('test/mocks/london-weather.json'),
            );
            jest.spyOn(weatherService, 'byLocationName').mockImplementation(
                (name: string) => of(weather),
            );
            const response = await weatherController.city({ name: 'London' });
            expect(response).toStrictEqual({
                status: true,
                response: weather,
            });
        });

        it('should return city not found', async () => {
            jest.spyOn(cityService, 'findByName').mockReturnValue(null);
            const response = await weatherController.city({ name: 'London' });
            expect(response).toStrictEqual({
                status: false,
                error: 'City not found!',
            });
        });

        it('should throw error if request failed to return city and its weather', async () => {
            jest.spyOn(cityService, 'findByName').mockReturnValue(
                throwError(() => new Error('Invalid request')) as any,
            );
            jest.spyOn(weatherService, 'byLocationName').mockReturnValue(
                throwError(() => new Error('Invalid request')),
            );
            const response = await weatherController.city({ name: 'London' });
            expect(response).toStrictEqual({
                status: false,
                error: 'Invalid request',
            });
        });
    });
});
