import { PermissionEnum } from '../../../base/enum/permission/permission.enum';
import { SetMetadata } from '@nestjs/common';
import { TPermissionOperator } from '../dto/check-permission.dto';

export const Permission = (
  permissions: PermissionEnum[] | PermissionEnum,
  operator: TPermissionOperator = 'and',
) => {
  const meta = {
    permissions: Array.isArray(permissions) ? permissions : [permissions],
    operator,
  };
  return SetMetadata('permissions', meta);
};
