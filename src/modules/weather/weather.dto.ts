import { IsNotEmpty, IsString } from 'class-validator';

export class CityParam {
    @IsNotEmpty({ message: `'name' should not be empty` })
    @IsString({ message: `'name' must be string` })
    name: string;
}
