export enum PermissionUserEnum {
  PROJECT_SUBSCRIBER_ACCESS = 'project-subscriber_access', // Подписываться на проект
  PROJECT_SUBSCRIBER_VIEW = 'project-subscriber_view',
  PROJECT_SUBSCRIBER_DELETE = 'project-subscriber_delete',
  PROJECT_SUBSCRIBER_CREATE_OR_UPDATE = 'project-subscriber_create-or-update',

  SCRIPT_ACCESS = 'script_access', // Разрешены все действия
  SCRIPT_CREATE_OR_UPDATE = 'script_create-or-update',
  SCRIPT_VIEW = 'script_view', // Инфо о ресурсе
  SCRIPT_DELETE = 'script_delete', // Удаление ресурса

  PERMISSION_USER_ACCESS = 'permission-user_access',
  PERMISSION_USER_UPDATE = 'permission-user_update',
  PERMISSION_USER_VIEW = 'permission-user_view',
}

export enum PermissionAdminEnum {
  PROJECT_OWNER = 'project_owner',
  PROJECT_SUBSCRIBER = 'project_subscriber',
}
