import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
// Module

// Controller

// Service

// Entity
import { Question } from '@/modules/question/question.entity';
import { CheckEntityService } from '@/modules/check-entity/check-entity.service';

// Guard

// Types
import { QuestionDto } from '@/modules/question/dto/question.dto';
import { Options } from '@/base/interfaces/service.interface';

// Helper
import QueryBuilderHelper from '@/base/helpers/query-builder.helper';
import { checkRequiredField } from '@/base/helpers/object.helper';

@Injectable()
export class QuestionService {
  constructor(
    private readonly _dataSource: DataSource,
    @InjectRepository(Question)
    private readonly _questionRepository: Repository<Question>,
    private readonly _checkEntityService: CheckEntityService,
  ) {}
  // Создание
  public async createQuestion(
    dto: QuestionDto,
    options: Options,
  ): Promise<Question> {
    const { throwException, param } = options;

    // Проверка принадлежит ли скрипт к проекту
    const checkScript =
      await this._checkEntityService.checkScriptBelongsToProject(
        param,
        throwException,
      );
    if (!checkScript) return null;

    let question = new Question(dto);
    let startQuestion: Question | null = null;

    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Если передан флаг для установки стартового блока
      if (question.started) {
        // Находим стартовый блок если он есть
        startQuestion = await this.getOneQuestion({
          filter: [
            { field: 'scriptId', value: question.scriptId },
            { field: 'started', value: true },
          ],
        });
      }
      // Если есть стартовый блок то переключаем флаг
      if (startQuestion) {
        startQuestion.update({ started: false });
        await queryRunner.manager.save(startQuestion);
      }

      question = await queryRunner.manager.save(question);

      await queryRunner.commitTransaction();
      return question;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (throwException) {
        throw new HttpException('question.create', 500);
      }
      return null;
    } finally {
      await queryRunner.release();
    }
  }

  public async updateQuestion(
    data: Partial<QuestionDto>,
    options: Options,
  ): Promise<Question> {
    const { throwException, param } = options;

    const validParam = checkRequiredField(
      param,
      ['projectId', 'scriptId', 'questionId'],
      throwException,
    );
    if (!validParam) return null;

    const { questionId, scriptId, projectId } = param;
    let startQuestion: Question | null = null;
    const question = await this.getOneQuestion({
      filter: [
        { field: 'id', value: questionId },
        { field: 'scriptId', value: scriptId },
        { field: 'script.projectId', value: projectId },
      ],
      relation: { name: 'script', select: 'projectId' },
      throwException,
    });
    if (!question) return null;

    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Если передан флаг для установки стартового блока
      if (data.started) {
        // Находим стартовый блок если он есть
        startQuestion = await this.getOneQuestion({
          filter: [
            { field: 'scriptId', value: scriptId },
            { field: 'started', value: true },
          ],
        });
      }
      // Если есть стартовый блок то переключаем флаг
      if (startQuestion) {
        startQuestion.update({ started: false });
        await queryRunner.manager.save(startQuestion);
      }
      question.update(data);
      const response = await queryRunner.manager.save(question);
      await queryRunner.commitTransaction();
      return response;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (throwException) {
        throw new HttpException('question.update', 500);
      }
      return null;
    } finally {
      await queryRunner.release();
    }
  }

  // Получение одной записи question
  public async getOneQuestion(options: Options): Promise<Question> {
    const { filter, relation, throwException } = options;
    const queryHelper = new QueryBuilderHelper(this._questionRepository, {
      filter,
      relation,
    });
    const response = await queryHelper.builder.getOne();
    if (!response && throwException) {
      throw new HttpException('question.get', 500);
    }
    if (!response) return null;
    return response;
  }

  // Удаление
  public async removeQuestion(options: Options): Promise<boolean> {
    const { throwException, param } = options;
    const { questionId: id, scriptId } = param;
    const exist = await this._checkEntityService.checkAccessQuestion(
      param,
      throwException,
    );
    if (!exist) return false;

    // Если запись существует то удаляем
    const response = await this._questionRepository
      .createQueryBuilder()
      .delete()
      .from(Question)
      .where({ id })
      .andWhere({ scriptId })
      .execute();

    const success = !!response.affected;

    if (!success && throwException) {
      throw new HttpException('question.remove', 500);
    }
    return true;
  }
}
