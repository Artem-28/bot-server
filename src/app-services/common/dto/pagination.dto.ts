import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @Type(() => Number)
  skip: number = 0;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Type(() => Number)
  @IsPositive()
  take: number = 0;
}
