import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from 'src/shared/services/weather.service';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { CreateCity, CreateCityDto } from './city.dto';
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
                throwError({ message: 'Invalid request' }),
            );
            const response = await cityController.add(mockedLocation);
            expect(response).toStrictEqual({
                status: false,
                error: 'Invalid request',
            });
        });
    });
});
