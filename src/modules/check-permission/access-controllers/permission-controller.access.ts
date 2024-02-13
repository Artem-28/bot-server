import {PermissionAdminEnum, PermissionUserEnum,} from '@/base/enum/permission/permission.enum';
import {AccessController} from '@/modules/check-permission/access-controllers/access-controller.type';

/* ------------- Permissions controller ------------------ */
export const PERMISSION_USER_UPDATE: AccessController = {
  permissions: [
    PermissionAdminEnum.PROJECT_OWNER,
    PermissionUserEnum.PERMISSION_USER_ACCESS,
    PermissionUserEnum.PERMISSION_USER_UPDATE,
  ],
  operator: 'or',
};

export const PERMISSION_USER_VIEW: AccessController = {
  permissions: [
    PermissionAdminEnum.PROJECT_OWNER,
    PermissionUserEnum.PERMISSION_USER_ACCESS,
    PermissionUserEnum.PERMISSION_USER_VIEW,
  ],
  operator: 'or',
};

/* ------------- Projects controller ------------------ */
export const PROJECT_VIEW: AccessController = {
  permissions: [
    PermissionAdminEnum.PROJECT_OWNER,
    PermissionAdminEnum.PROJECT_SUBSCRIBER,
  ],
  operator: 'or',
};

export const PROJECT_UPDATE: AccessController = {
  permissions: [PermissionAdminEnum.PROJECT_OWNER],
  operator: 'or',
};

export const PROJECT_DELETE: AccessController = {
  permissions: [PermissionAdminEnum.PROJECT_OWNER],
  operator: 'or',
};

/* ------------- Script controller ------------------ */
export const SCRIPT_CREATE: AccessController = {
  permissions: [
    PermissionAdminEnum.PROJECT_OWNER,
    PermissionUserEnum.SCRIPT_ACCESS,
    PermissionUserEnum.SCRIPT_CREATE_OR_UPDATE,
  ],
  operator: 'or',
};

export const SCRIPT_UPDATE: AccessController = {
  permissions: [
    PermissionAdminEnum.PROJECT_OWNER,
    PermissionUserEnum.SCRIPT_ACCESS,
    PermissionUserEnum.SCRIPT_CREATE_OR_UPDATE,
  ],
  operator: 'or',
};

export const SCRIPT_DELETE: AccessController = {
  permissions: [
    PermissionAdminEnum.PROJECT_OWNER,
    PermissionUserEnum.SCRIPT_ACCESS,
    PermissionUserEnum.SCRIPT_DELETE,
  ],
  operator: 'or',
};

export const SCRIPT_VIEW: AccessController = {
  permissions: [
    PermissionAdminEnum.PROJECT_OWNER,
    PermissionUserEnum.SCRIPT_ACCESS,
    PermissionUserEnum.SCRIPT_VIEW,
  ],
  operator: 'or',
};