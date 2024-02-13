import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CheckPermissionService } from '@/modules/check-permission/check-permission.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private _reflector: Reflector,
    private readonly _checkPermissionService: CheckPermissionService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const accessController = this._reflector.get(
      'permissions',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const params = this._getParams(request);
    return await this._checkPermissionService.check(
      user,
      accessController,
      params,
    );
  }

  private _getParams(request: any) {
    const params = request.params || {};
    return Object.entries(params).reduce((acc, current) => {
      const [key, value] = current;
      acc[key] = Number(value);
      return acc;
    }, {});
  }
}
