import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../base/entities/base.entity';
import { Script } from '../script/script.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'projects' })
export class Project extends BaseEntity {
  @Column()
  title: string;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Script, (script) => script.project)
  scripts: Script[];

  constructor(partial: Partial<Project>) {
    super();
    Object.assign(this, partial);
  }
}
