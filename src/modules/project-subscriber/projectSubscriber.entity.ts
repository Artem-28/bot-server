import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne, Unique,
} from 'typeorm';
import { BaseEntity } from '../../base/entities/base.entity';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';

@Entity({ name: 'project_users' })
@Unique(['project', 'user'])
export class ProjectSubscriber extends BaseEntity {
  @Column({ name: 'project_id', nullable: true })
  public projectId: number;

  @Column({ name: 'user_id', nullable: true })
  public userId: number;

  @ManyToOne(() => Project, (project) => project.subscribers)
  @JoinColumn({ name: 'project_id' })
  public project: Project;

  @ManyToOne(() => User, (user) => user.subscribedProjects)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  constructor(partial: Partial<ProjectSubscriber>) {
    super();
    Object.assign(this, partial);
  }
}
