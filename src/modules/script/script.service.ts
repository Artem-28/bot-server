import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Script } from './script.entity';
import { CreateScriptDto } from './dto/create-script.dto';
import {
  IFilterQueryBuilder,
  whereQueryBuilder,
} from '../../base/helpers/where-query-builder';
import { Options } from '../../base/interfaces/service.interface';

@Injectable()
export class ScriptService {
  constructor(
    @InjectRepository(Script)
    private readonly _scriptRepository: Repository<Script>,
  ) {}

  // Создание скрипта
  private async _create(dto: CreateScriptDto): Promise<Script> {
    const response = await this._scriptRepository.save(dto);
    return new Script(response);
  }

  // Обновление скрипта
  private async _update(
    id: number,
    payload: Partial<CreateScriptDto>,
  ): Promise<boolean> {
    const response = await this._scriptRepository
      .createQueryBuilder('script')
      .update()
      .set(payload)
      .where({ id })
      .execute();
    return !!response.affected;
  }

  // Удаление скрипта по id
  private async _remove(id: number): Promise<boolean> {
    const response = await this._scriptRepository
      .createQueryBuilder()
      .delete()
      .from(Script)
      .where({ id })
      .execute();

    return !!response.affected;
  }

  // Получение скрипта по id
  public async getById(id: number, filters: IFilterQueryBuilder[] = []) {
    const rootQuery = this._scriptRepository
      .createQueryBuilder('script')
      .where({ id });

    const query = whereQueryBuilder(
      rootQuery,
      filters,
    ) as SelectQueryBuilder<Script>;

    const response = await query.getOne();
    if (!response) return null;
    return new Script(response);
  }

  // Получение списка скриптов по id проекта
  public async getScriptsByProjectId(projectId: number) {
    return await this._scriptRepository
      .createQueryBuilder('script')
      .where({ projectId })
      .getMany();
  }

  // Обработка создания скрипта
  public async createScriptHandle(dto: CreateScriptDto): Promise<Script> {
    return await this._create(dto);
  }

  // Обработка обновления скрипта
  public async updateScriptHandle(
    scriptId: number,
    payload: Partial<CreateScriptDto>,
  ) {
    const success = await this._update(scriptId, payload);
    if (!success) {
      throw new HttpException('script.update', 500);
    }
    return this.getById(scriptId);
  }

  // Обработка удаления скрипта
  public async removeScriptHandle(scriptId: number): Promise<void> {
    const success = await this._remove(scriptId);
    if (!success) {
      throw new HttpException('script.remove', 500);
    }
  }

  public async createScript(dto: CreateScriptDto, options: Options = {}) {
    const { throwException } = options;
    const response = await this._scriptRepository.save(dto);
    if (!response && throwException) {
      throw new HttpException('script.create', 500);
    }
    return new Script(response);
  }
}
