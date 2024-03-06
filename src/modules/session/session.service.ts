import { HttpException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Session } from '@/modules/session/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSessionDto } from '@/modules/session/dto/session.dto';
import { Options } from '@/base/interfaces/service.interface';
import { RespondentService } from '@/modules/respondent/respondent.service';
import { ProjectService } from '@/modules/project/project.service';
import { ScriptService } from '@/modules/script/script.service';
import { Respondent } from '@/modules/respondent/respondent.entity';
import { compareFieldValues } from '@/base/helpers/object.helper';
import QueryBuilderHelper from '@/base/helpers/query-builder.helper';

@Injectable()
export class SessionService {
  constructor(
    private readonly _dataSource: DataSource,
    @InjectRepository(Session)
    private readonly _sessionRepository: Repository<Session>,
    private readonly _projectService: ProjectService,
    private readonly _respondentService: RespondentService,
    private readonly _scriptService: ScriptService,
  ) {}

  // Создание новой сессии
  public async createSession(dto: CreateSessionDto, options?: Options) {
    const throwException = options && options.throwException;
    // Получаем скрипт по id
    const script = await this._scriptService.getOneScript({
      filter: { field: 'id', value: dto.scriptId },
      throwException,
    });
    // Если не получили скрипт то выходим из функции
    if (!script) return null;

    // Пробуем найти респондента если такой уже был создан ранее
    let respondent = await this._respondentService.getOneRespondent({
      filter: { field: 'email', value: dto.respondent.email },
    });

    // Если не нашли респондента создаем нового
    if (!respondent) {
      respondent = new Respondent(dto.respondent);
    }

    // Запускаем транзакцию
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manger = queryRunner.manager;
    try {
      const param = { projectId: script.projectId };
      // Добавляем респондента в проект
      const project = await this._projectService.addRespondentToProject(
        respondent,
        { param, throwException: true, dataSourceManager: manger },
      );

      // Ищем добавленного респондента
      respondent = project.respondents.find((r) =>
        compareFieldValues(r, respondent, 'email'),
      );

      // Создаем сессию
      const data = new Session({
        scriptId: script.id,
        respondentId: respondent.id,
      });
      // Сохраняем новую сессию
      const session = await manger.save(data);
      // Останавливаем транзакцию
      await queryRunner.commitTransaction();
      return session;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (throwException) {
        throw new HttpException('session.create', 500);
      }
      return null;
    } finally {
      await queryRunner.release();
    }
  }

  public async getOneSession(options: Options): Promise<Session | null> {
    const { filter, relation, throwException } = options;
    const queryHelper = new QueryBuilderHelper(this._sessionRepository, {
      filter,
      relation,
    });

    const response = await queryHelper.builder.getOne();
    if (!response && throwException) {
      throw new HttpException('session.get', 500);
    }
    if (!response) return null;
    return response;
  }
}
