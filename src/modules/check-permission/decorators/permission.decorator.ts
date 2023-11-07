import { PermissionEnum } from '../../../base/enum/permission/permission.enum';
import { SetMetadata } from '@nestjs/common';
import { TPermissionOperator } from '../dto/check-permission.dto';

export const Permission = (
  permissions: PermissionEnum[],
  operator: TPermissionOperator = 'and',
) => SetMetadata('permissions', { permissions, operator });
