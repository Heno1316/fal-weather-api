import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CityDocument = City & Document;

@Schema({
    versionKey: false,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'updatedOn',
    },
})
export class City {
    @Prop({
        type: 'number',
        required: true,
    })
    id: number;

    @Prop({
        type: 'string',
        required: true,
    })
    name: string;

    @Prop({
        type: 'string',
    })
    state: string;

    @Prop({
        type: 'string',
    })
    country: string;

    @Prop({
        type: 'number',
        required: true,
    })
    latitude: number;

    @Prop({
        type: 'number',
        required: true,
    })
    longitude: number;
}

export const CitySchema = SchemaFactory.createForClass(City);
