import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
// Module

// Controller

// Service

// Entity
import { Question } from '@/modules/question/question.entity';

// Guard

// Types
import { CreateQuestionDto } from '@/modules/question/dto/create-question.dto';
import { Options } from '@/base/interfaces/service.interface';
import { SearchQuestionParams } from '@/modules/question/util/search-question.params';

// Helper
import QueryBuilderHelper from '@/base/helpers/query-builder-helper';

@Injectable()
export class QuestionService {
  constructor(
    private readonly _dataSource: DataSource,
    @InjectRepository(Question)
    private readonly _questionRepository: Repository<Question>,
  ) {}
  // Создание
  public async createQuestion(
    dto: CreateQuestionDto,
    options?: Options,
  ): Promise<Question> {
    const throwException = options && options.throwException;
    const question = new Question(dto);
    let startQuestion: Question | null = null;

    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Если передан флаг для установки стартового блока
      if (dto.started) {
        const filter = [
          { field: 'scriptId', value: dto.scriptId },
          { field: 'started', value: true },
        ];
        // Находим стартовый блок если он есть
        startQuestion = await this.getOneQuestion({ filter });
      }
      // Если есть стартовый блок то переключаем флаг
      if (startQuestion) {
        startQuestion.update({ started: false });
        await queryRunner.manager.save(startQuestion);
      }
      const response = await queryRunner.manager.save(question);
      await queryRunner.commitTransaction();
      return response;
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
    searchParams: SearchQuestionParams,
    data: Partial<CreateQuestionDto>,
    options?: Options,
  ) {
    const { questionId, scriptId, projectId } = searchParams;
    const throwException = options && options.throwException;
    let startQuestion: Question | null = null;
    const question = await this.getOneQuestion({
      filter: [
        { field: 'id', value: questionId },
        { field: 'scriptId', value: scriptId },
      ],
      relation: { name: 'script', select: 'projectId' },
    });
    const valid = question && question.script.projectId === +projectId;
    if (!valid && throwException) {
      throw new HttpException('question.update', 500);
    }
    if (!valid) return null;

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
        throw new HttpException('question.create', 500);
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

  // Проверяет существует ли question по id, scriptId и projectId
  public async isExistQuestion(
    searchParams: SearchQuestionParams,
    options?: Options,
  ): Promise<boolean> {
    const throwException = options && options.throwException;
    const { questionId, scriptId, projectId } = searchParams;
    const question = await this.getOneQuestion({
      filter: [
        { field: 'id', value: questionId },
        { field: 'scriptId', value: scriptId },
      ],
      relation: { name: 'script', select: 'projectId' },
    });
    const valid = question && question.script.projectId === +projectId;
    if (!valid && throwException) {
      throw new HttpException('question.does_not_exist', 404);
    }
    return valid;
  }

  // Удаление
  public async removeQuestion(
    searchParams: SearchQuestionParams,
    options?: Options,
  ): Promise<boolean> {
    const throwException = options && options.throwException;
    // Проверяем на существование записи
    const exist = await this.isExistQuestion(searchParams, { throwException });
    if (!exist) return false;
    // Если запись существует то удаляем
    const id = searchParams.questionId;
    const response = await this._questionRepository
      .createQueryBuilder()
      .delete()
      .from(Question)
      .where({ id })
      .execute();

    const success = !!response.affected;

    if (!success && throwException) {
      throw new HttpException('question.remove', 500);
    }
    return true;
  }
}
