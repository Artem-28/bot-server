import {
  Body,
  Controller,
  HttpException,
  Param,
  Post,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ScriptService } from './script.service';
import { AuthJwtGuard } from '../auth/passport/guards/auth-jwt.guard';
import { CreateScriptDto } from './dto/create-script.dto';

@Controller('projects/:projectId/scripts')
export class ScriptController {
  constructor(readonly scriptService: ScriptService) {}

  @UseGuards(AuthJwtGuard)
  @Post()
  public async create(
    @Req() req,
    @Param() param,
    @Body() createScriptDto: CreateScriptDto,
  ) {
    try {
      const projectId = Number(param.projectId);
      return await this.scriptService.createScriptHandle(
        req.user,
        projectId,
        createScriptDto,
      );
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @UseGuards(AuthJwtGuard)
  @Get()
  public async list() {
    try {
      return this.scriptService.getScriptsByProjectId(1, 1);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
