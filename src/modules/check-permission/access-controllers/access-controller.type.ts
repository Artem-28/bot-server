import {
  PermissionAdminEnum,
  PermissionUserEnum,
} from '@/base/enum/permission/permission.enum';

export type AccessControllerEnum = PermissionAdminEnum | PermissionUserEnum;
export interface AccessController {
  permissions: AccessControllerEnum[];
  operator: 'and' | 'or';
}
