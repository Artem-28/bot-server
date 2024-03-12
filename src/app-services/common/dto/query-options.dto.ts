import { QueryBuilderOptionsDto } from './query-builder-options.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class QueryOptionsDto extends QueryBuilderOptionsDto {
  @IsOptional()
  @IsBoolean()
  throwExceptions?: boolean = false;
}
