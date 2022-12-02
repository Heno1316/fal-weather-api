import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/shared.module';
import { CityController } from './city.controller';
import { City, CitySchema } from './city.schema';
import { CityService } from './city.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: City.name,
                schema: CitySchema,
                collection: City.name,
            },
        ]),
        SharedModule,
    ],
    controllers: [CityController],
    providers: [CityService],
    exports: [CityService],
})
export class CityModule {}
