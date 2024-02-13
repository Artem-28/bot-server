import { PermissionUserEnum } from '@/base/enum/permission/permission.enum';

export class PermissionUserDto {
  userId: number;

  projectId: number;

  permissions: PermissionUserEnum[];
}
