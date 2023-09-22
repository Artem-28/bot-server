import { BaseEntity } from '../../base/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Project } from '../project/project.entity';

@Entity({ name: 'scripts' })
export class Script extends BaseEntity {
  @Column({ name: 'project_id' })
  projectId: number;

  @Column()
  title: string;

  @ManyToOne(() => Project, (project) => project.scripts)
  project: Project;
}
