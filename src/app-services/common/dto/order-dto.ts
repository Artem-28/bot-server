import { IsDefined, IsOptional, IsString } from 'class-validator';

export class OrderDto {
  @IsDefined()
  @IsString()
  sort: string;

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  nulls?: 'NULLS FIRST' | 'NULLS LAST';
}
