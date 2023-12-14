import { PermissionEnum } from '@/base/enum/permission/permission.enum';
import { HttpParams } from '@/base/interfaces/http.interface';

export type TPermissionOperator = 'and' | 'or';

export class CheckPermissionDto {
  permissions: PermissionEnum[];
  operator: TPermissionOperator;
  params: HttpParams;
}
