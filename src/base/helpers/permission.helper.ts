import { PermissionUserEnum } from '@/base/enum/permission/permission.enum';

interface IPermissionMap {
  [key: string]: {
    accessPermission: PermissionUserEnum | null;
    permissions: PermissionUserEnum[];
  };
}

interface ICombinePermissionMap {
  [key: string]: PermissionUserEnum[];
}

export function mergePermissionsUserCode(
  permission: PermissionUserEnum[],
): PermissionUserEnum[] {
  const permissionMap = getPermissionMap(PermissionUserEnum);
  const combinePermission = combinePermissionMap(permission);
  return Object.entries(combinePermission).reduce((acc, current) => {
    const [key, permissionCodes] = current;
    if (!permissionMap.hasOwnProperty(key)) return acc;

    const { accessPermission, permissions } = permissionMap[key];
    if (permissionCodes.includes(accessPermission)) {
      return [...acc, accessPermission];
    }

    if (permissions.every((p) => permissionCodes.includes(p))) {
      return [...acc, accessPermission];
    }

    return [...acc, ...permissionCodes];
  }, []) as PermissionUserEnum[];
}

function getPermissionMap(
  permissionEnum: typeof PermissionUserEnum,
): IPermissionMap {
  return Object.entries(permissionEnum).reduce((acc, current) => {
    const [, value] = current;
    const permission = value as PermissionUserEnum;
    const [key, action] = permission.split('_');

    const currentAccess = action === 'access' ? permission : null;
    const accessPermission = acc[key]?.accessPermission || currentAccess;
    const currentPermissions = !currentAccess ? [permission] : [];

    if (acc.hasOwnProperty(key)) {
      const permissions = [...acc[key].permissions, ...currentPermissions];
      acc[key] = { accessPermission, permissions };
      return acc;
    }

    acc[key] = { accessPermission, permissions: currentPermissions };
    return acc;
  }, {} as IPermissionMap);
}

function combinePermissionMap(
  permission: PermissionUserEnum[],
): ICombinePermissionMap {
  return permission.reduce((acc, current) => {
    const [key] = current.split('_');
    acc.hasOwnProperty(key) ? acc[key].push(current) : (acc[key] = [current]);
    return acc;
  }, {} as ICombinePermissionMap);
}
