import { PaginationDto, OrderDto } from './index';
import { IsOptional } from 'class-validator';

export class QueryOptionsDto {
  @IsOptional()
  pagination?: PaginationDto;

  @IsOptional()
  order?: OrderDto;
}
