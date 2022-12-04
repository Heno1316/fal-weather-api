import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from 'src/shared/services/weather.service';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { CreateCity, CreateCityDto } from './city.dto';
import { of, throwError } from 'rxjs';

const { readFileSync } = require('fs');
const mockedWeather = JSON.parse(
    readFileSync('test/mocks/london-weather.json'),
);

describe('CityController', () => {
    let cityController: CityController;
    let weatherService: WeatherService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [CityController],
            providers: [
                {
                    provide: WeatherService,
                    useValue: {
                        byLocationName: jest.fn(() => of(mockedWeather)),
                    },
                },
                {
                    provide: CityService,
                    useValue: {
                        findByIdAndUpdate: jest
                            .fn()
                            .mockImplementation(
                                (id: number, data: CreateCityDto) =>
                                    Promise.resolve({
                                        _id: 'ObjectId',
                                        ...data,
                                    }),
                            ),
                    },
                },
            ],
        }).compile();

        cityController = app.get<CityController>(CityController);
        weatherService = app.get<WeatherService>(WeatherService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST request to city/add', () => {
        it('should create new city and return weather details', async () => {
            const mockedLocation: CreateCity = {
                name: 'London',
                state: 'ky',
                country: 'us',
            };
            const response = await cityController.add(mockedLocation);
            expect(response).toStrictEqual({
                status: true,
                response: mockedWeather,
            });
        });

        it('should create new city without state and return weather details', async () => {
            const mockedLocation: CreateCity = {
                name: 'Dubai',
                state: null,
                country: 'ae',
            };
            const response = await cityController.add(mockedLocation);
            expect(response).toStrictEqual({
                status: true,
                response: mockedWeather,
            });
        });

        it('should create new city without country and return weather details', async () => {
            const mockedLocation: CreateCity = {
                name: 'Chennai',
                state: 'tn',
                country: null,
            };
            const response = await cityController.add(mockedLocation);
            expect(response).toStrictEqual({
                status: true,
                response: mockedWeather,
            });
        });

        it('should create new city without state and country and return weather details', async () => {
            const mockedLocation: CreateCity = {
                name: 'Stockholm',
                state: null,
                country: null,
            };
            const response = await cityController.add(mockedLocation);
            expect(response).toStrictEqual({
                status: true,
                response: mockedWeather,
            });
        });

        it('should throw error for invalid payload', async () => {
            const mockedLocation: CreateCity = {
                name: null,
                state: null,
                country: null,
            };
            jest.spyOn(weatherService, 'byLocationName').mockReturnValue(
                throwError(() => new Error('Invalid request')),
            );
            const response = await cityController.add(mockedLocation);
            expect(response).toStrictEqual({
                status: false,
                error: 'Invalid request',
            });
        });
    });
});
