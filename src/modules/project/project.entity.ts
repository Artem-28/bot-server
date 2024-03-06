import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

// Module

// Controller

// Service

// Entity
import { BaseEntity } from '@/base/entities/base.entity';
import { User } from '@/modules/user/user.entity';
import { Script } from '@/modules/script/script.entity';
import { ProjectSubscriber } from '@/modules/project-subscriber/projectSubscriber.entity';
import { PermissionUser } from '@/modules/permission/permission-user.entity';
import { Respondent } from '@/modules/respondent/respondent.entity';

// Guard

// Types

// Helper
import { toArray } from '@/base/helpers/array.helper';
import {
  checkRequiredField,
  compareFieldValues,
} from '@/base/helpers/object.helper';

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
  public subscribers: ProjectSubscriber[];

  @OneToMany(() => PermissionUser, (permissionUser) => permissionUser.project)
  public permissions: PermissionUser[];

  @ManyToMany(() => Respondent, (respondent) => respondent.projects, {
    cascade: true,
  })
  @JoinTable({
    name: 'respondent_projects',
    joinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'respondent_id',
      referencedColumnName: 'id',
    },
  })
  respondents: Respondent[];

  public subscriptionAt: Date | null = null;

  // get subscribeAt() {
  //   return this._subscribeAt;
  // }

  constructor(partial: Partial<Project>) {
    super();
    Object.assign(this, partial);
  }

  public checkOwner(userId: number): boolean {
    return this.userId === userId;
  }

  public existRespondent(
    respondent: Respondent,
    field: string | string[] = 'id',
  ): boolean {
    const fields = toArray(field);
    const checkFields = checkRequiredField(respondent, fields);
    if (!checkFields) return false;
    return toArray(this.respondents).some((r) =>
      compareFieldValues(r, respondent, fields),
    );
  }

  public insertRespondent(respondents: Respondent | Respondent[]) {
    const newRespondents = [];
    toArray(respondents).forEach((respondent) => {
      if (this.existRespondent(respondent)) return;
      newRespondents.push(respondent);
    });
    this.respondents = [...toArray(this.respondents), ...newRespondents];
  }
}
