import { BaseEntity } from '../../base/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Script } from '../script/script.entity';

@Entity({ name: 'projects' })
export class Project extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  title: string;

  @OneToMany(() => Script, (script) => script.project)
  scripts: Script[];

  constructor(partial: Partial<Project>) {
    super();
    Object.assign(this, partial);
  }
}
