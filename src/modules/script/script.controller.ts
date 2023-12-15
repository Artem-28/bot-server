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
import { UpdateScriptDto } from '@/modules/script/dto/update-script-dto';
import { PermissionEnum } from '@/base/enum/permission/permission.enum';

// Helper

@Controller('scripts')
@UseGuards(AuthJwtGuard, PermissionGuard)
export class ScriptController {
  constructor(readonly scriptService: ScriptService) {}

  @Post()
  @Permission(
    [PermissionEnum.SCRIPT_ACCESS, PermissionEnum.SCRIPT_CREATE],
    'or',
  )
  public async create(
    @Req() req,
    @Body() body: CreateScriptDto,
  ): Promise<Script> {
    try {
      return await this.scriptService.createScript(body);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Get(':scriptId')
  @Permission([PermissionEnum.SCRIPT_ACCESS, PermissionEnum.SCRIPT_VIEW], 'or')
  public async info(@Req() req, @Param() param) {
    try {
      const scriptId = +param.scriptId;
      return await this.scriptService.getOneScript({
        filter: { field: 'id', value: scriptId },
        throwException: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Patch(':scriptId')
  @Permission(
    [PermissionEnum.SCRIPT_ACCESS, PermissionEnum.SCRIPT_UPDATE],
    'or',
  )
  public async update(
    @Req() req,
    @Param() param,
    @Body() body: UpdateScriptDto,
  ): Promise<Script> {
    try {
      const scriptId = +param.scriptId;
      await this.scriptService.updateScript(scriptId, body, {
        throwException: true,
      });
      return await this.scriptService.getOneScript({
        filter: { field: 'id', value: scriptId },
        throwException: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Delete(':scriptId')
  @Permission(
    [PermissionEnum.SCRIPT_ACCESS, PermissionEnum.SCRIPT_DELETE],
    'or',
  )
  public async remove(@Req() req, @Param() param): Promise<boolean> {
    try {
      const scriptId = +param.scriptId;
      return await this.scriptService.removeScript(scriptId, {
        throwException: true,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
