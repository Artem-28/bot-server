import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
// Module

// Controller

// Service

// Entity
import { BaseEntity } from '@/base/entities/base.entity';
import { Project } from '@/modules/project/project.entity';

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

  constructor(partial: Partial<Script>) {
    super();
    Object.assign(this, partial);
  }
}
