import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Script } from './script.entity';
import { ProjectService } from '../project/project.service';
import { CreateScriptDto } from './dto/create-script.dto';
import { User } from '../user/user.entity';

@Injectable()
export class ScriptService {
  constructor(
    @InjectRepository(Script)
    private readonly _scriptRepository: Repository<Script>,
    private readonly _projectService: ProjectService,
  ) {}

  // Создание скрипта
  private async _create(payload: CreateScriptDto): Promise<Script> {
    const response = await this._scriptRepository.save(payload);
    return new Script(response);
  }

  // Обработка создания скрипта
  public async createScriptHandle(
    user: User,
    projectId: number,
    payload: CreateScriptDto,
  ) {
    // Проверка прав пользователя для создания скрипта в конкретном проекте
  }

  public async getScriptsByProjectId(userId: number, projectId) {
    const scripts = this._projectService.getById(projectId);
    console.log(scripts);
    return scripts;
  }
}
