import { IsDefined, IsOptional, IsString } from 'class-validator';
import { Brackets } from 'typeorm';

export class QueryBuilderFilterDto {
  @IsDefined()
  @IsString()
  field: string;

  @IsOptional()
  value?: any | any[];

  @IsOptional()
  operator?: 'and' | 'or' = 'and';

  @IsOptional()
  callback?: (filter: QueryBuilderFilterDto) => Brackets;
}
