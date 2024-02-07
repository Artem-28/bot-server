import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

// Module
// Controller
// Service
import { ScriptService } from '@/modules/script/script.service';

// Entity
import { Script } from '@/modules/script/script.entity';

// Guard
import { PermissionGuard } from '@/modules/check-permission/guards/permission.guard';
import { AuthJwtGuard } from '@/modules/auth/passport/guards/auth-jwt.guard';
import { Permission } from '@/modules/check-permission/decorators/permission.decorator';

// Types
import { CreateScriptDto } from '@/modules/script/dto/create-script.dto';
import { PermissionEnum } from '@/base/enum/permission/permission.enum';
import { SearchScriptParams } from '@/modules/script/util/search-script.params';

// Helper

@Controller('projects/:projectId/scripts')
@UseGuards(AuthJwtGuard)
export class ScriptController {
  constructor(readonly scriptService: ScriptService) {}

  // Создание скрипта
  @Post()
  @UseGuards(PermissionGuard)
  @Permission(
    [PermissionEnum.SCRIPT_ACCESS, PermissionEnum.SCRIPT_CREATE],
    'or',
  )
  public async create(
    @Req() req,
    @Param() param,
    @Body() body: CreateScriptDto,
  ): Promise<Script> {
    try {
      const dto = { ...body, ...param };
      return await this.scriptService.createScript(dto);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Получение списка скриптов в проекте
  @Get()
  @UseGuards(PermissionGuard)
  @Permission([PermissionEnum.SCRIPT_ACCESS, PermissionEnum.SCRIPT_VIEW], 'or')
  public async getScripts(@Param() param) {
    try {
      return await this.scriptService.getScripts({
        filter: { field: 'project_id', value: param.projectId },
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Получение инфомации по скрипту
  @Get(':scriptId')
  @UseGuards(PermissionGuard)
  @Permission([PermissionEnum.SCRIPT_ACCESS, PermissionEnum.SCRIPT_VIEW], 'or')
  public async info(@Req() req, @Param() param: SearchScriptParams) {
    try {
      return await this.scriptService.getOneScript({
        filter: [
          { field: 'id', value: param.scriptId },
          { field: 'project_id', value: param.projectId },
        ],
        relation: { name: 'questions' },
        throwException: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Обновление скрипта
  @Patch(':scriptId')
  @UseGuards(PermissionGuard)
  @Permission(
    [PermissionEnum.SCRIPT_ACCESS, PermissionEnum.SCRIPT_UPDATE],
    'or',
  )
  public async update(
    @Req() req,
    @Param() param: SearchScriptParams,
    @Body() body: Partial<CreateScriptDto>,
  ): Promise<Script> {
    try {
      await this.scriptService.updateScript(param, body, {
        throwException: true,
      });
      return await this.scriptService.getOneScript({
        filter: { field: 'id', value: param.scriptId },
        throwException: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Удаление скрипта
  @Delete(':scriptId')
  @UseGuards(PermissionGuard)
  @Permission(
    [PermissionEnum.SCRIPT_ACCESS, PermissionEnum.SCRIPT_DELETE],
    'or',
  )
  public async remove(
    @Req() req,
    @Param() param: SearchScriptParams,
  ): Promise<boolean> {
    try {
      return await this.scriptService.removeScript(param, {
        throwException: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
