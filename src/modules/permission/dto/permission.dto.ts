import { IsDefined, IsEnum, IsString } from 'class-validator';
import { PermissionUserEnum } from '@/base/enum/permission/permission.enum';

export class PermissionDto {
  @IsDefined()
  @IsEnum(PermissionUserEnum)
  code: PermissionUserEnum;

  @IsEnum(PermissionUserEnum)
  parentCode?: PermissionUserEnum;

  @IsDefined()
  @IsString()
  label: string;
}
