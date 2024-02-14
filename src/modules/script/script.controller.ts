import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
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
import {
  SCRIPT_CREATE,
  SCRIPT_DELETE,
  SCRIPT_UPDATE,
  SCRIPT_VIEW,
} from '@/modules/check-permission/access-controllers/permission-controller.access';

// Types
import { CreateScriptDto } from '@/modules/script/dto/create-script.dto';

// Helper
import { formatParamHttp } from '@/base/helpers/formatter.helper';

@Controller('projects/:projectId/scripts')
@UseGuards(AuthJwtGuard)
export class ScriptController {
  constructor(readonly scriptService: ScriptService) {}

  // Создание скрипта
  @Post()
  @UseGuards(PermissionGuard)
  @Permission(SCRIPT_CREATE)
  public async create(
    @Param() param,
    @Body() body: CreateScriptDto,
  ): Promise<Script> {
    try {
      const { projectId } = formatParamHttp(param);
      body.projectId = projectId;

      return await this.scriptService.createScript(body);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Получение списка скриптов в проекте
  @Get()
  @UseGuards(PermissionGuard)
  @Permission(SCRIPT_VIEW)
  public async getScripts(@Param() param): Promise<Script[]> {
    try {
      const { projectId } = formatParamHttp(param);

      return await this.scriptService.getScripts({
        filter: { field: 'project_id', value: projectId },
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  // Получение инфомации по скрипту
  @Get(':scriptId')
  @UseGuards(PermissionGuard)
  @Permission(SCRIPT_VIEW)
  public async info(@Param() param): Promise<Script> {
    try {
      const { projectId, scriptId } = formatParamHttp(param);

      return await this.scriptService.getOneScript({
        filter: [
          { field: 'id', value: scriptId },
          { field: 'project_id', value: projectId },
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
  @Permission(SCRIPT_UPDATE)
  public async update(
    @Param() param,
    @Body() body: Partial<CreateScriptDto>,
  ): Promise<Script> {
    try {
      param = formatParamHttp(param);
      await this.scriptService.updateScript(body, {
        throwException: true,
        param,
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
  @Permission(SCRIPT_DELETE)
  public async remove(@Param() param): Promise<boolean> {
    try {
      return await this.scriptService.removeScript({
        throwException: true,
        param: formatParamHttp(param),
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
