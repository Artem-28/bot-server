export enum PermissionEnum {
  PROJECT_ACCESS = 'project_access', // Все действия с проектом
  PROJECT_CREATE = 'project_create', // Создание проекта
  PROJECT_UPDATE = 'project_update', // Обновление проекта
  PROJECT_DELETE = 'project_delete', // Удаление проекта
  PROJECT_VIEW = 'project_view', // Просмотр проекта

  PROJECT_SUBSCRIBE = 'project_subscribe', // Подписываться на проект
  PROJECT_UNSUBSCRIBE = 'project_unsubscribe', // Отписываться от проекта
  PROJECT_SUBSCRIBERS_VIEW = 'project_subscribers_view', // Смотреть всех подписчиков на проекте

  SCRIPT_ACCESS = 'script_access', // Разрешены все действия
  SCRIPT_CREATE = 'script_create', // Создание
  SCRIPT_UPDATE = 'script_update', // Обновление ресурса
  SCRIPT_VIEW = 'script_view', // Инфо о ресурсе
  SCRIPT_DELETE = 'script_delete' // Удаление ресурса
}
