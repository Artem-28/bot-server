import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

// Entity
import { User } from '@/modules/user/user.entity';

// Types
import {
  PermissionAdminEnum,
  PermissionUserEnum,
} from '@/base/enum/permission/permission.enum';

// Helpers
import QueryBuilderHelper from '@/base/helpers/query-builder.helper';
import {
  AccessController,
  AccessControllerEnum,
} from '@/modules/check-permission/access-controllers/access-controller.type';
import { QueryFilter } from '@/base/interfaces/service.interface';

@Injectable()
export class CheckPermissionService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  // Проверка является ли пользователь владельцем проекта
  private _checkProjectOwner(user: User, params: any): boolean {
    return user.projectIds.includes(params.projectId);
  }

  // Проверка является ли пользователь подписчиком проекта
  private _checkProjectSubscriber(user: User, params: any): boolean {
    return user.subscribedProjectIds.includes(params.projectId);
  }

  // Доступ к управлению правами пользователя
  private _checkAccessPermissionUser(
    user: User,
    permission: PermissionUserEnum,
    params: any,
  ): boolean {
    if (user.id === params.userId) return false;
    const subscribedProject = user.subscribedProjects.find(
      (p) => p.projectId === params.projectId,
    );
    if (!subscribedProject) return false;
    const userOwner = subscribedProject.userId !== params.userId;
    if (userOwner) return false;
    return this._checkPermissionUser(user, permission);
  }

  // Доступ к просмотру прав пользователя
  private _checkViewPermissionUser(
    user: User,
    permission: PermissionUserEnum,
    params: any,
  ): boolean {
    const subscribedProject = user.subscribedProjects.find(
      (p) => p.projectId === params.projectId,
    );
    if (!subscribedProject) return false;
    return this._checkPermissionUser(user, permission);
  }

  // Проверяет наличие права у пользователя
  private _checkPermissionUser(
    user: User,
    permission: PermissionUserEnum,
  ): boolean {
    const permissions = user.permissions || [];
    return permissions.some((p) => p.code === permission);
  }

  private _checkPermission(
    user: User,
    permission: AccessControllerEnum,
    params: any,
  ) {
    switch (permission) {
      case PermissionAdminEnum.PROJECT_OWNER:
        return this._checkProjectOwner(user, params);
      case PermissionAdminEnum.PROJECT_SUBSCRIBER:
        return this._checkProjectSubscriber(user, params);
      case PermissionUserEnum.PERMISSION_USER_ACCESS:
      case PermissionUserEnum.PERMISSION_USER_UPDATE:
        return this._checkAccessPermissionUser(user, permission, params);
      case PermissionUserEnum.PERMISSION_USER_VIEW:
        return this._checkViewPermissionUser(user, permission, params);
      case PermissionUserEnum.SCRIPT_CREATE_OR_UPDATE:
        return this._checkPermissionUser(user, permission);
      default:
        return false;
    }
  }

  private _filterRelationPermissions(filter: QueryFilter) {
    return new Brackets((qb) => {
      qb.where(filter.field, filter.value).orWhere('permissions.id IS NULL');
    });
  }

  private _filterSubscribedProjects(filter: QueryFilter) {
    return new Brackets((qb) => {
      qb.where(filter.field, filter.value).orWhere(
        'subscribedProjects.id IS NULL',
      );
    });
  }

  public async check(
    user: User,
    accessController: AccessController,
    params: any,
  ): Promise<boolean> {
    const { permissions, operator } = accessController;
    user = await this._loadRelations(user, permissions, params);
    console.log('USER <<<<<<<<<<<<<<<<', user);
    if (!user) return false;
    switch (operator) {
      case 'and':
        return permissions.every((permission) =>
          this._checkPermission(user, permission, params),
        );
      case 'or':
        return permissions.some((permission) =>
          this._checkPermission(user, permission, params),
        );
    }
  }

  private async _loadRelations(
    user: User,
    permissions: AccessControllerEnum[],
    params: any,
  ) {
    // const res = await this._userRepository
    //   .createQueryBuilder('user')
    //   .leftJoinAndSelect(
    //     'user.permissions',
    //     'permissions',
    //     'permissions.projectId = :projectId',
    //   )
    //   .where('user.id = :id', { id: user.id })
    //   .andWhere(
    //     new Brackets((qb) => {
    //       qb.where('permissions.projectId = :projectId', {
    //         projectId: params.projectId,
    //       }).orWhere('permissions.id IS NULL');
    //     }),
    //   )
    //   .getOne();
    // return res;
    const queryHelper = new QueryBuilderHelper(this._userRepository, {
      filter: { field: 'id', value: user.id },
    });
    permissions.forEach((permission) => {
      switch (permission) {
        case PermissionAdminEnum.PROJECT_OWNER:
          queryHelper.relation({ name: 'projects', select: 'id' });
          break;
        case PermissionAdminEnum.PROJECT_SUBSCRIBER:
          queryHelper.relation({
            name: 'subscribedProjects',
            select: 'projectId',
          });
          break;
        case PermissionUserEnum.PERMISSION_USER_ACCESS:
        case PermissionUserEnum.PERMISSION_USER_UPDATE:
        case PermissionUserEnum.PERMISSION_USER_VIEW:
        case PermissionUserEnum.SCRIPT_ACCESS:
        case PermissionUserEnum.SCRIPT_CREATE_OR_UPDATE:
        case PermissionUserEnum.SCRIPT_DELETE:
        case PermissionUserEnum.SCRIPT_VIEW:
          queryHelper.filter([
            {
              field: 'permissions.projectId',
              value: params.projectId,
              callback: this._filterRelationPermissions,
            },
            {
              field: 'subscribedProjects.projectId',
              value: params.projectId,
              callback: this._filterSubscribedProjects,
            },
          ]);
          queryHelper.relation([
            { name: 'permissions', methods: 'leftJoinAndSelect' },
            { name: 'subscribedProjects', methods: 'leftJoinAndSelect' },
          ]);
          break;
        default:
          break;
      }
    });
    return await queryHelper.builder.getOne();
  }
}
