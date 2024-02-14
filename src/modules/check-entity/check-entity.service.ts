import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Module

// Controller

// Service

// Entity
import { Script } from '@/modules/script/script.entity';
import { User } from '@/modules/user/user.entity';
import { Question } from '@/modules/question/question.entity';

// Guard

// Types
import { BaseHttpParam } from '@/base/interfaces/base.interface';

// Helper
import QueryBuilderHelper from '@/base/helpers/query-builder.helper';
import { checkRequiredField } from '@/base/helpers/object.helper';

@Injectable()
export class CheckEntityService {
  constructor(
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
    @InjectRepository(Script)
    private readonly _scriptsRepository: Repository<Script>,
    @InjectRepository(Question)
    private readonly _questionRepository: Repository<Question>,
  ) {}

  // Проверяет принадлежит ли скрипт к проекту
  public async checkScriptBelongsToProject(
    param: BaseHttpParam,
    throwException?: boolean,
  ): Promise<boolean> {
    // Валидация входящих параметров
    const validParam = checkRequiredField(
      param,
      ['projectId', 'scriptId'],
      throwException,
    );
    if (!validParam) return false;

    const { projectId, scriptId } = param;
    const queryHelper = new QueryBuilderHelper(this._scriptsRepository, {
      filter: [
        { field: 'id', value: scriptId },
        { field: 'projectId', value: projectId },
      ],
    });

    const exists = await queryHelper.builder.getExists();
    if (throwException && !exists) {
      throw new HttpException(
        'script.check_belongs_to_project.not_found_script',
        500,
      );
    }
    return !!exists;
  }

  // Проверяет является ли пользователь подписчиком на проект
  public async checkUserSubscriptionToProject(
    param: BaseHttpParam,
    throwException?: boolean,
  ): Promise<boolean> {
    // Валидация входящих параметров
    const validParam = checkRequiredField(
      param,
      ['userId', 'projectId'],
      throwException,
    );
    if (!validParam) return false;

    const { userId, projectId } = param;
    const queryHelper = new QueryBuilderHelper(this._usersRepository, {
      filter: [
        { field: 'id', value: userId },
        { field: 'subscribedProjects.projectId', value: projectId },
      ],
      relation: [{ name: 'subscribedProjects', select: 'projectId' }],
    });

    const exists = await queryHelper.builder.getExists();
    if (throwException && !exists) {
      throw new HttpException(
        'user.check_subscription_to_project.not_found',
        500,
      );
    }
    return exists;
  }

  public async checkAccessQuestion(
    param: BaseHttpParam,
    throwException?: boolean,
  ): Promise<boolean> {
    const validParam = checkRequiredField(
      param,
      ['projectId', 'scriptId', 'questionId'],
      throwException,
    );
    if (!validParam) return false;

    const { questionId, scriptId, projectId } = param;
    const queryHelper = new QueryBuilderHelper(this._questionRepository, {
      filter: [
        { field: 'id', value: questionId },
        { field: 'scriptId', value: scriptId },
        { field: 'script.projectId', value: projectId },
      ],
      relation: { name: 'script' },
    });

    const exists = await queryHelper.builder.getExists();
    if (throwException && !exists) {
      throw new HttpException('question.check.not_found', 500);
    }
    return exists;
  }
}
