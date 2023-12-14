import { SetMetadata } from '@nestjs/common';

import { PermissionEnum } from '@/base/enum/permission/permission.enum';
import { TPermissionOperator } from '@/modules/check-permission/dto/check-permission.dto';

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
