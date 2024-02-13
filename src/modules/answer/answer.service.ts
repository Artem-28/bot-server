import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
// Module

// Controller

// Service

// Entity
import { Answer } from '@/modules/answer/answer.entity';
import { AnswerDto } from '@/modules/answer/dto/answer.dto';
import { Options } from '@/base/interfaces/service.interface';

// Guard

// Types

// Helper

@Injectable()
export class AnswerService {
  constructor(
    private readonly _dataSource: DataSource,
    @InjectRepository(Answer)
    private readonly _answerRepository: Repository<Answer>,
  ) {}

  public async createAnswer(dto: AnswerDto, options?: Options) {
    const answer = new Answer(dto);
    const res = await this._dataSource.manager.save(answer);
    console.log(res);
  }
}
