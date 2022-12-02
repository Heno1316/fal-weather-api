import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City, CityDocument } from './city.schema';
import { CreateCityDto } from './city.dto';

@Injectable()
export class CityService {
    constructor(@InjectModel(City.name) private _model: Model<CityDocument>) {}

    async findByIdAndUpdate(
        id: number,
        data: CreateCityDto,
    ): Promise<CityDocument> {
        return this._model.findOneAndUpdate({ id }, data, {
            new: true,
            upsert: true,
        });
    }

    async findByName(name: string): Promise<CityDocument> {
        return this._model.findOne({ name: { $regex: name, $options: 'i' } });
    }

    async findAll(): Promise<CityDocument[]> {
        return this._model.find();
    }
}
