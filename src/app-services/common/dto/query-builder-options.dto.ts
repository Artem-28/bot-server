import { IsOptional, IsString } from 'class-validator';
import { OrderDto } from '@app-services/common/dto/order.dto';
import { PaginationDto } from '@/app-services';
import { QueryBuilderFilterDto } from '@app-services/common/dto/query-builder-filter.dto';

export class QueryBuilderOptionsDto {
  @IsOptional()
  @IsString()
  alias?: string = 'entity';

  @IsOptional()
  order?: OrderDto | OrderDto[];

  @IsOptional()
  pagination?: PaginationDto;

  @IsOptional()
  filter?: QueryBuilderFilterDto | QueryBuilderFilterDto[];
}
