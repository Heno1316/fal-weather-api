import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCityDto {
    readonly id: number;
    readonly name: string;
    readonly state?: string;
    readonly country?: string;
    readonly latitude: number;
    readonly longitude: number;
}

export class CreateCity {
    @IsNotEmpty({ message: `'name' should not be empty` })
    @IsString({ message: `'name' must be string` })
    name: string;

    @IsOptional()
    @IsNotEmpty({ message: `'name' should not be empty` })
    @IsString({ message: `'state' must be string. Only for the US` })
    state: string;

    @IsOptional()
    @IsNotEmpty({ message: `'country' should not be empty` })
    @IsString({
        message: `'country' must be string. Please use ISO 3166 country codes`,
    })
    country: string;
}
