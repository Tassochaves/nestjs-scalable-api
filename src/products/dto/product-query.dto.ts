import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class ProductQueryDto{
    
    @IsString()
    @IsOptional()
    name: string;

    @Min(1)
    @IsInt()
    @IsOptional()
    page: number = 1;

    @Min(1)
    @IsInt()
    @IsOptional()
    limit: number;
}