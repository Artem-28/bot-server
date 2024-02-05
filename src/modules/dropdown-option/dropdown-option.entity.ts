import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';

// Module
// Controller
// Service
// Entity
// Guard
// Types
import { QuestionTypeEnum } from '@/base/enum/dropdown-option/question-type.enum';
import { DropdownTypeEnum } from '@/base/enum/dropdown-option/dropdown-type.enum';

// Helper

@Entity({ name: 'dropdown_options' })
@Unique(['type', 'code'])
export class DropdownOption {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ type: 'enum', enum: DropdownTypeEnum })
  @Exclude()
  public type: DropdownTypeEnum;

  @Column({ type: 'enum', enum: QuestionTypeEnum })
  public code: QuestionTypeEnum;

  @Column()
  public label: string;

  @Column()
  @Exclude()
  public enable: boolean;
}
