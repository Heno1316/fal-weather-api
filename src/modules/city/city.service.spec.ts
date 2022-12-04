import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CityService } from './city.service';
import { City, CityDocument } from './city.schema';
import { Model } from 'mongoose';

const mockCities = {
    london: {
        id: 2643743,
        name: 'London',
        state: 'ky',
        country: 'us',
        latitude: 37.129,
        longitude: -84.0833,
    },
    dubai: {
        id: 292223,
        name: 'Dubai',
        state: null,
        country: null,
        latitude: 25.2582,
        longitude: 55.3047,
    },
};
const mockCity = (city): City => ({ ...city });
const mockCityDoc = (mock?: Partial<City>): Partial<CityDocument> => ({
    ...mock,
});

describe('CityService', () => {
    let cityService: CityService;
    let model: Model<CityDocument>;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                CityService,
                {
                    provide: getModelToken(City.name),
                    useValue: {
                        findOneAndUpdate: jest.fn(),
                        findOne: jest.fn(),
                        find: jest.fn(),
                    },
                },
            ],
        }).compile();

        cityService = app.get<CityService>(CityService);
        model = app.get<Model<CityDocument>>(getModelToken(City.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Invoke findByIdAndUpdate', () => {
        it('should create a new city if no matching record found for the id', async () => {
            jest.spyOn(model, 'findOneAndUpdate').mockResolvedValueOnce(
                mockCities.london,
            );
            const data = await cityService.findByIdAndUpdate(
                mockCities.london.id,
                mockCities.london,
            );
            expect(data).toEqual(mockCities.london);
        });

        it('should create a new city if no matching record is found for the id with state and country values as null', async () => {
            jest.spyOn(model, 'findOneAndUpdate').mockResolvedValueOnce(
                mockCities.dubai,
            );
            const data = await cityService.findByIdAndUpdate(
                mockCities.dubai.id,
                mockCities.dubai,
            );
            expect(data).toEqual(mockCities.dubai);
        });
    });

    describe('Invoke findByName', () => {
        it('should find the city by name', async () => {
            jest.spyOn(model, 'findOne').mockResolvedValue(
                mockCityDoc(mockCities.dubai),
            );
            const findMockCity = mockCity(mockCities.dubai);
            const data = await cityService.findByName('Dubai');
            expect(data).toEqual(findMockCity);
        });
    });

    describe('Invoke findAll', () => {
        it('should find the all cities', async () => {
            jest.spyOn(model, 'find').mockResolvedValue([
                mockCityDoc(mockCities.london),
                mockCityDoc(mockCities.dubai),
            ]);
            const findMockCities = [
                mockCity(mockCities.london),
                mockCity(mockCities.dubai),
            ];
            const data = await cityService.findAll();
            expect(data).toEqual(findMockCities);
        });
    });
});
