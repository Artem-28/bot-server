import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
// Module

// Controller

// Service

// Entity
import { BaseEntity } from '@/base/entities/base.entity';
import { Script } from '@/modules/script/script.entity';

// Guard

// Types
import { QuestionTypeEnum } from '@/base/enum/dropdown-option/question-type.enum';
import { getUpdateDto } from '@/modules/question/dto/update-question.dto';

// Helper

@Entity({ name: 'questions' })
export class Question extends BaseEntity {
  @Column({ name: 'script_id' })
  scriptId: number;

  @Column({ type: 'enum', enum: QuestionTypeEnum })
  public type: QuestionTypeEnum;

  @Column({ default: false })
  public started: boolean;

  @Column({ nullable: true })
  public text: string;

  @ManyToOne(() => Script, (script) => script.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'script_id' })
  script: Script;

  constructor(partial: Partial<Question>) {
    super();
    Object.assign(this, partial);
  }

  update(partial: Partial<Question>) {
    const dto = getUpdateDto(partial);
    Object.assign(this, dto);
  }
}
