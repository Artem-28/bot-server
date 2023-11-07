import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { CheckPermissionDto } from './dto/check-permission.dto';
import { PermissionEnum } from '../../base/enum/permission/permission.enum';
import { HttpParams } from '../../base/interfaces/http.interface';

@Injectable()
export class CheckPermissionService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  private _checkProjectOwner(user: User, projectId: number): boolean {
    return user.projectIds.includes(projectId);
  }

  private _checkProjectSubscriber(user: User, projectId: number): boolean {
    return user.subscribedProjectIds.includes(projectId);
  }

  private _checkPermission(
    user: User,
    permission: PermissionEnum,
    params: HttpParams,
  ) {
    switch (permission) {
      case PermissionEnum.PROJECT_OWNER:
        return this._checkProjectOwner(user, params.projectId);
      case PermissionEnum.PROJECT_SUBSCRIBER:
        return this._checkProjectSubscriber(user, params.projectId);
      default:
        return false;
    }
  }

  private async _loadRelations(user: User, permissions: PermissionEnum[]) {
    const rootQuery = this._userRepository.createQueryBuilder('user');
    permissions.forEach((permission) => {
      switch (permission) {
        case PermissionEnum.PROJECT_SUBSCRIBER:
          rootQuery
            .leftJoin('user.subscribedProjects', 'subscribedProject')
            .addSelect('subscribedProject.projectId');
          break;
        case PermissionEnum.PROJECT_OWNER:
          rootQuery
            .leftJoin('user.projects', 'project')
            .addSelect('project.id');
      }
    });
    return await rootQuery.where('user.id = :id', { id: user.id }).getOne();
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
