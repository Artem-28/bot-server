import {
  Body,
  Controller,
  HttpException,
  Param,
  Post,
  Get,
  Req,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { ScriptService } from './script.service';
import { AuthJwtGuard } from '../auth/passport/guards/auth-jwt.guard';
import { CreateScriptDto } from './dto/create-script.dto';
import { PermissionGuard } from '../check-permission/guards/permission.guard';
import { Permission } from '../check-permission/decorators/permission.decorator';
import { PermissionEnum } from '../../base/enum/permission/permission.enum';

@Controller('projects/:projectId/scripts')
@UseGuards(AuthJwtGuard, PermissionGuard)
export class ScriptController {
  constructor(readonly scriptService: ScriptService) {}

  @Get()
  public async list(@Param() param) {
    try {
      const projectId = Number(param.projectId);
      return this.scriptService.getScriptsByProjectId(projectId);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Post()
  public async create(
    @Req() req,
    @Param() param,
    @Body() body: CreateScriptDto,
  ) {
    try {
      const dto = { ...body, projectId: Number(param.projectId) };
      return await this.scriptService.createScript(dto);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Patch(':scriptId')
  public async update(
    @Req() req,
    @Param() param,
    @Body() body: Partial<CreateScriptDto>,
  ) {
    try {
      body.projectId = Number(param.projectId);
      const scriptId = Number(param.scriptId);
      return await this.scriptService.updateScriptHandle(scriptId, body);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Delete(':scriptId')
  public async remove(@Req() req, @Param() param) {
    try {
      const scriptId = Number(param.scriptId);
      return await this.scriptService.removeScriptHandle(scriptId);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
