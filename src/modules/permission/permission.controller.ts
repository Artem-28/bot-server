import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

// Module

// Controller

// Service
import { PermissionService } from '@/modules/permission/permission.service';

// Entity
import { PermissionUser } from '@/modules/permission/permission-user.entity';

// Guard
import { AuthJwtGuard } from '@/modules/auth/passport/guards/auth-jwt.guard';
import { PermissionGuard } from '@/modules/check-permission/guards/permission.guard';
import { Permission } from '@/modules/check-permission/decorators/permission.decorator';
import {
  PERMISSION_USER_UPDATE,
  PERMISSION_USER_VIEW,
} from '@/modules/check-permission/access-controllers/permission-controller.access';

// Types
import { PermissionUserDto } from '@/modules/permission/dto/permission-user.dto';
import { UserService } from '@/modules/user/user.service';

// Helper

@Controller('permissions')
@UseGuards(AuthJwtGuard)
export class PermissionController {
  constructor(
    readonly permissionService: PermissionService,
    readonly userService: UserService,
  ) {}

  // Получение списка всех возможных разрешений
  @Get()
  public async permissions() {
    try {
      return await this.permissionService.getPermissionGroups();
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Просмотр прав пользователя для проекта
  @Get('projects/:projectId/users/:userId')
  @UseGuards(PermissionGuard)
  @Permission(PERMISSION_USER_VIEW)
  public async getPermissionUser(@Param() param) {
    try {
      this.userService.checkSubscriptionToProject(param.userId, param.projectId);
      // return await this.permissionService.getPermissionUser({
      //   filter: [
      //     { field: 'userId', value: param.userId },
      //     { field: 'projectId', value: param.projectId },
      //   ],
      // });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Обновления разрешений пользователя для проекта
  @Patch('projects/:projectId/users/:userId')
  @UseGuards(PermissionGuard)
  @Permission(PERMISSION_USER_UPDATE)
  public async updatePermissionUser(
    @Param() param,
    @Body() body: PermissionUserDto,
  ): Promise<PermissionUser[]> {
    body.projectId = Number(param.projectId);
    body.userId = Number(param.userId);
    try {
      await this.permissionService.updatePermissionUser(body, {
        throwException: true,
      });
      return await this.permissionService.getPermissionUser({
        filter: [
          { field: 'userId', value: param.userId },
          { field: 'projectId', value: param.projectId },
        ],
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
