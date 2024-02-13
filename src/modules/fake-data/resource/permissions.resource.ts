import { PermissionDto } from '@/modules/permission/dto/permission.dto';
import { PermissionUserEnum } from '@/base/enum/permission/permission.enum';

const resource: PermissionDto[] = [
  ..._createResource(PermissionUserEnum.SCRIPT_ACCESS, [
    PermissionUserEnum.SCRIPT_VIEW,
    PermissionUserEnum.SCRIPT_DELETE,
    PermissionUserEnum.SCRIPT_CREATE_OR_UPDATE,
  ]),
  ..._createResource(PermissionUserEnum.PROJECT_SUBSCRIBER_ACCESS, [
    PermissionUserEnum.PROJECT_SUBSCRIBER_CREATE_OR_UPDATE,
    PermissionUserEnum.PROJECT_SUBSCRIBER_DELETE,
    PermissionUserEnum.PROJECT_SUBSCRIBER_VIEW,
  ]),
  ..._createResource(PermissionUserEnum.PERMISSION_USER_ACCESS, [
    PermissionUserEnum.PERMISSION_USER_UPDATE,
    PermissionUserEnum.PERMISSION_USER_VIEW,
  ]),
];

function _createResource(
  parentCode: PermissionUserEnum,
  children: PermissionUserEnum[],
): PermissionDto[] {
  return [parentCode, ...children].map((code) => {
    if (parentCode === code) {
      return { code, label: `permission.${code}`, parentCode: null };
    }
    return { code, parentCode, label: `permission.${code}` };
  });
}

export default resource;
