import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
// Module

// Controller

// Service

// Entity
import { BaseEntity } from '@/base/entities/base.entity';
import { Project } from '@/modules/project/project.entity';
import { Question } from '@/modules/question/question.entity';
import { Session } from '@/modules/session/session.entity';

// Guard

// Types

// Helper

@Entity({ name: 'scripts' })
export class Script extends BaseEntity {
  @Column()
  title: string;

  @Column({ name: 'project_id', nullable: true })
  projectId: number;

  @ManyToOne(() => Project, (project) => project.scripts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => Question, (question) => question.script)
  public questions: Question[];

  @OneToMany(() => Session, (session) => session.script)
  public sessions: Session[];

  constructor(partial: Partial<Script>) {
    super();
    Object.assign(this, partial);
  }
}
