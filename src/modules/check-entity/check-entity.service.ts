import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Module

// Controller

// Service

// Entity
import { Script } from '@/modules/script/script.entity';
import { User } from '@/modules/user/user.entity';

// Guard

// Types
import { BaseHttpParam } from '@/base/interfaces/base.interface';

// Helper
import QueryBuilderHelper from '@/base/helpers/query-builder.helper';
import { checkRequiredField } from '@/base/helpers/object.helper';

@Injectable()
export class CheckEntityService {
  constructor(
    @InjectRepository(Script)
    private readonly _scriptsRepository: Repository<Script>,
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
  ) {}

  // Проверяет принадлежит ли скрипт к проекту
  public async checkScriptBelongsToProject(
    param: BaseHttpParam,
    throwException?: boolean,
  ): Promise<boolean> {
    // Валидация входящих параметров
    const isValidParam = checkRequiredField(param, ['projectId', 'scriptId']);
    if (!isValidParam && throwException) {
      throw new HttpException(
        'script.check_belongs_to_project.invalid_param',
        500,
      );
    }
    if (!isValidParam) return false;

    const queryHelper = new QueryBuilderHelper(this._scriptsRepository, {
      filter: [
        { field: 'id', value: param.scriptId },
        { field: 'projectId', value: param.projectId },
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
    const isValidParam = checkRequiredField(param, ['userId', 'projectId']);
    if (!isValidParam && throwException) {
      throw new HttpException(
        'user.check_subscription_to_project.invalid_param',
        500,
      );
    }
    if (!isValidParam) return false;

    const queryHelper = new QueryBuilderHelper(this._usersRepository, {
      filter: [
        { field: 'id', value: param.userId },
        { field: 'subscribedProjects.projectId', value: param.projectId },
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
}
