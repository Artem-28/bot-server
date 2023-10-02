import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from '../../base/entities/base.entity';
import { Script } from '../script/script.entity';
import { User } from '../user/user.entity';
import { ProjectSubscriber } from '../project-subscriber/projectSubscriber.entity';

@Entity({ name: 'projects' })
export class Project extends BaseEntity {
  @Column()
  public title: string;

  @Column({ name: 'user_id', nullable: true })
  public userId: number;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @OneToMany(() => Script, (script) => script.project)
  public scripts: Script[];

  @OneToMany(
    () => ProjectSubscriber,
    (projectSubscriber) => projectSubscriber.project,
  )
  public subscribers: User[];

  // @ManyToMany(() => User, (user) => user.subscribedProjects)
  // @JoinTable({
  //   name: 'project_users',
  //   joinColumn: {
  //     name: 'project_id',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'user_id',
  //     referencedColumnName: 'id',
  //   },
  // })
  // subscribers: User[];

  constructor(partial: Partial<Project>) {
    super();
    Object.assign(this, partial);
  }

  public checkOwner(userId: number): boolean {
    return this.userId === userId;
  }
}
