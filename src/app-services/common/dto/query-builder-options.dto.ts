import { IsOptional, IsString } from 'class-validator';
import { OrderDto } from '@app-services/common/dto/order-dto';
import { PaginationDto } from '@/app-services';

export class QueryBuilderOptionsDto {
  @IsOptional()
  @IsString()
  alias?: string = 'entity';

  @IsOptional()
  order: OrderDto | OrderDto[];

  @IsOptional()
  pagination: PaginationDto;
}
