import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../base/entities/base.entity';
import { Project } from '../project/project.entity';

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
