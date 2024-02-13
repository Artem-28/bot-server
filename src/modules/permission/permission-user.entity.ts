import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
// Module

// Controller

// Service

// Entity
import { BaseEntity } from '@/base/entities/base.entity';
import { Project } from '@/modules/project/project.entity';
import { User } from '@/modules/user/user.entity';
import { Permission } from '@/modules/permission/permission.entity';

// Guard

// Types
import { PermissionUserEnum } from '@/base/enum/permission/permission.enum';

// Helper

@Entity({ name: 'permission_users' })
@Unique(['userId', 'projectId', 'code'])
export class PermissionUser extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @Column({ type: 'enum', enum: PermissionUserEnum })
  public code: PermissionUserEnum;

  @ManyToOne(() => Project, (project) => project.permissions)
  @JoinColumn({ name: 'project_id' })
  public project: Project;

  @ManyToOne(() => User, (user) => user.permissions)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @ManyToOne(() => Permission, (permission) => permission.permissionUsers)
  @JoinColumn({ name: 'code' })
  public permission: Permission;

  constructor(partial: Partial<PermissionUser>) {
    super();
    Object.assign(this, partial);
  }
}
