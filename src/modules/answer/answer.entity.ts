import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

// Module

// Controller

// Service
import { BaseEntity } from '@/base/entities/base.entity';
import { Question } from '@/modules/question/question.entity';

// Entity

// Guard

// Types
import { getUpdateDto } from '@/modules/answer/dto/answer.dto';

// Helper

@Entity({ name: 'answers' })
export class Answer extends BaseEntity {
  @Column({ name: 'question_id' })
  questionId: number;

  @Column({ nullable: true })
  public text: string;

  @ManyToOne(() => Question, (question) => question.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  constructor(partial: Partial<Answer>) {
    super();
    Object.assign(this, partial);
  }

  update(partial: Partial<Answer>) {
    const dto = getUpdateDto(partial);
    Object.assign(this, dto);
  }
}
