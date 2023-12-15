import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entity
import { User } from '@/modules/user/user.entity';

// Types
import { CheckPermissionDto } from '@/modules/check-permission/dto/check-permission.dto';
import { PermissionEnum } from '@/base/enum/permission/permission.enum';
import { HttpParams } from '@/base/interfaces/http.interface';

// Helpers
import QueryBuilderHelper from '@/base/helpers/query-builder-helper';

@Injectable()
export class CheckPermissionService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  private _checkProjectAccess(user: User, projectId: number): boolean {
    return user.projectIds.includes(projectId);
  }

  private _checkProjectView(user: User, projectId: number): boolean {
    return (
      user.subscribedProjectIds.includes(projectId) ||
      user.projectIds.includes(projectId)
    );
  }

  private _checkProjectUnsubscribe(user, params: HttpParams): boolean {
    // авторизованый пользователь является владельцем проекта
    const isOwner = user.projectIds.includes(params.projectId);
    // или хочет отписаться сам
    return isOwner || user.id === params.userId;
  }

  private _checkPermission(
    user: User,
    permission: PermissionEnum,
    params: HttpParams,
  ) {
    switch (permission) {
      case PermissionEnum.PROJECT_ACCESS:
      case PermissionEnum.PROJECT_DELETE:
      case PermissionEnum.PROJECT_CREATE:
      case PermissionEnum.PROJECT_UPDATE:
      case PermissionEnum.PROJECT_SUBSCRIBE:
      case PermissionEnum.PROJECT_SUBSCRIBERS_VIEW:
        return this._checkProjectAccess(user, params.projectId);
      case PermissionEnum.PROJECT_VIEW:
      case PermissionEnum.SCRIPT_ACCESS:
      case PermissionEnum.SCRIPT_DELETE:
      case PermissionEnum.SCRIPT_CREATE:
      case PermissionEnum.SCRIPT_UPDATE:
      case PermissionEnum.SCRIPT_VIEW:
        return this._checkProjectView(user, params.projectId);
      case PermissionEnum.PROJECT_UNSUBSCRIBE:
        return this._checkProjectUnsubscribe(user, params);
      default:
        return false;
    }
  }

  private async _loadRelations(user: User, permissions: PermissionEnum[]) {
    const queryHelper = new QueryBuilderHelper(this._userRepository, {
      filter: { field: 'id', value: user.id },
    });
    permissions.forEach((permission) => {
      switch (permission) {
        case PermissionEnum.PROJECT_ACCESS:
        case PermissionEnum.PROJECT_DELETE:
        case PermissionEnum.PROJECT_CREATE:
        case PermissionEnum.PROJECT_UPDATE:
        case PermissionEnum.PROJECT_SUBSCRIBE:
        case PermissionEnum.PROJECT_UNSUBSCRIBE:
        case PermissionEnum.PROJECT_SUBSCRIBERS_VIEW:
          queryHelper.relation({ name: 'projects', select: 'id' });
          break;
        case PermissionEnum.PROJECT_VIEW:
        case PermissionEnum.SCRIPT_ACCESS:
        case PermissionEnum.SCRIPT_DELETE:
        case PermissionEnum.SCRIPT_CREATE:
        case PermissionEnum.SCRIPT_UPDATE:
        case PermissionEnum.SCRIPT_VIEW:
          queryHelper.relation([
            { name: 'projects', select: 'id' },
            { name: 'subscribedProjects', select: 'projectId' },
          ]);
      }
    });
    return queryHelper.builder.getOne();
  }

  public async check(
    user: User,
    permissionsDto: CheckPermissionDto,
  ): Promise<boolean> {
    const { permissions, operator, params } = permissionsDto;
    user = await this._loadRelations(user, permissions);
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
}
