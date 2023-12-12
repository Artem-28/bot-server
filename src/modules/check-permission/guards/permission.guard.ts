import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CheckPermissionService } from '../check-permission.service';
import { HttpParams } from '../../../base/interfaces/http.interface';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private _reflector: Reflector,
    private readonly _checkPermissionService: CheckPermissionService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { permissions, operator } = this._reflector.get(
      'permissions',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const params = this._getParams(request);
    const permissionsDto = { permissions, operator, params };
    const user = request.user;
    return await this._checkPermissionService.check(user, permissionsDto);
  }

  private _getParams(request: any) {
    const params = request.params;
    const body = request.body;
    const httpParams = {} as HttpParams;
    const projectId = params.projectId || body.projectId;
    const userId = params.userId || body.userId;
    if (projectId) {
      httpParams.projectId = Number(projectId);
    }
    if (userId) {
      httpParams.userId = Number(userId);
    }
    return httpParams;
  }
}
