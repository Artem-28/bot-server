import { Column, Entity, ManyToMany, OneToMany, JoinTable } from 'typeorm';
// Module

// Controller

// Service

// Entity
import { BaseEntity } from '@/base/entities/base.entity';
import { Project } from '@/modules/project/project.entity';
import { Session } from '@/modules/session/session.entity';

// Guard

// Types

// Helper

@Entity({ name: 'respondents' })
export class Respondent extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @ManyToMany(() => Project)
  @JoinTable({
    name: 'respondent_projects',
    joinColumn: {
      name: 'respondent_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    },
  })
  public projects: Project[];

  @OneToMany(() => Session, (session) => session.respondent)
  public sessions: Session[];

  constructor(partial: Partial<Respondent>) {
    super();
    Object.assign(this, partial);
  }
}
